<template>
    <div class="search-bar">
        <div class="select-box">
            <div class="select-item">
                <el-select :value="c_level" @change="handleChange($event, 'level')" placeholder="等级限制">
                    <el-option v-for="item in level_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="select-item">
                <el-select :value="query.vip_limit" @change="handleChange($event, 'vip_limit')" placeholder="会员限制">
                    <el-option v-for="item in member_options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="search-input">
            <el-input :value="query.title" placeholder="搜索商品关键词" @input="handleChange($event, 'title')">
                <el-button slot="append" icon="el-icon-search"></el-button>
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
    computed: {
        c_level: {
            get() {
                if (this.query.level === null) {
                    return "";
                } else if (this.query.level === 0) {
                    return "全部";
                } else {
                    return "等级：lv." + this.query.level;
                }
            },
        },
    },
    methods: {
        handleChange(value, key) {
            switch (key) {
                case "level":
                    this.changeQuery("level", value);
                    break;
                case "vip_limit":
                    this.changeQuery("vip_limit", value);
                    break;
                case "title":
                    this.changeQuery("title", value.trim());
                    break;
            }
        },
    },
};
</script>

<style lang="less" scoped>
.search-bar {
    width: 100%;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .select-box {
        display: flex;
        .select-item {
            /deep/.el-select {
                input {
                    width: 100px;
                    height: 24px;
                    padding: 0;
                    border: none;
                    background: transparent;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 1);
                    &::placeholder {
                        font-size: 14px;
                        color: rgba(255, 255, 255, 1);
                    }
                }
                .el-input__suffix {
                    right: 0;
                    height: 24px;
                    i {
                        line-height: 24px;
                        font-size: 12px;
                    }
                }
            }
            &:not(:last-child) {
                .mr(24px);
            }
        }
    }
    .search-input {
        /deep/.el-input {
            border: 0.5px solid rgba(255, 255, 255, 0.5);
            border-radius: 4px;
            input {
                width: 164px;
                height: 24px;
                padding-left: 10px;
                border: none;
                background: transparent;
                font-size: 14px;
                color: rgba(255, 255, 255, 1);
                &::placeholder {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.5);
                }
            }
            .el-input-group__append {
                width: 36px;
                padding: 0;
                background: rgba(255, 255, 255, 0.75);
                color: rgba(0, 0, 0, 1);
                text-align: center;
            }
        }
    }
}
</style>
