<template>
    <div class="search-bar">
        <div class="select-box">
            <i
                class="el-icon-s-unfold"
                @click="$store.commit('mallNew/toState', { navIsShow: true })"
                style="font-size: 5.3333vw"
            ></i>
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
    display: flex;
    flex-direction: column;
    gap: 1.0667vw;
    .select-box {
        display: flex;
        align-items: center;
        gap: 6.4vw;
        font-size: 3.8vw;
        color: rgba(255, 255, 255, 1);
        .select-item {
            /deep/.el-select {
                input {
                    width: 21.3333vw;
                    height: 6.4vw;
                    padding: 0;
                    border: none;
                    background: transparent;
                    font-size: 3.7333vw;
                    color: rgba(255, 255, 255, 1);
                    &::placeholder {
                        font-size: 3.7333vw;
                        color: rgba(255, 255, 255, 1);
                    }
                }
                .el-input__suffix {
                    right: 0;
                    height: 6.4vw;
                    .el-input__suffix-inner {
                        height: 6.4vw;
                        i {
                            font-size: 3.2vw;
                            line-height: 6.4vw;
                        }
                    }
                }
            }
        }
    }
    .search-input {
        /deep/.el-input {
            border: 0.1333vw solid rgba(255, 255, 255, 0.5);
            border-radius: 1.0667vw;
            input {
                width: 84vw;
                height: 6.4vw;
                padding-left: 2.6667vw;
                border: none;
                background: transparent;
                font-size: 3.7333vw;
                color: rgba(255, 255, 255, 1);
                &::placeholder {
                    font-size: 3.7333vw;
                    color: rgba(255, 255, 255, 0.5);
                }
            }
            .el-input-group__append {
                width: 9.6vw;
                padding: 0;
                background: rgba(255, 255, 255, 0.75);
                color: rgba(0, 0, 0, 1);
                text-align: center;
            }
        }
    }
}
</style>
