<template>
    <div class="m-good-list" ref="goodList">
        <GoodItem v-for="good in list" :key="good.id" :good="good"></GoodItem>
        <div class="u-no-data" v-if="noData">~ ✿ 已经到底了哦 ✿ ~</div>
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
    beforeDestroy() {
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
}
</style>
