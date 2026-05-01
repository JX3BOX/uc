<template>
    <div class="m-publish-subtype">
        <el-form-item label="类型">
            <el-radio-group v-model="subtype">
                <el-radio
                    v-for="(name, key) in subtypes"
                    :value="key"
                    border
                    :key="key"
                    :disabled="frozen && $route.params.id && subtype != key"
                    >{{ name }}</el-radio
                >
            </el-radio-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "publish_subtype",
    props: {
        modelValue: {
            type: [String, Number],
            default: undefined,
        },
        data: {
            type: [String, Number],
            default: "",
        },
        options: {
            type: [Array, Object],
            default: () => [],
        },
        lock: {
            type: Boolean,
            default: false,
        },
    },
    data: function () {
        return {
            subtype: this.modelValue !== undefined ? this.modelValue : this.data,
            subtypes: this.options || [],
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.subtype = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.subtype = newval;
            }
        },
        subtype: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
        options: {
            deep: true,
            handler: function (newval) {
                if (newval) {
                    this.subtypes = newval;
                }
            },
        },
    },
    computed: {
        // 是否可以变更类型
        frozen: function () {
            return this.lock;
        },
    },
    methods: {},
    mounted: function () {},
    components: {},
};
</script>
