<template>
    <uc class="m-dashboard-emotion m-dashboard-skin" icon="el-icon-brush" :title="$t('dashboard.theme.title')" :tabList="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--small is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> {{ $t("dashboard.theme.getDecorations") }}</a
            >
        </template>
        <div class="m-emotion-content-preview">
            <div class="m-title">
                <span>{{ $t("dashboard.emotion.previewTitle") }}</span>
                <span class="u-tip">{{ $t("dashboard.emotion.previewTip") }}</span>
            </div>
            <div class="m-emotion-content-list" v-if="previewEmotion">
                <div class="m-emotion-content-item" v-for="(item, index) in previewEmotion.items" :key="index">
                    <img class="u-img" :src="itemImgSrc(item)" alt="" />
                    <span class="u-name">{{ getNameByKey(item.key) }}</span>
                </div>
            </div>
        </div>
        <el-divider content-position="left">{{ $t("dashboard.common.obtained") }}</el-divider>
        <div class="m-emotion-list">
            <div
                class="m-emotion-item"
                :class="{ 'is-select': selectedKeys.includes(emotion.group_name) }"
                v-for="(emotion, index) in ownedEmotions"
                :key="index"
                @click="previewEmotionPack(emotion)"
            >
                <img class="u-img" :src="emotion.cover" alt="" />
                <span class="u-name">{{ emotion.group_name }}</span>
                <button
                    type="button"
                    class="u-emotion-action"
                    :class="selectedKeys.includes(emotion.group_name) ? 'is-cancel' : 'is-activate'"
                    :aria-pressed="selectedKeys.includes(emotion.group_name)"
                    @click.stop="toggleEmotionSelected(emotion)"
                >
                    {{
                        selectedKeys.includes(emotion.group_name)
                            ? $t("dashboard.emotion.cancelActivation")
                            : $t("dashboard.emotion.selectActivation")
                    }}
                </button>
            </div>
        </div>
        <div class="m-actions">
            <el-button icon="CircleCheck" type="primary" @click="onSave" :loading="loading" size="large"
                >{{ $t("dashboard.emotion.confirmActivation", { count: selectedKeys.length }) }}</el-button
            >
            <div class="u-tip">{{ $t("dashboard.emotion.limitTip") }}</div>
        </div>
        <el-divider content-position="left">{{ $t("dashboard.common.notObtained") }}</el-divider>
        <div class="m-emotion-list">
            <div
                class="m-emotion-item is-not-owned"
                v-for="(emotion, index) in unownedEmotions"
                :key="index"
                @click="previewEmotionPack(emotion)"
            >
                <img class="u-img" :src="emotion.cover" alt="" />
                <span class="u-name">{{ emotion.group_name }}</span>
                <button type="button" class="u-emotion-action is-purchase" @click.stop="goBuy(emotion.group_name)">
                    {{ $t("dashboard.emotion.goExchange") }}
                </button>
            </div>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { getDecoration, getEmotion, setEmotion } from "@/service/dashboard/decoration";
import { __imgPath } from "@/utils/config";
import tabsData from "@/assets/data/dashboard/tabs.json";
const { themeTab } = tabsData;
export default {
    name: "emotion",
    props: [],
    data: function () {
        return {
            tabList: themeTab,

            emotions: [],
            active: [],
            loading: false,

            allEmotions: [], // 所有表情包
            ownedEmotionKeys: [], // 已拥有的表情包键
            selectedKeys: [], // 当前选中的表情包键
            previewKey: "", // 预览的表情包键
        };
    },
    computed: {
        ownedEmotions() {
            return this.emotions
                .filter((item) => this.ownedEmotionKeys.includes(item.group_name))
                .map((item) => ({
                    ...item,
                    cover: this.itemImgSrc(item.items?.[0] || {}),
                }));
        },
        unownedEmotions() {
            return this.emotions
                .filter((item) => !this.ownedEmotionKeys.includes(item.group_name) && item.group_name !== "默认")
                .map((item) => ({
                    ...item,
                    cover: this.itemImgSrc(item.items?.[0] || {}),
                }));
        },
        previewEmotion() {
            return this.emotions.find((item) => item.group_name === this.previewKey) || null;
        },
    },
    methods: {
        goBuy(key) {
            window.open(`/vip/mall?category=virtual&search=${key}`, "_blank");
        },
        getNameByKey(key) {
            if (!key) return "";
            return key.replace(/^\#\w+/, "");
        },
        loadDecoration() {
            getDecoration({ type: "emotion" }).then((res) => {
                this.ownedEmotionKeys = res.data.data.map((item) => item.val);
                this.selectedKeys = res.data.data.filter((item) => item.using).map((item) => item.val);
            });
        },
        getEmotion() {
            try {
                const _emotions = JSON.parse(sessionStorage.getItem("jx3_emotion"));

                if (_emotions) {
                    this.emotions = _emotions;
                    return;
                } else {
                    getEmotion().then((res) => {
                        this.emotions = res.data;
                        sessionStorage.setItem("jx3_emotion", JSON.stringify(res.data));
                    });
                }
            } catch (e) {
                this.allEmotions = [];
            }
        },
        toggleEmotionSelected(emotion) {
            const key = emotion.group_name;
            if (this.selectedKeys.includes(key)) {
                this.selectedKeys = this.selectedKeys.filter((k) => k !== key);
            } else {
                if (this.selectedKeys.length >= 5) {
                    this.$message.error(this.$t("dashboard.emotion.maxFive"));
                    return;
                }
                this.selectedKeys.push(key);
            }
        },
        previewEmotionPack(emotion) {
            this.previewKey = emotion.group_name;
        },
        itemImgSrc(item) {
            const filename = item.filename;
            if (filename?.startsWith("http")) return filename;
            return __imgPath + "emotion/output/" + filename;
        },

        onSave() {
            this.loading = true;
            setEmotion(this.selectedKeys)
                .then(() => {
                    this.$message.success(this.$t("dashboard.common.saveSuccess"));
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    mounted: function () {
        this.getEmotion();
        this.loadDecoration();
    },
    components: {
        uc,
    },
};
</script>

<style lang="less">
.m-dashboard-emotion {
    display: flex;
    flex-direction: column;

    .m-emotion-list {
        .mb(12px);
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
    }

    .m-emotion-item {
        display: flex;
        gap: 7px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(229, 229, 229, 1);
        border-radius: 4px;
        width: 100px;
        min-height: 112px;
        padding: 12px 8px 8px;
        box-sizing: border-box;
        .pointer;
        .pr;

        &.is-select {
            background-color: lighten(@v4primary, 40%);
            border-color: @v4primary;
        }
        &:hover {
            border-color: #c0c4cc;

            &.is-select {
                border-color: @v4primary;
            }

            &.is-not-owned .u-emotion-action.is-purchase {
                background-color: lighten(@v4primary, 38%);
            }
        }
        .u-img {
            .size(30px);
        }
        .u-name {
            .fz(14px);
        }
        &.is-not-owned {
            .u-name {
                color: rgba(128, 128, 128, 1);
            }
        }
        .u-emotion-action {
            width: 100%;
            min-height: 26px;
            margin-top: auto;
            border: 1px solid transparent;
            border-radius: 4px;
            font-size: 12px;
            line-height: 18px;
            cursor: pointer;

            &.is-activate {
                background: @v4primary;
                color: #fff;
            }
            &.is-cancel {
                border-color: #dcdfe6;
                background: #fff;
                color: #909399;
            }
            &.is-purchase {
                background: #f1f3f5;
                color: #606266;
            }
            &:hover {
                filter: brightness(1.04);
            }
        }
    }

    .m-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        .mb(48px);

        .el-button {
            padding: 10px 55px;
        }
        .u-tip {
            font-size: 14px;
            line-height: 20.27px;
            color: rgba(153, 153, 153, 1);
        }
    }

    .m-emotion-content-preview {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px;
        background: rgba(250, 251, 252, 1);
        border: 1px solid rgba(229, 229, 229, 1);
        .mb(48px);

        .m-title {
            display: flex;
            align-items: center;
            gap: 8px;
            .fz(14px, 20px);

            .u-tip {
                color: rgba(153, 153, 153, 1);
            }
        }
    }

    .m-emotion-content-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
    }

    .m-emotion-content-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: center;

        .u-img {
            .size(30px);
        }

        .u-name {
            .fz(12px, 18px);
        }
    }
}
</style>
