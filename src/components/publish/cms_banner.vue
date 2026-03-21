<template>
    <div class="m-cms-banner">
        <publishBanner v-model="banner" :size="size" :info="info" is-cms></publishBanner>
    </div>
</template>

<script>
import publishBanner from "./publish_banner.vue";
export default {
    name: "CmsBanner",
    components: {
        publishBanner,
    },
    props: {
        modelValue: {
            type: String,
            default: undefined,
        },
        data: {
            type: String,
            default: "",
        },
        size: {
            type: [Array, Number],
            default: () => [300, 100],
        },
        info: {
            type: String,
            default: "非必选，首页海报尺寸1600*280（推荐3200*560支持高分屏），最大30M。",
        },
    },
    data() {
        return {
            banner: this.modelValue !== undefined ? this.modelValue : this.data,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.banner = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.banner = newval;
            }
        },
        banner: function (newval) {
            this.$emit("update:modelValue", newval);
            this.$emit("update", newval);
        },
    },
};
</script>

<style lang="less">
.m-cms-banner {
    .u-upload {
        width: 300px !important;
        height: 100px !important;
        .pr;
    }
    .el-icon-plus {
        .pa;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
