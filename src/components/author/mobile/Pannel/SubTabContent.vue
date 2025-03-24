<template>
    <div class="m-sub-tab-content">
        <el-tabs ref="tabList" class="m-sub-tabs"
                 :class="{fixed: navBarFixed}"
                 v-model="active"
                 @change="onChangeTab"
                 stretch>
            <el-tab-pane v-for="item in list" :key="item.value" :label="item.label" :name="item.value">
            </el-tab-pane>
        </el-tabs>
        <div class="m-content">
            <slot>
                <component v-bind:is="currentComponent" :default-params="current?.params" />
            </slot>
        </div>
    </div>
</template>

<script>

export default {
    name: "SubTabContent",
    emits:["change-tab"],
    props:{
        list: {
            type: Array,
            default: () => []
        },
        defaultActive:{
            type: String,
            default: null
        }
    },
    data: function() {
        return {
            active: "",
            navBarFixed: false,
            tabListOffsetTop: 0,
        };
    },
    computed: {
        currentComponent() {
            return this.current?.component || null;
        },
        current(){
            const tab = this.active;
            return this.list.find((item) => item.value === tab);
        }
    },
    methods:{
        watchScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.navBarFixed = scrollTop >= this.tabListOffsetTop;
        },
        onChangeTab(v){
            console.log(v);
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
    },
    watch:{
        list:{
            handler(){
                if (!this.active || this.list.find(i=>i.value===this.active) == null){
                    this.active = this.defaultActive || this.list[0]?.value || '';
                }
            },
            deep:true,
            immediate: true
        },
        active:{
            immediate: true,
            handler(){
                this.$emit("change-tab",this.active);
            }
        }
    },
    components: {

    },
};
</script>

<style lang="less" scoped>
.m-sub-tab-content{
    display: flex;
    padding: 16px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--20, 20px);
    align-self: stretch;
    .m-content{
        width: 100%;
    }
}


</style>
