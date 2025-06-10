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
        <div class="u-tips">
            <i class="el-icon-warning-outline"></i>自定义表情包最多只能同时激活五个。
        </div>
        <div class="u-list">
            <div
                class="u-item"
                v-for="item in emotions"
                :key="item.group_id"
                :class="{
                    'is-using': isUsing(item.group_name),
                    disabled: isDisabled(item.group_name),
                    hidden: isHidden(item.group_name),
                }"
                @click.stop="handleEmotionClick(item)"
            >
                <img class="u-img" :src="imgSrc(item.group_name)" :alt="item.group_name" />
                <div class="u-title">{{ item.group_name }}</div>
            </div>
        </div>
        <div class="u-tips">
            <i class="el-icon-warning-outline"></i>点击上面的表情包可以预览其中的表情。
        </div>
        <div class="m-preview" v-if="currentEmotion.group_name">
            <div class="m-preview-item" v-for="(item, index) in currentEmotion.items" :key="index">
                <img class="u-img" :src="itemImgSrc(item)" :alt="item.key" />
                <span class="u-key">{{ getNameByKey(item.key) }}</span>
            </div>
        </div>

        <div class="u-actions">
            <el-button @click="goBuy" icon="el-icon-shopping-bag-2" v-if="showBuy">前往购买</el-button>
            <el-button type="primary" @click="handleSave" icon="el-icon-circle-check" :loading="loading"
                >保存</el-button
            >
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

            emotionList: [],
            emotions: [],
            active: [],
            current: "emotion",
            loading: false,
        };
    },
    computed: {
        currentEmotion() {
            return this.emotions.find((item) => item.group_name === this.current) || {};
        },
        showBuy() {
            return !this.emotionList.some(item => item.val === this.current);;
        },
    },
    methods: {
        goBuy() {
            window.open(`/vip/mall?category=virtual&search=${this.current}`, "_blank");
        },
        getNameByKey(key) {
            if(!key) return "";
            return key.replace(/^\#\w+/, "");
        },
        loadDecoration() {
            getDecoration({ type: "emotion" }).then((res) => {
                this.emotionList = res.data.data;
                this.active = this.emotionList.filter((item) => item.using).map((item) => item.val);
                const _emotionList = this.emotionList.map((item) => item.val);
                // 已购买的表情包排在前列
                this.emotions.sort((a, b) => {
                    const aUsing = _emotionList.includes(a.group_name);
                    const bUsing = _emotionList.includes(b.group_name);
                    if (aUsing && !bUsing) {
                        return -1;
                    } else if (!aUsing && bUsing) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
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
                this.emotions = [];
            } finally {
                this.loadDecoration();
            }
        },
        imgSrc(val) {
            const group = this.emotions.find((item) => item.group_name === val);
            const defaultEmo = group.items?.[0];
            return this.itemImgSrc(defaultEmo);
        },
        itemImgSrc(item) {
            const filename = item.filename;
            if (filename?.startsWith("http")) return filename;
            return __imgPath + "emotion/output/" + filename;
        },
        isUsing(val) {
            return this.active.includes(val) || val === "默认";
        },
        isDisabled(val) {
            return !this.emotionList.map((item) => item.val).includes(val) && val !== "默认";
        },
        isHidden(val) {
            return val === "默认";
        },
        handleEmotionClick(item) {
            this.current = item.group_name;
            if (this.isDisabled(item.group_name)) {
                return;
            }
            // 最多只能选择五个
            if (this.active.length >= 5 && !this.isUsing(item.group_name)) {
                this.$message.error("最多只能选择五个表情包");
                return;
            } else {
                if (this.isUsing(item.group_name)) {
                    this.active = this.active.filter((val) => val !== item.group_name);
                } else {
                    this.active.push(item.group_name);
                }
            }
        },
        handleSave() {
            this.loading = true;
            const data = this.emotionList.map((item) => {
                return {
                    type: "emotion",
                    val: item.val,
                    using: this.active.includes(item.val),
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
    },
    components: {
        uc,
    },
};
</script>

<style lang="less">
.m-dashboard-emotion {
    .m-preview {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .m-preview-item {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 4px;
        margin: 8px 0;

        .u-img {
            max-width: 60px;
            max-height: 60px;
        }
        .u-key {
            .fz(12px);
            color: #aba;
            
        }
    }
    .u-tips {
        margin-bottom: 16px;
        .fz(13px);
        i {
            .mr(2px);
        }
        a:hover {
            text-decoration: underline;
        }
    }
    .u-list {
        .flex;
        flex-wrap: wrap;
        .mb(16px);
    }
    .u-item {
        .flex;
        .pointer;
        align-items: center;
        border: 1px solid #e6e6e6;
        border-radius: 3px;
        padding: 4px 8px;
        margin: 4px;
        .u-img {
            .size(20px, 20px);
        }
        .u-title {
            margin-left: 4px;
            .fz(13px);
        }

        &.hidden {
            .none;
        }

        &.is-using {
            border-color: #409eff;
            position: relative;

            // 倒三角标
            &::before {
                content: "";
                .pa;
                right: 0;
                bottom: 0;
                border: 12px solid #4abe84;
                border-top-color: transparent;
                border-left-color: transparent;
                border-bottom-right-radius: 3px;
            }
            &::after {
                content: "";
                width: 2px;
                height: 8px;
                .pa;
                right: 4px;
                bottom: 4px;
                border: 2px solid #fff;
                border-top-color: transparent;
                border-left-color: transparent;
                transform: rotate(45deg);
            }
        }
        &.disabled {
            opacity: 0.7;
            border-style: dashed;
        }
    }
    .u-actions {
        margin-top: 16px;
        text-align: center;
    }
}
</style>
