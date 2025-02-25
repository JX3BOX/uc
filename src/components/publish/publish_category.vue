<template>
    <div class="m-category-list">
        <span class="u-category">类别</span>
        <el-radio-group v-model="category" @input="updateCategory">
            <el-tooltip v-for="item in options" :key="item.name" effect="dark" :content="item.remark" placement="top-start">
                <el-radio border :label="item.name">{{ item.name }}</el-radio>
            </el-tooltip>
        </el-radio-group>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        value: {
            type: [String, Number],
            default: "",
        },
    },
    data() {
        return {
            category: this.value,
        };
    },
    watch: {
        // 监听外部传递的 value 属性的变化
        value(newVal) {
            this.category = newVal;
        },
        options: {
            deep: true,
            immediate: true,
            handler() {
                if (!this.value) {
                    this.category = this.options?.[0]?.name;
                    this.$emit("update", this.category);
                }
            }
        }
    },
    model: {
        prop: "value",
        event: "update",
    },
    methods: {
        // 当 radio-group 内部的 category 变化时，更新到外部的 value 上
        updateCategory(newVal) {
            this.$emit("update", newVal);
        },
    },
};
</script>

<style lang="less">
.m-category-list {
    .flex;
    .u-category {
        min-width: 80px;
        .fz(14px);
        align-items: center;
    }
    .el-radio-group {
        flex: 1;
        // gap: 12px; /* 设置网格项之间的间隔 */
        // display: grid;
        // grid-auto-flow: row; /* 默认值，项目会按行填充 */
        // grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        // width: 100%; /* 或者设置为特定的宽度 */
        .el-radio {
            .w(120px);
            .mb(10px);
        }
    }
}

@media screen and (max-width: @phone) {
    .m-category-list {
        flex-wrap: wrap;

        .el-radio-group {
            flex: unset;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            margin-top: 10px;
        }
    }
}
</style>
