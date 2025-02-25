<template>
    <div class="m-publish-comment">
        <el-form-item label="礼物开关">
            <el-switch
                v-model="allow_gift"
                active-color="#13ce66"
                :active-value="1"
                :inactive-value="0"
            ></el-switch>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_gift",
    props: ["data"],
    data: function () {
        return {
            allow_gift: this.data,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.allow_gift = newval;
        },
        allow_gift: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
};
</script>
