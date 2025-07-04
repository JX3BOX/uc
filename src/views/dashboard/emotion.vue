<template>
    <uc class="m-dashboard-emotion m-dashboard-skin" icon="el-icon-brush" title="主题装扮" :tabList="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--mini is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> 前往获取装扮</a
            >
        </template>
        <div class="m-emotion-content-preview">
            <div class="m-title">
                <span>表情包内容展示</span>
                <span class="u-tip">点击表情包可以预览其中的表情</span>
            </div>
            <div class="m-emotion-content-list" v-if="previewEmotion">
                <div class="m-emotion-content-item" v-for="(item, index) in previewEmotion.items" :key="index">
                    <img class="u-img" :src="itemImgSrc(item)" alt="" />
                    <span class="u-name">{{ getNameByKey(item.key) }}</span>
                </div>
            </div>
        </div>
        <el-divider content-position="left">已获得</el-divider>
        <div class="m-emotion-list">
            <div
                class="m-emotion-item"
                :class="{ 'is-select': selectedKeys.includes(emotion.group_name) }"
                v-for="(emotion, index) in ownedEmotions"
                :key="index"
                @click="toggleEmotionSelected(emotion)"
            >
                <img
                    class="u-check"
                    v-if="selectedKeys.includes(emotion.group_name)"
                    src="@/assets/img/dashboard/check.svg"
                    alt=""
                />
                <img class="u-img" :src="emotion.cover" alt="" />
                <span class="u-name">{{ emotion.group_name }}</span>
            </div>
        </div>
        <div class="m-actions">
            <el-button icon="el-icon-circle-check" type="primary" @click="onSave" :loading="loading"
                >确定激活({{ selectedKeys.length }}/5)</el-button
            >
            <div class="u-tip">自定义表情包最多只能同时激活五个。挑选完毕后，需点击按钮方可实装。</div>
        </div>
        <el-divider content-position="left">未获得</el-divider>
        <div class="m-emotion-list">
            <div
                class="m-emotion-item is-not-owned"
                v-for="(emotion, index) in unownedEmotions"
                :key="index"
                @click="toggleEmotionSelected(emotion)"
            >
                <img class="u-img" :src="emotion.cover" alt="" />
                <span class="u-name">{{ emotion.group_name }}</span>
                <span class="u-go-buy" @click.stop="goBuy(emotion.group_name)">前往兑换</span>
            </div>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { getDecoration, getEmotion, setDecoration } from "@/service/dashboard/decoration";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { themeTab } from "@/assets/data/dashboard/tabs.json";
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
            this.previewKey = key; // 设置预览的表情包键
            if (!this.ownedEmotionKeys.includes(key)) {
                return;
            }
            if (this.selectedKeys.includes(key)) {
                this.selectedKeys = this.selectedKeys.filter((k) => k !== key);
            } else {
                if (this.selectedKeys.length >= 5) {
                    this.$message.error("最多只能选择五个表情包");
                    return;
                }
                this.selectedKeys.push(key);
            }
        },
        itemImgSrc(item) {
            const filename = item.filename;
            if (filename?.startsWith("http")) return filename;
            return __imgPath + "emotion/output/" + filename;
        },

        onSave() {
            this.loading = true;
            const data = this.ownedEmotionKeys.map((item) => {
                return {
                    type: "emotion",
                    val: item,
                    using: this.selectedKeys.includes(item),
                };
            });
            setDecoration(data).then((res) => {
                this.$message.success("保存成功");
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
        height: 82px;
        .pointer;
        .pr;

        &.is-select {
            background-color: rgba(64, 128, 255, 1);

            .u-name {
                color: white;
            }
        }
        &:hover {
            border-color: rgba(64, 128, 255, 1);

            &.is-not-owned .u-go-buy {
                background-color: rgba(64, 128, 255, 1);
            }
        }
        .u-check {
            .pa;
            .rt(13px);
        }
        .u-img {
            .size(30px);
        }
        .u-name {
            .fz(14px);
        }
        &.is-not-owned {
            height: 85px;

            .pb(24px);
            .u-name {
                color: rgba(128, 128, 128, 1);
            }
            .u-go-buy {
                display: flex;
                align-items: center;
                justify-content: center;
                border-bottom-left-radius: 3px;
                border-bottom-right-radius: 3px;
                .pa;
                bottom: 0;
                .size(100%, 24px);
                color: white;
                background-color: rgba(36, 41, 46, 1);
                .fz(12px, 18px);
                &:hover {
                    filter: brightness(1.05);
                }
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
