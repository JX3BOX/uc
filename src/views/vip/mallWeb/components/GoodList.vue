<template>
    <div class="m-good-list" ref="goodList">
        <GoodItem v-for="good in list" :key="good.id" :good="good"></GoodItem>
        <div v-if="noData && !list.length" class="u-empty">
            <div class="u-empty-visual" aria-hidden="true">
                <div class="u-empty-box">
                    <span class="u-empty-box__lid"></span>
                    <span class="u-empty-box__body"></span>
                    <span class="u-empty-box__spark is-left"></span>
                    <span class="u-empty-box__spark is-right"></span>
                </div>
            </div>
            <div class="u-empty-title">当前条件下没有找到符合的商品</div>
            <div class="u-empty-desc">可以调整分类、等级或搜索关键词后再看看</div>
        </div>
        <div class="u-no-data" v-else-if="noData">~ ✿ 已经到底了哦 ✿ ~</div>
    </div>
</template>

<script>
import { debounce } from "lodash";
import GoodItem from "./GoodItem.vue";
export default {
    name: "GoodList",
    components: {
        GoodItem,
    },
    inject: ["changeQuery", "query", "hasMore"],
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        noData: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        "query.pageIndex"(val) {
            if (val === 1) this.$refs.goodList.scrollTop = 0;
        },
    },
    methods: {
        handleScroll: debounce(function () {
            const goodList = this.$refs.goodList;
            if (this.hasMore && goodList.scrollTop + goodList.clientHeight >= goodList.scrollHeight - 200) {
                this.changeQuery("pageIndex", this.query.pageIndex + 1, true);
            }
        }, 500),
    },
    mounted() {
        this.$refs.goodList.addEventListener("scroll", this.handleScroll);
    },
    beforeUnmount() {
        this.$refs.goodList.removeEventListener("scroll", this.handleScroll);
    },
};
</script>

<style lang="less" scoped>
.m-good-list {
    flex: 1;
    align-self: stretch;
    overflow: scroll;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    gap: 4.2667vw;
    .u-no-data {
        .x;
        .fz(14px);
        .color(#fff);
        .pb(6vw);
        letter-spacing: 2px;
    }
    .u-empty {
        flex: 1;
        min-height: 70vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2.1333vw;
        text-align: center;
        padding: 8vw 4vw 12vw;
        box-sizing: border-box;
        color: rgba(255, 255, 255, 0.86);
    }
    .u-empty-visual {
        width: 28.8vw;
        height: 22.4vw;
        position: relative;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        margin-bottom: 1.0667vw;

        &::before {
            content: "";
            position: absolute;
            left: 50%;
            bottom: 0;
            width: 24vw;
            height: 3.7333vw;
            transform: translateX(-50%);
            border-radius: 999px;
            background: radial-gradient(ellipse at center, rgba(255, 171, 45, 0.22), rgba(255, 171, 45, 0));
            filter: blur(1px);
        }
    }
    .u-empty-box {
        position: relative;
        width: 18.6667vw;
        height: 15.4667vw;
        color: #ffad33;
    }
    .u-empty-box__body {
        position: absolute;
        left: 50%;
        bottom: 1.3333vw;
        width: 14.9333vw;
        height: 10.9333vw;
        transform: translateX(-50%);
        border: 1px solid rgba(255, 186, 76, 0.34);
        border-radius: 2.1333vw 2.1333vw 2.6667vw 2.6667vw;
        background: linear-gradient(180deg, rgba(255, 171, 45, 0.18), rgba(255, 171, 45, 0.07));
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 2.6667vw 9.0667vw rgba(0, 0, 0, 0.28);

        &::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 0;
            width: 1px;
            height: 100%;
            background: rgba(255, 186, 76, 0.2);
        }
        &::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 2.4vw;
            width: 4.8vw;
            height: 1.0667vw;
            transform: translateX(-50%);
            border-radius: 999px;
            background: rgba(255, 201, 112, 0.3);
        }
    }
    .u-empty-box__lid {
        position: absolute;
        left: 50%;
        top: 0;
        z-index: 1;
        width: 17.0667vw;
        height: 7.4667vw;
        transform: translateX(-50%) rotate(-5deg);
        border: 1px solid rgba(255, 196, 92, 0.38);
        border-radius: 1.8667vw;
        background: linear-gradient(135deg, rgba(255, 186, 76, 0.28), rgba(255, 171, 45, 0.07));
        box-shadow: 0 1.0667vw 5.3333vw rgba(255, 171, 45, 0.1);

        &::before,
        &::after {
            content: "";
            position: absolute;
            top: 5.8667vw;
            width: 7.2vw;
            height: 4vw;
            border: 1px solid rgba(255, 196, 92, 0.32);
            background: rgba(255, 171, 45, 0.11);
        }
        &::before {
            left: -1.8667vw;
            transform: skewX(-24deg);
            border-radius: 1.0667vw 0.5333vw 1.3333vw 1.0667vw;
        }
        &::after {
            right: -1.8667vw;
            transform: skewX(24deg);
            border-radius: 0.5333vw 1.0667vw 1.0667vw 1.3333vw;
        }
    }
    .u-empty-box__spark {
        position: absolute;
        width: 1.0667vw;
        height: 1.0667vw;
        border-radius: 50%;
        background: #ffd768;
        box-shadow: 0 0 3.2vw rgba(255, 215, 104, 0.78);

        &.is-left {
            left: -0.8vw;
            top: 5.0667vw;
        }
        &.is-right {
            right: -1.0667vw;
            top: 2.6667vw;
            width: 0.8vw;
            height: 0.8vw;
        }
    }
    .u-empty-title {
        .fz(15px);
        .bold;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.88);
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.16);
    }
    .u-empty-desc {
        .fz(12px);
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.42);
    }

    @media screen and (min-width: 768px) {
        .u-empty {
            gap: 16px;
            padding: 60px 32px 88px;
        }
        .u-empty-visual {
            width: 216px;
            height: 168px;
            margin-bottom: 8px;

            &::before {
                width: 180px;
                height: 28px;
            }
        }
        .u-empty-box {
            width: 140px;
            height: 116px;
        }
        .u-empty-box__body {
            bottom: 10px;
            width: 112px;
            height: 82px;
            border-radius: 16px 16px 20px 20px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 20px 68px rgba(0, 0, 0, 0.28);

            &::after {
                top: 18px;
                width: 36px;
                height: 8px;
            }
        }
        .u-empty-box__lid {
            width: 128px;
            height: 56px;
            border-radius: 14px;
            box-shadow: 0 8px 40px rgba(255, 171, 45, 0.1);

            &::before,
            &::after {
                top: 44px;
                width: 54px;
                height: 30px;
            }
            &::before {
                left: -14px;
                border-radius: 8px 4px 10px 8px;
            }
            &::after {
                right: -14px;
                border-radius: 4px 8px 8px 10px;
            }
        }
        .u-empty-box__spark {
            width: 8px;
            height: 8px;
            box-shadow: 0 0 24px rgba(255, 215, 104, 0.78);

            &.is-left {
                left: -6px;
                top: 38px;
            }
            &.is-right {
                right: -8px;
                top: 20px;
                width: 6px;
                height: 6px;
            }
        }
        .u-empty-title {
            .fz(16px);
        }
        .u-empty-desc {
            .fz(13px);
        }
    }
}
</style>
