<template>
    <div class="m-publish-zlp">
        <el-form-item label="资料片">
            <el-select v-model="zlp" filterable size="large" :allow-create="true" placeholder="请选择适应资料片">
                <el-option v-for="item in zlps" :key="item" :label="item" :value="item"></el-option>
            </el-select>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
import zlps from "@jx3box/jx3box-common/data/jx3_zlp.json";
export default {
    name: "publish_zlp",
    props: {
        modelValue: {
            type: String,
            default: undefined,
        },
        data: {
            type: String,
            default: "",
        },
        client: {
            type: String,
            default: "std",
        },
    },
    data: function () {
        return {
            zlp: this.modelValue !== undefined ? this.modelValue : this.data,
            zlps: zlps["std"],
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.zlp = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.zlp = newval;
            }
        },
        zlp: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
        client: {
            handler(val) {
                val = val || "std";
                this.zlps = zlps[val];
            },
            immediate: true,
        },
    },
    computed: {},
    methods: {},
    mounted: function () {},
    components: {},
};
</script>
