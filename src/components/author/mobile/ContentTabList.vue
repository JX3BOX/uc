<template>
    <div class="m-content-tab-list">
        <el-tabs ref="tabList" class="m-tabs" :class="{ fixed: navBarFixed }" v-model="active" stretch>
            <el-tab-pane v-for="item in list" :key="item.value" :label="item.label" :name="item.value">
                <template #label>
                    {{ item.label }}
                </template>
            </el-tab-pane>
        </el-tabs>
        <div class="m-primary">
            <component v-bind:is="currentComponent" v-if="activeType === active" :list="currentChildren" />
        </div>
    </div>
</template>

<script>
export default {
    name: "ContentTabList",
    components: {},
    data: function () {
        return {
            active: "BoxMoment",
            navBarFixed: false,
        };
    },
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        current() {
            return this.list.find((item) => item.value === this.active);
        },
        currentComponent: function () {
            return this.current?.component;
        },
        activeType: function () {
            return this.current?.value;
        },
        currentChildren: function () {
            return this.current?.children || [];
        },
    },
    methods: {
        ensureActiveTab() {
            if (!Array.isArray(this.list) || !this.list.length) {
                this.active = "";
                return;
            }
            const hasActive = this.list.some((item) => item.value === this.active);
            if (hasActive) return;

            const defaultTab = this.list.find((item) => item.value === "BoxMoment");
            this.active = defaultTab?.value || this.list[0].value;
        },
        watchScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.navBarFixed = scrollTop >= this.tabListOffsetTop;
        },
    },
    watch: {
        list: {
            immediate: true,
            deep: true,
            handler() {
                this.ensureActiveTab();
            },
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.tabListOffsetTop = this.$refs.tabList.$el.offsetTop;
            window.addEventListener("scroll", this.watchScroll);
        });
    },
    unmounted() {
        window.removeEventListener("scroll", this.watchScroll);
    },
};
</script>

<style lang="less">
.m-empty {
    text-align: center;
}
</style>
