<template>
    <div class="m-good-list" ref="goodList">
        <GoodItem v-for="good in list" :key="good.id" :good="good"></GoodItem>
    </div>
</template>

<script>
import { throttle } from "lodash";
import GoodItem from "./GoodItem.vue";
export default {
    name: "GoodList",
    components: {
        GoodItem,
    },
    inject: ["changeQuery", "query"],
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    methods: {
        handleScroll: throttle(function () {
            const goodList = this.$refs.goodList;
            if (goodList.scrollTop + goodList.clientHeight >= goodList.scrollHeight - 200) {
                this.changeQuery("pageSize", this.query.pageSize + 10);
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
}
</style>
