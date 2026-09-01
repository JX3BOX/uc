<template>
    <AppLayout>
        <div
            class="m-main"
            :class="{ 'is-app-webview': isAppEnv }"
            v-loading="loading"
            element-loading-background="rgba(36, 41, 46, 0.82)"
        >
            <template v-if="treasureInfo.team_certificate && treasureImg">
                <div class="u-title m-hide">{{ treasureInfo.team_certificate.rank_name }}</div>
                <div class="u-time m-hide">{{ $t("author.certificate.awardedAt", { time: treasureInfo.team_certificate.awardtime }) }}</div>
                <el-image class="u-img" :fit="'contain'" :src="treasureImg" :preview-src-list="[treasureImg]">
                </el-image>
                <button
                    class="u-btn m-hide el-button el-button--primary"
                    :disabled="saving"
                    @click="handleCertificateAction"
                >
                    {{ certificateActionText }}
                </button>
            </template>
            <el-empty v-else-if="errorMessage" class="m-cert-empty" :description="errorMessage">
                <el-button type="primary" @click="load">{{ $t("author.certificate.retry") }}</el-button>
            </el-empty>

            <canvas class="m-cert-canvas" ref="canvas"></canvas>
        </div>
    </AppLayout>
</template>

<script>
import { __cdn, __Root } from "@/utils/config";
import AppLayout from "@/layouts/author/AppLayout.vue";
import { getCertification } from "@/service/author/cms";
import CI from "@/assets/data/author/certificate.json";
import { ElMessage } from "element-plus";
import {
    createCertificateAssetResolver,
    getCertificateOwnerId,
    prepareCertificateTemplate,
    renderCertificate,
} from "@/utils/author/certificate";
import { normalizeUrlAuthToken } from "@/utils/auth-token";

const fontMap = {
    "ALIMAMASHUHEITI-BOLD": require("@/assets/css/author/certificateFont/ALIMAMASHUHEITI-BOLD.OTF"),
};
const WEBVIEW_SAVE_IMAGE_REQUEST = "jx3box:webview-save-image";
const WEBVIEW_SAVE_IMAGE_RESULT = "jx3box:webview-save-image-result";
const SAVE_RESULT_TIMEOUT = 90000;

export default {
    name: "AuthorCertificate",
    components: { AppLayout },
    data: function () {
        return {
            treasureImg: "",
            treasureInfo: {},
            errorMessage: "",
            loading: false,
            loadRequestId: 0,
            saving: false,
            saveRequestId: "",
            saveResultTimer: 0,
        };
    },
    computed: {
        uid() {
            return this.$route.params.uid;
        },
        id() {
            return this.$route.params.id;
        },
        urlAuthToken() {
            return normalizeUrlAuthToken(this.$route.query?.__token);
        },
        certificateViewKey() {
            return `${this.uid}:${this.id}:${this.$i18n.locale}:${this.urlAuthToken}`;
        },
        isAppEnv() {
            const env = this.$route.query?.__env;
            return Array.isArray(env) ? env.includes("app") : env === "app";
        },
        certificateActionText() {
            if (!this.isAppEnv) return this.$t("author.certificate.print");
            return this.saving
                ? this.$t("author.certificate.downloading")
                : this.$t("author.certificate.download");
        },
    },
    watch: {
        certificateViewKey: {
            immediate: true,
            handler: function () {
                if (this.uid && this.id) this.load();
            },
        },
    },
    mounted() {
        window.addEventListener("message", this.onHostMessage);
    },
    beforeUnmount() {
        this.loadRequestId += 1;
        window.removeEventListener("message", this.onHostMessage);
        this.clearSaveResultTimer();
    },
    methods: {
        async load() {
            if (!this.uid || !this.id) return;
            const requestId = ++this.loadRequestId;
            this.loading = true;
            this.errorMessage = "";
            this.treasureInfo = {};
            this.treasureImg = "";
            let data;
            try {
                const response = await getCertification(this.id, this.urlAuthToken);
                data = response?.data?.data;
            } catch (error) {
                if (requestId === this.loadRequestId) this.errorMessage = this.$t("author.certificate.loadFailed");
                this.finishLoading(requestId);
                return;
            }

            if (requestId !== this.loadRequestId) return;
            const certificate = data?.team_certificate;
            if (!certificate) {
                this.errorMessage = this.$t("author.certificate.notFound");
                this.finishLoading(requestId);
                return;
            }

            const ownerId = getCertificateOwnerId(data);
            if (ownerId != null && String(ownerId) !== String(this.uid)) {
                this.errorMessage = this.$t("author.certificate.ownerMismatch");
                this.finishLoading(requestId);
                return;
            }

            const sourceTemplate = CI[certificate.rank_id];
            if (!sourceTemplate) {
                this.errorMessage = this.$t("author.certificate.templateNotFound");
                this.finishLoading(requestId);
                return;
            }

            try {
                const template = prepareCertificateTemplate({
                    template: sourceTemplate,
                    certificate,
                    translate: this.$t,
                    locale: this.$i18n.locale,
                    rootUrl: __Root,
                });
                const resolveAsset = createCertificateAssetResolver({
                    cdn: __cdn,
                    template,
                    certificate,
                });
                await this.$nextTick();
                const image = await renderCertificate({
                    canvas: this.$refs.canvas,
                    template,
                    certificate,
                    resolveAsset,
                    translate: this.$t,
                    fontUrls: fontMap,
                });
                if (requestId !== this.loadRequestId) return;
                this.treasureInfo = data;
                this.treasureImg = image;
            } catch (error) {
                console.error("[certificate] render failed", error);
                if (requestId === this.loadRequestId) this.errorMessage = this.$t("author.certificate.renderFailed");
            } finally {
                this.finishLoading(requestId);
            }
        },
        finishLoading(requestId) {
            if (requestId === this.loadRequestId) this.loading = false;
        },
        handleCertificateAction() {
            if (!this.treasureImg || this.saving) return;
            if (!this.isAppEnv) {
                window.print();
                return;
            }
            this.downloadCertificate();
        },
        downloadCertificate() {
            const filename = `jx3box-certificate-${this.id}.png`;
            if (window.parent === window) {
                this.downloadInBrowser(this.treasureImg, filename);
                ElMessage.success(this.$t("author.certificate.downloadSuccess"));
                return;
            }

            const harmonyBridge = this.getHarmonyPhotoBridge();
            if (harmonyBridge) {
                this.downloadWithHarmonyBridge(harmonyBridge, filename);
                return;
            }

            const parentOrigin = this.getParentOrigin();
            if (!parentOrigin) {
                ElMessage.error(this.$t("author.certificate.downloadFailed"));
                return;
            }
            this.saving = true;
            this.saveRequestId = `certificate-${this.id}-${Date.now()}`;
            window.parent.postMessage(
                {
                    type: WEBVIEW_SAVE_IMAGE_REQUEST,
                    requestId: this.saveRequestId,
                    dataUrl: this.treasureImg,
                    filename,
                },
                parentOrigin
            );
            this.saveResultTimer = window.setTimeout(() => {
                this.finishCertificateSave(false);
            }, SAVE_RESULT_TIMEOUT);
        },
        downloadInBrowser(dataUrl, filename) {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
        getParentOrigin() {
            const referrer = String(document.referrer || "");
            if (/^capacitor:\/\/localhost(?:[/?#]|$)/i.test(referrer)) return "capacitor://localhost";
            try {
                const origin = new URL(referrer).origin;
                if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return origin;
            } catch (error) {
            }
            return "";
        },
        getHarmonyPhotoBridge() {
            const bridge = window.JX3BOX_HARMONY_HTTP;
            return /ArkWeb|HarmonyOS|OpenHarmony/i.test(navigator.userAgent || "") &&
                typeof bridge?.saveImageToPhotos === "function"
                ? bridge
                : null;
        },
        downloadWithHarmonyBridge(bridge, filename) {
            this.saving = true;
            try {
                const raw = bridge.saveImageToPhotos(
                    JSON.stringify({
                        data: this.treasureImg.split(",")[1] || "",
                        mimeType: "image/png",
                        filename,
                    })
                );
                const response = typeof raw === "string" ? JSON.parse(raw) : raw;
                const accepted = response?.success || (response?.status === 102 && response?.data?.requestId);
                if (!accepted) throw new Error(response?.error || "Harmony image save failed");
                ElMessage.success(this.$t("author.certificate.downloadStarted"));
            } catch (error) {
                ElMessage.error(this.$t("author.certificate.downloadFailed"));
            } finally {
                this.saving = false;
            }
        },
        onHostMessage(event) {
            if (event.source !== window.parent || event.data?.type !== WEBVIEW_SAVE_IMAGE_RESULT) return;
            if (!this.saveRequestId || event.data?.requestId !== this.saveRequestId) return;

            const parentOrigin = this.getParentOrigin();
            if (!parentOrigin || event.origin !== parentOrigin) return;
            this.finishCertificateSave(Boolean(event.data?.success));
        },
        finishCertificateSave(success) {
            this.clearSaveResultTimer();
            this.saving = false;
            this.saveRequestId = "";
            if (success) {
                ElMessage.success(this.$t("author.certificate.downloadSuccess"));
                return;
            }
            ElMessage.error(this.$t("author.certificate.downloadFailed"));
        },
        clearSaveResultTimer() {
            if (!this.saveResultTimer) return;
            window.clearTimeout(this.saveResultTimer);
            this.saveResultTimer = 0;
        },
    },
};
</script>

<style lang="less" scoped>
.m-main {
    width: 848px;
    min-height: calc(100vh - @header-height);
    box-sizing: border-box;
    &::after {
        content: "";
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #24292e;
        z-index: -1;
    }
    margin: @header-height auto 0;
    padding: 36px 24px 48px;
    .x();
    .u-title {
        .fz(30px, 42px);
        .bold();
        .color(#ffffff);
        max-width: 760px;
        margin: 0 auto;
    }
    .u-time {
        .mt(6px);
        .fz(14px, 22px);
        .color(#999999);
    }
    .u-img {
        .db();
        width: 100%;
        .pointer();
        margin: 0 auto;
        .mt(18px);
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.36), 0 0 0 1px rgba(255, 255, 255, 0.08);
        .r(6px);
    }
    .m-cert-canvas {
        display: block;
        position: fixed;
        left: 0;
        right: 0;
        transform: translateX(-110%) translateY(-110%);
    }
    .u-btn {
        .db();
        .w(220px);
        height: 44px;
        margin: 0 auto;
        .mt(32px);
    }
    .m-cert-empty {
        .pt(120px);
    }
    &.is-app-webview {
        min-height: 100vh;
        min-height: 100dvh;
        margin-top: 0;
    }
}
@media screen and (max-width: @phone) {
    .m-main {
        width: 100%;
        min-height: calc(100vh - @header-height);
        min-height: calc(100dvh - @header-height);
        padding: 24px 16px 32px;
        box-sizing: border-box;
        overflow-x: hidden;

        .u-title {
            .fz(22px, 30px);
        }

        .u-time {
            .fz(13px, 20px);
            margin-top: 6px;
        }

        .u-img {
            width: 100%;
            max-width: 800px;
            margin-top: 18px;
            box-shadow: 0 6px 20px rgba(255, 255, 255, 0.12);
        }

        .u-btn {
            width: 100%;
            max-width: 240px;
            height: 44px;
            margin-top: 28px;
        }

        .m-cert-empty {
            padding-top: 72px;
        }

        &.is-app-webview {
            min-height: 100vh;
            min-height: 100dvh;
            margin-top: 0;
            padding-top: max(16px, env(safe-area-inset-top));
            padding-bottom: max(24px, env(safe-area-inset-bottom));
        }
    }
}
@media print {
    .c-header {
        .none();
    }
    .m-main {
        margin: 0;
        padding: 0;
        &::after {
            .none();
        }

        .u-img {
            .w(auto);
            margin: 0;
        }
    }
    .m-hide {
        .none() !important;
    }
}
</style>
