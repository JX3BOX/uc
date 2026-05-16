<template>
    <div class="m-good-list" ref="goodList">
        <GoodItem v-for="good in list" :key="good.id" :good="good"></GoodItem>
        <el-empty
            v-if="noData && !list.length"
            class="u-empty"
            description="当前条件下没有找到符合的商品"
        ></el-empty>
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
        align-items: center;
        justify-content: center;
        :deep(.el-empty__description p) {
            color: rgba(255, 255, 255, 0.72);
        }
        :deep(.el-empty__image) {
            opacity: 0.82;
        }
    }
}
</style>
