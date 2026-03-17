<template>
    <div class="m-publish-client">
        <el-form-item label="版本">
            <el-radio-group v-model="client" @change="handleChange">
                <el-radio value="std">剑三</el-radio>
                <el-radio value="origin">缘起</el-radio>
                <!-- <el-radio value="wujie" v-if="showMobile">无界</el-radio> -->
                <el-radio value="all" v-if="!forbidAll">全端</el-radio>
            </el-radio-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
import Bus from "@jx3box/jx3box-ui/utils/bus";
export default {
    name: "publish_client",
    props: {
        modelValue: {
            type: String,
            default: undefined,
        },
        data: {
            type: String,
            default: undefined,
        },
        forbidAll: {
            type: Boolean,
            default: false,
        },
        showMobile: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update", "update:modelValue"],
    computed: {
        client: {
            get: function () {
                return this.modelValue !== undefined ? this.modelValue : this.data;
            },
            set: function (value) {
                this.$emit("update:modelValue", value);
                this.$emit("update", value);
            },
        },
    },
    methods: {
        handleChange: function (value) {
            Bus.emit("changeClient", value);
        },
    },
    mounted: function () {},
    components: {},
};
</script>
