<template>
    <div class="m-publish-topic-bucket">
        <el-form-item :label="label">
            <el-popover popper-class="m-topic-bucket__pop" placement="bottom-start">
                <el-button icon="el-icon-plus" size="small" trigger="click" slot="reference"></el-button>
                <div class="m-topic_bucket__content">
                    <el-input v-model="search" placeholder="输入关键词" prefix-icon="el-icon-search" size="small" @keypress.enter.native="onSearch">
                    </el-input>
                    <div class="m-topic-bucket__list" v-if="list && list.length">
                        <el-checkbox-group v-model="selected">
                            <el-checkbox v-for="item in list" :label="item" :key="item"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <el-alert v-else class="u-alert" type="info" show-icon :title="search ? '未找到相关条目' : '请输入关键词进行查询'" :closable="false" center></el-alert>
                </div>
            </el-popover>
            <div class="m-topic-bucket__selected">
                <el-tag class="m-selected-item" v-for="item in selected" :key="item" closable @close="onClose(item)">{{item}}</el-tag>
            </div>
        </el-form-item>
    </div>
</template>

<script>
import { get_topic_bucket } from "@/service/publish/post";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
export default {
    name: "publish_topic_bucket",
    props: {
        label: {
            type: String,
            default: "更多主题",
        },
        type: {
            type: String,
            default: "bbs"
        },
        value: {
            type: Array,
            default: () => [],
        }
    },
    model: {
        prop: "value",
        event: "update",
    },
    data() {
        return {
            search: "",
            list: [],

            selected: [],
        };
    },
    computed: {
        params() {
            return {
                search: this.search,
                type: this.type,
            };
        },
    },
    watch: {
        selected: {
            deep: true,
            handler(val, oVal) {
                if (!isEqual(val, oVal)) {
                    this.$emit('update', this.selected)
                }
            }
        },
        value: {
            deep: true,
            // immediate: true,
            handler() {
                this.selected = cloneDeep(this.value);
            }
        }
    },
    mounted() {
        this.loadTopicBucket();
    },
    methods: {
        loadTopicBucket() {
            get_topic_bucket(this.params).then((res) => {
                this.list = res.data.data?.map(item => item.name) || [];
            });
        },
        onSearch() {
            this.loadTopicBucket();
        },
        onClose(item) {
            this.selected = this.selected.filter((i) => i !== item);
        },
    },
};
</script>

<style lang="less">
.m-publish-topic-bucket {
    .el-form-item__content {
        .flex;
        align-items: center;
    }
    .m-topic-bucket__selected {
        margin-left: 20px;
        .flex;
        align-items: center;
        gap: 10px;
    }
}
.m-topic-bucket__pop {
    width: 420px;
    .m-topic-bucket__list {
        margin-top: 10px;
    }
    .u-alert {
        margin-top: 10px;
    }
}
</style>
