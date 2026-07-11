<template>
    <div class="p-ai-editor">
        <CommonHeader></CommonHeader>

        <main class="m-ai-editor">
            <header class="m-ai-editor__header">
                <div>
                    <div class="m-ai-editor__title">
                        <h1>{{ $t("ai.editor.title") }}</h1>
                        <el-dropdown
                            class="m-ai-editor__version-dropdown"
                            trigger="click"
                            @command="handleVersionCommand"
                        >
                            <button class="m-ai-editor__version" type="button">
                                <span>{{ activeVersion.label }}</span>
                                <el-icon><ArrowDown /></el-icon>
                            </button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item
                                        v-for="item in appVersions"
                                        :key="item.value"
                                        :command="item.value"
                                        :disabled="item.disabled"
                                    >
                                        {{ item.label }} · {{ item.name }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <p>{{ $t("ai.editor.description") }}</p>
                </div>
                <div class="m-ai-editor__actions">
                    <el-button :icon="DocumentCopy" type="primary" @click="copyContent">{{ $t("ai.editor.copyHtml") }}</el-button>
                    <el-button :icon="Delete" @click="clearContent">{{ $t("ai.editor.clear") }}</el-button>
                    <el-dropdown trigger="click" @command="handleActionCommand">
                        <el-button :loading="sampleLoading">
                            {{ $t("ai.editor.more") }}
                            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="loadSample" :icon="RefreshLeft" :disabled="sampleLoading">
                                    {{ $t("ai.editor.loadSample") }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </header>

            <section class="m-ai-editor__toolbar">
                <div class="m-ai-editor__tool-group">
                    <span class="m-ai-editor__tool-label">{{ $t("ai.editor.previewSize") }}</span>
                    <el-segmented v-model="previewWidth" :options="previewWidthOptions" />
                </div>
                <div class="m-ai-editor__tool-group">
                    <span class="m-ai-editor__tool-label">{{ $t("ai.editor.theme") }}</span>
                    <el-switch v-model="darkPreview" :active-text="$t('ai.editor.dark')" :inactive-text="$t('ai.editor.light')" />
                </div>
                <div class="m-ai-editor__tool-group">
                    <span class="m-ai-editor__tool-label">{{ $t("ai.editor.render") }}</span>
                    <el-switch v-model="pageable" :active-text="$t('ai.editor.paginated')" :inactive-text="$t('ai.editor.singlePage')" />
                </div>
                <div class="m-ai-editor__tool-group">
                    <span class="m-ai-editor__tool-label">{{ $t("ai.editor.body") }}</span>
                    <el-switch
                        :model-value="cleanPreview"
                        :active-text="$t('ai.editor.clean')"
                        :inactive-text="$t('ai.editor.original')"
                        @change="handleCleanPreviewChange"
                    />
                    <el-tooltip :content="$t('ai.editor.cleanModeTip')" placement="top">
                        <span class="m-ai-editor__info">i</span>
                    </el-tooltip>
                </div>
            </section>

            <section v-if="issues.length" class="m-ai-editor__issues">
                <strong>{{ $t("ai.editor.checkTips") }}</strong>
                <ul>
                    <li v-for="item in issues" :key="item">{{ item }}</li>
                </ul>
            </section>

            <section class="m-ai-editor__workspace">
                <div class="m-ai-editor__panel m-ai-editor__input">
                    <div class="u-panel-title">
                        <span>{{ $t("ai.editor.htmlInput") }}</span>
                        <em>{{ $t("ai.editor.characterCount", { count: contentLength }) }}</em>
                    </div>
                    <textarea
                        v-model="content"
                        spellcheck="false"
                        :placeholder="$t('ai.editor.inputPlaceholder')"
                    ></textarea>
                </div>

                <div class="m-ai-editor__panel m-ai-editor__preview">
                    <div class="u-panel-title">
                        <span>{{ $t("ai.editor.renderPreview") }}</span>
                        <em>{{ previewLabel }}</em>
                    </div>
                    <div class="m-ai-editor__preview-stage" :class="{ 'is-dark': darkPreview }">
                        <div class="m-ai-editor__preview-canvas" :style="previewCanvasStyle">
                            <Article
                                v-if="content"
                                :key="renderKey"
                                :content="previewContent"
                                :pageable="pageable"
                                post_mode="tinymce"
                            />
                            <div v-else class="m-ai-editor__empty">
                                <el-icon><Document /></el-icon>
                                <span>{{ $t("ai.editor.emptyPreview") }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import { ArrowDown, Delete, Document, DocumentCopy, RefreshLeft } from "@element-plus/icons-vue";
import Article from "@jx3box/jx3box-editor/src/Article.vue";
import execFilterXSS from "@jx3box/jx3box-editor/src/assets/js/xss.js";
import { getArticle } from "@jx3box/jx3box-common/js/system";

const STORAGE_KEY = "jx3box_ai_editor_preview_html";
const VERSION_STORAGE_KEY = "jx3box_ai_editor_version";
const CLEAN_PREVIEW_STORAGE_KEY = "jx3box_ai_editor_clean_preview";
const CLEAN_PREVIEW_TOUCHED_STORAGE_KEY = "jx3box_ai_editor_clean_preview_touched";
const SAMPLE_ARTICLE_ID = 108989;
const APP_VERSIONS = [
    {
        value: "v0.0.1",
        label: "v0.0.1",
        nameKey: "ai.editor.basicPreviewVersion",
        mode: "preview",
        aiEnabled: false,
    },
];
function normalizeAttributeValue(name, value) {
    if (name !== "style") return String(value || "").trim();

    const el = document.createElement("span");
    el.setAttribute("style", value || "");
    return el.style.cssText
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
        .sort()
        .join(";");
}

function normalizeHtmlForCompare(html) {
    const template = document.createElement("template");
    template.innerHTML = html || "";

    const walk = (node) => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        if (node.nodeType !== Node.ELEMENT_NODE) return "";

        const attrs = Array.from(node.attributes)
            .map((attr) => [attr.name.toLowerCase(), normalizeAttributeValue(attr.name.toLowerCase(), attr.value)])
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, value]) => `${name}="${value}"`)
            .join(" ");

        const children = Array.from(node.childNodes).map(walk).join("");
        return `<${node.tagName.toLowerCase()}${attrs ? ` ${attrs}` : ""}>${children}</${node.tagName.toLowerCase()}>`;
    };

    return Array.from(template.content.childNodes).map(walk).join("").trim();
}

function isSameRenderableHtml(source, filtered) {
    return normalizeHtmlForCompare(source) === normalizeHtmlForCompare(filtered);
}

function cleanArticleContent(content) {
    const source = String(content || "");

    return source
        .replace(/ style="[^"]*"/g, "")
        .replace(/<i?frame.*?src="(.*?)".*?>/g, (match, src) => {
            return `<a href="${src}" target="_blank">${src}</a>`;
        })
        .replace(/<i?frame.*?src="(.*?)".*?>.*?<\/i?frame>/g, (match, src) => {
            return `<a href="${src}" target="_blank">${src}</a>`;
        });
}

export default {
    name: "AiEditor",
    components: {
        Article,
        Document,
    },
    data() {
        return {
            selectedVersion: APP_VERSIONS[0].value,
            content: "",
            darkPreview: false,
            pageable: false,
            cleanPreview: false,
            cleanPreviewTouched: false,
            previewWidth: "desktop",
            renderKey: 0,
            sampleLoading: false,
            ArrowDown,
            DocumentCopy,
            RefreshLeft,
            Delete,
        };
    },
    computed: {
        appVersions() {
            return APP_VERSIONS.map((item) => ({ ...item, name: this.$t(item.nameKey) }));
        },
        previewWidthOptions() {
            return [
                { label: this.$t("ai.editor.desktop"), value: "desktop" },
                { label: this.$t("ai.editor.tablet"), value: "tablet" },
                { label: this.$t("ai.editor.mobile"), value: "mobile" },
            ];
        },
        activeVersion() {
            return this.appVersions.find((item) => item.value === this.selectedVersion) || this.appVersions[0];
        },
        contentLength() {
            return this.content.length;
        },
        previewLabel() {
            const map = {
                desktop: this.$t("ai.editor.desktopWidth"),
                tablet: this.$t("ai.editor.tabletWidth"),
                mobile: this.$t("ai.editor.mobileWidth"),
            };
            return map[this.previewWidth] || this.$t("ai.editor.desktopWidth");
        },
        previewCanvasStyle() {
            const widthMap = {
                desktop: "100%",
                tablet: "768px",
                mobile: "390px",
            };
            return {
                maxWidth: widthMap[this.previewWidth] || "100%",
            };
        },
        previewContent() {
            return this.cleanPreview ? cleanArticleContent(this.content) : this.content;
        },
        filteredContent() {
            return execFilterXSS(this.previewContent || "");
        },
        issues() {
            const html = this.previewContent || "";
            const list = [];
            if (!html.trim()) return list;

            if (isSameRenderableHtml(html, this.filteredContent)) return list;

            list.push(this.$t("ai.editor.issues.filtered"));
            if (/<script[\s>]/i.test(html) && !/<script[\s>]/i.test(this.filteredContent)) {
                list.push(this.$t("ai.editor.issues.scriptRemoved"));
            }
            if (/\son[a-z]+\s*=/i.test(html) && !/\son[a-z]+\s*=/i.test(this.filteredContent)) {
                list.push(this.$t("ai.editor.issues.eventsRemoved"));
            }
            if (/\b(?:href|src)\s*=\s*(?:"\s*javascript\s*:|'\s*javascript\s*:|javascript\s*:)/i.test(html)) {
                list.push(this.$t("ai.editor.issues.javascriptCleaned"));
            }
            return list;
        },
    },
    watch: {
        selectedVersion() {
            localStorage.setItem(VERSION_STORAGE_KEY, this.selectedVersion);
        },
        content() {
            localStorage.setItem(STORAGE_KEY, this.content);
            this.renderKey += 1;
        },
        pageable() {
            this.renderKey += 1;
        },
        cleanPreview(value) {
            localStorage.setItem(CLEAN_PREVIEW_STORAGE_KEY, value ? "1" : "0");
            this.renderKey += 1;
        },
        previewWidth(value) {
            if (value === "mobile" && !this.cleanPreviewTouched) {
                this.cleanPreview = true;
            }
        },
    },
    mounted() {
        const savedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
        if (this.appVersions.some((item) => item.value === savedVersion)) {
            this.selectedVersion = savedVersion;
        }
        const savedCleanPreview = localStorage.getItem(CLEAN_PREVIEW_STORAGE_KEY);
        this.cleanPreviewTouched = localStorage.getItem(CLEAN_PREVIEW_TOUCHED_STORAGE_KEY) === "1";
        this.cleanPreview = this.cleanPreviewTouched ? savedCleanPreview === "1" : this.previewWidth === "mobile";
        this.content = localStorage.getItem(STORAGE_KEY) || "";
    },
    methods: {
        async copyContent() {
            if (!this.content) return;
            await navigator.clipboard.writeText(this.content);
            this.$message.success(this.$t("ai.editor.copySuccess"));
        },
        clearContent() {
            this.content = "";
            localStorage.removeItem(STORAGE_KEY);
        },
        async loadSample() {
            if (this.sampleLoading) return;

            this.sampleLoading = true;
            try {
                const content = await getArticle(SAMPLE_ARTICLE_ID);
                this.content = content || "";
                this.$message.success(this.$t("ai.editor.sampleLoaded"));
            } catch (err) {
                console.error(err);
                this.$message.error(this.$t("ai.editor.sampleLoadFailed"));
            } finally {
                this.sampleLoading = false;
            }
        },
        handleActionCommand(command) {
            if (command === "loadSample") {
                this.loadSample();
            }
        },
        handleVersionCommand(version) {
            if (version === this.selectedVersion) return;
            this.selectedVersion = version;
            this.renderKey += 1;
        },
        handleCleanPreviewChange(value) {
            this.cleanPreviewTouched = true;
            localStorage.setItem(CLEAN_PREVIEW_TOUCHED_STORAGE_KEY, "1");
            this.cleanPreview = value;
        },
    },
};
</script>

<style lang="less">
@import "~@jx3box/jx3box-editor/src/assets/css/article.less";

.p-ai-editor {
    min-height: 100vh;
    padding-top: @header-height;
    background: #f5f7fb;
    box-sizing: border-box;
}

.m-ai-editor {
    box-sizing: border-box;
    width: 100%;
    padding: 30px 20px 40px;

    &__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 22px;

        h1 {
            margin: 0;
            font-size: 30px;
            line-height: 1.25;
            font-weight: 800;
            color: #172033;
        }

        p {
            margin: 0;
            color: #687386;
            font-size: 14px;
            line-height: 1.8;
        }
    }

    &__title {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 8px;

        h1 {
            margin-bottom: 0;
        }
    }

    &__version-dropdown {
        line-height: 1;
    }

    &__version {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        height: 22px;
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid #d7dcf8;
        color: #4f46e5;
        background: linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%);
        font-size: 12px;
        line-height: 1;
        font-weight: 600;
        box-shadow: 0 1px 2px rgba(79, 70, 229, 0.08);
        cursor: pointer;

        .el-icon {
            font-size: 11px;
        }

        &:hover {
            border-color: #b8c0ff;
            color: #4338ca;
            background: #f4f6ff;
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;

        .el-button + .el-button {
            margin-left: 0;
        }
    }

    &__toolbar,
    &__issues {
        display: flex;
        align-items: center;
        gap: 0;
        padding: 10px 12px;
        margin-bottom: 14px;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    }

    &__tool-group {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        min-height: 34px;
        padding: 0 18px;
        border-left: 1px solid #eef0f4;

        &:first-child {
            padding-left: 0;
            border-left: 0;
        }

        .el-segmented {
            --el-segmented-bg-color: #f5f6fa;
            --el-segmented-item-selected-bg-color: #4f46e5;
            --el-segmented-item-selected-color: #ffffff;
            --el-segmented-item-hover-bg-color: #eef0ff;
        }

        .el-switch__label {
            font-weight: 600;
        }
    }

    &__tool-label {
        color: #8a94a6;
        font-size: 12px;
        font-weight: 600;
    }

    &__info {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border: 1px solid #cbd5e1;
        border-radius: 50%;
        color: #64748b;
        font-size: 11px;
        font-weight: 700;
        line-height: 1;
        cursor: help;
    }

    &__issues {
        display: block;
        border-color: #f3d19e;
        background: #fdf6ec;
        color: #7a4b12;

        strong {
            display: block;
            margin-bottom: 6px;
        }

        ul {
            margin: 0;
            padding-left: 18px;
            line-height: 1.8;
        }
    }

    &__workspace {
        display: grid;
        grid-template-columns: minmax(360px, 0.92fr) minmax(520px, 1.08fr);
        gap: 16px;
        min-height: calc(100vh - 220px);
    }

    &__panel {
        min-width: 0;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .u-panel-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        border-bottom: 1px solid #e5e7eb;
        background: #fafafa;
        font-size: 14px;
        font-weight: 700;
        color: #1f2937;

        em {
            font-style: normal;
            font-weight: 400;
            color: #6b7280;
            font-size: 12px;
        }
    }

    &__input textarea {
        flex: 1;
        width: 100%;
        min-height: 620px;
        resize: none;
        box-sizing: border-box;
        border: 0;
        outline: none;
        padding: 14px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 13px;
        line-height: 1.65;
        color: #111827;
        background: #ffffff;
    }

    &__preview-stage {
        flex: 1;
        overflow: auto;
        padding: 18px;
        background: #eef2f7;
        --app-page-bg: #f6f7f9;
        --app-surface: #ffffff;
        --app-surface-subtle: #f9fafb;
        --app-surface-muted: #f3f4f6;
        --app-text-primary: #111827;
        --app-text-secondary: rgba(36, 41, 46, 0.68);
        --app-text-tertiary: rgba(36, 41, 46, 0.56);
        --app-text-placeholder: rgba(36, 41, 46, 0.38);
        --app-border: rgba(36, 41, 46, 0.1);
        --app-border-subtle: rgba(36, 41, 46, 0.08);
        --app-brand-ink: #24292e;
        --app-brand-ink-hover: #2f3439;
        --app-brand-ink-active: #1f2327;
        --app-brand-gold: #fedaa3;
        --app-brand-gold-deep: #8b6f43;
        --app-radius-button: 0.625rem;

        &.is-dark {
            background: #1a1b1d;
            --app-page-bg: #1a1b1d;
            --app-surface: #222428;
            --app-surface-subtle: #25272b;
            --app-surface-muted: #2d3035;
            --app-text-primary: rgba(255, 255, 255, 0.88);
            --app-text-secondary: rgba(255, 255, 255, 0.68);
            --app-text-tertiary: rgba(255, 255, 255, 0.56);
            --app-text-placeholder: rgba(255, 255, 255, 0.36);
            --app-border: rgba(255, 255, 255, 0.08);
            --app-border-subtle: rgba(255, 255, 255, 0.08);
            --app-brand-ink: #fedaa3;
            --app-brand-ink-hover: #ffdba9;
            --app-brand-ink-active: #e6c792;
            --app-brand-gold: #1c1c1c;
            --app-brand-gold-deep: #fedaa3;

            .m-ai-editor__preview-canvas {
                background: var(--app-surface);
                border-color: var(--app-border);
                color: var(--app-text-secondary);
            }
        }
    }

    &__preview-canvas {
        box-sizing: border-box;
        min-height: 100%;
        margin: 0 auto;
        padding: 22px;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        color: #1f2937;
        overflow-x: auto;

        .c-article-box {
            color: inherit;
        }

        .c-article {
            color: inherit;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            padding: 8px 10px;
        }
    }

    &__preview-stage.is-dark &__preview-canvas {
        --article-dark-hairline: rgba(255, 255, 255, 0.06);
        --article-dark-divider: rgba(255, 255, 255, 0.08);

        .c-article-tinymce {
            color: var(--app-text-secondary);

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
                color: var(--app-text-primary);
                text-shadow: none;
            }

            h1,
            h2 {
                border-bottom-color: var(--article-dark-divider);
            }

            h4,
            blockquote {
                border-color: var(--app-border-subtle);
                border-left: 3px solid var(--app-brand-ink);
                background: rgba(255, 255, 255, 0.04);
                color: var(--app-text-secondary);
            }

            h5 {
                border-bottom-color: var(--article-dark-divider);

                &::after {
                    background-color: var(--app-brand-ink);
                }
            }

            h6 {
                border-bottom-color: rgba(255, 255, 255, 0.14);
                color: var(--app-text-secondary);
            }

            p,
            li,
            td,
            th,
            blockquote p,
            blockquote li {
                color: var(--app-text-secondary);
            }

            strong,
            b {
                color: var(--app-text-primary);
            }

            em {
                color: rgba(255, 255, 255, 0.78);
            }

            a {
                color: #9fc8ff;

                &:hover {
                    color: #c3ddff;
                }
            }

            hr {
                border-top-color: var(--article-dark-divider);
            }

            img {
                border-color: var(--article-dark-hairline);
                background: rgba(255, 255, 255, 0.02);
            }

            code {
                background: rgba(255, 255, 255, 0.06);
                border-color: var(--app-border);
                color: #ffd6a3;
                text-shadow: none;
            }

            code[class*="language-"],
            pre[class*="language-"] {
                color: #f8f8f2;
                background: transparent;
                text-shadow: none;
            }

            pre[class*="language-"] {
                background: #272822;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: none;

                code {
                    color: #f8f8f2;
                    background: transparent;
                    border-color: transparent;
                }
            }

            table {
                color: var(--app-text-secondary);
                background-color: var(--app-surface-subtle);
                border-color: var(--app-border);

                tr {
                    background: transparent;
                }

                tr:nth-child(2n + 1) {
                    background-color: rgba(255, 255, 255, 0.03);
                }

                tr:first-child,
                th {
                    background-color: var(--app-surface-muted);
                }

                td,
                th {
                    border-color: var(--app-border);
                }

                th {
                    color: var(--app-text-primary);
                }
            }

            .e-summary {
                border: 1px solid var(--app-border);
                background: var(--app-surface-subtle);
                color: var(--app-text-primary);
                box-shadow: none;

                &:before {
                    color: var(--app-brand-ink);
                }
            }

            .e-details {
                border-color: var(--app-border);
                color: var(--app-text-secondary);
                background: rgba(255, 255, 255, 0.02);
            }
        }

        .c-article-all.el-button {
            border-color: var(--app-brand-ink);
            background: var(--app-brand-ink);
            color: var(--app-brand-gold);
            box-shadow: none;
            font-weight: 600;

            &:hover,
            &:focus {
                border-color: var(--app-brand-ink-hover);
                background: var(--app-brand-ink-hover);
                color: var(--app-brand-gold);
            }
        }
    }

    &__empty {
        min-height: 420px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: #9ca3af;
        text-align: center;

        .el-icon {
            font-size: 42px;
        }
    }
}

@media (max-width: 1180px) {
    .m-ai-editor {
        &__workspace {
            grid-template-columns: 1fr;
        }

        &__input textarea {
            min-height: 360px;
        }
    }
}

@media (max-width: 720px) {
    .m-ai-editor {
        padding: 18px 12px 28px;

        &__header {
            display: block;
        }

        &__actions {
            justify-content: flex-start;
            margin-top: 14px;
        }

        &__toolbar {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
        }

        &__tool-group {
            width: 100%;
            padding: 0;
            border-left: 0;
        }

        &__preview-stage {
            padding: 10px;
        }

        &__preview-canvas {
            padding: 14px;
        }
    }
}
</style>
