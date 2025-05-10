<template>
    <div class="m-content-tab-list">
        <el-tabs ref="tabList" class="m-content-tabs" :class="{fixed:navBarFixed}" v-model="active" >
            <el-tab-pane v-for="item in list" :key="item.value" :label="item.label" :name="item.value" >
                <span slot="label">
                    {{ item.label }}
                </span>
            </el-tab-pane>
        </el-tabs>
        <div class="m-primary">
            <component v-bind:is="currentComponent" v-if="activeType === active" :list="currentChildren"/>
        </div>
    </div>
</template>

<script>
export default {
    name: "ContentTabList",
    components: {},
    data: function () {
        return {
            active: "gl",
            navBarFixed: false,
        };
    },
    props:{
        list:{
            type: Array,
            default: () => []
        }
    },
    computed: {
        current(){
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
        }
    },
    methods:{
        watchScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.navBarFixed = scrollTop >= this.tabListOffsetTop;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.tabListOffsetTop = this.$refs.tabList.$el.offsetTop;
            window.addEventListener("scroll", this.watchScroll);
        });
    },
    destroyed() {
        window.removeEventListener("scroll", this.watchScroll);
    }

}
</script>

<style lang="less">
.m-empty{
    text-align: center;
}

.m-content-tabs{
    .el-tabs__nav-wrap:after{
        background: none;
    }
}
</style>
