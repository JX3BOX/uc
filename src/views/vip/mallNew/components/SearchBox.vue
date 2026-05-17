<template>
    <div class="m-search-bar">
        <div class="m-select-box">
            <div class="select-item">
                <el-select :model-value="query.level" placeholder="等级限制" style="width: 120px" @change="handleChange($event, 'level')">
                    <el-option v-for="item in level_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="select-item">
                <el-select :model-value="query.vip_limit" placeholder="会员限制" style="width: 120px" @change="handleChange($event, 'vip_limit')">
                    <el-option v-for="item in member_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="search-input">
            <el-input
                v-model="query.title"
                placeholder="搜索商品关键词"
                @keyup.enter="handleChange(query.title, 'title')"
            >
                <template #suffix>
                    <span
                        v-if="query.title"
                        class="u-clear"
                        role="button"
                        title="清空"
                        @mousedown.prevent
                        @click.stop="clearTitle"
                        >×</span
                    >
                </template>
                <template #append>
                    <el-button icon="Search" @click="handleChange(query.title, 'title')"></el-button>
                </template>
            </el-input>
        </div>
    </div>
</template>

<script>
export default {
    name: "SearchBox",
    inject: ["query", "changeQuery"],
    data() {
        return {
            level: "",
            vip_limit: "",
            title: "",
            level_options: [
                {
                    value: 0,
                    label: "全部",
                },
                {
                    value: 1,
                    label: "lv.1",
                },
                {
                    value: 2,
                    label: "lv.2",
                },
                {
                    value: 3,
                    label: "lv.3",
                },
                {
                    value: 4,
                    label: "lv.4",
                },
                {
                    value: 5,
                    label: "lv.5",
                },
                {
                    value: 6,
                    label: "lv.6",
                },
            ],
            member_options: [
                {
                    value: -1,
                    label: "全部",
                },
                {
                    value: 1,
                    label: "会员限制",
                },
                {
                    value: 0,
                    label: "非会员限制",
                },
            ],
        };
    },
    methods: {
        handleChange(value, key) {
            if (key == "title") value = value.trim();
            this.changeQuery(key, value);
        },
        clearTitle() {
            this.changeQuery("title", "");
        },
    },
};
</script>

<style lang="less">
.m-search-bar {
    width: 100%;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .el-select__wrapper {
        background-color: transparent;
        box-shadow: none !important;
    }
    .el-input__wrapper {
        background-color: transparent;
        box-shadow: 0 0 0 1px hsla(0,0%,100%,.5) inset;

        &.is-focus {
            box-shadow: 0 0 0 1px hsla(0,0%,100%,.5) inset;
        }
    }
    .el-input-group__append {
        width: 36px;
        padding: 0;
        background: rgba(255, 255, 255, 0.75);
        color: rgba(0, 0, 0, 1);
        text-align: center;

        .el-button {
            width: 36px;
            min-width: 36px;
            max-width: 36px;
            height: 32px;
            margin: 0;
            padding: 0;
            border: 0;
            box-sizing: border-box;
        }
    }
    .u-clear {
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        color: rgba(255, 255, 255, 0.65);

        &:hover {
            color: rgba(255, 255, 255, 0.95);
        }
    }
    .m-select-box {
        .flex;
    }
}
</style>
