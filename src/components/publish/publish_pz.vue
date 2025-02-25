<template>
    <div class="m-publish-pz" v-loading="loading">
        <el-divider content-position="left">配装</el-divider>
        <div class="m-publish-pz-header">
            <el-button
                class="u-add u-btn"
                icon="el-icon-circle-plus-outline"
                type="primary"
                @click="addItem"
                :disabled="list.length >= limit"
            >添加配装</el-button>
            <slot name="prepend" class="m-publish-pz-prepend"></slot>
        </div>
        <div class="m-publish-pz-list">
            <draggable
                class="u-list"
                :list="list"
                draggable=".u-item"
                v-bind="{ animation: 150, scrollSensitivity: 200 }"
            >
                <div class="u-item" v-for="(item,i) in list" :key="i">
                    <span class="u-item-order">{{ i + 1}}.</span>
                    <i class="u-item-drag el-icon-rank"></i>
                    <div class="u-item-select">
                        <el-select
                            v-model="item.id"
                            placeholder="请选择配装方案"
                            clearable
                            filterable
                            remote
                            :loading="search_loading"
                            @visible-change="listOptions"
                            :remote-method="searchOptions"
                            size="small"
                        >
                            <el-option
                                v-for="option in computedOptions"
                                :key="option.id"
                                :label="option.title"
                                :value="option.id"
                                class="m-publish-pz-select-option"
                            >
                                <i
                                    class="u-client i-client"
                                    :class="option.client || 'std'"
                                >{{option.client == 'origin' ? '缘起' : '剑三'}}</i>
                                <i
                                    class="u-level i-client"
                                    :class="option.client || 'std'"
                                >Lv.{{ option.global_level || '-' }}</i>
                                <span>{{ option.title }}</span>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="u-item-name">
                        <el-input
                            v-model="item.name"
                            placeholder="请输入配装简称"
                            clearable
                            :maxlength="12"
                            :minlength="1"
                            :show-word-limit="true"
                            size="small"
                        ></el-input>
                    </div>
                    <div class="u-item-op">
                        <a
                            class="preview el-button delete el-button--text"
                            :href="item.id | getLink"
                            v-if="item.id"
                            target="_blank"
                        >
                            <i class="el-icon-view"></i>预览
                        </a>
                        <el-button
                            class="delete"
                            type="text"
                            icon="el-icon-delete"
                            @click="removeItem(i)"
                        >删除</el-button>
                    </div>
                </div>
            </draggable>
        </div>
        <slot name="append" class="m-publish-pz-append"></slot>
        <slot></slot>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import { getMyPzList } from "@/service/publish/app.js";
import { getLink } from "@jx3box/jx3box-common/js/utils";
import {cloneDeep, unionBy} from "lodash";
export default {
    name: "PublishPz",
    props: {
        data: {
            type: Array,
            default: function () {
                return [{ id: "", name: "" }];
            },
        },
        limit: {
            type: Number,
            default: 8,
        },
        query: {
            type: Object,
            default: function () {
                return {};
            },
        },
    },
    components: { draggable },
    data: function () {
        return {
            // 选择的配装方案
            list: [],
            loading: false,
            default_item: { id: "", name: "" },

            // 选项列表
            options: [],
            search_loading: false,

            selectedOptions: []
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (!newval || !newval.length) {
                    this.list = [{ id: "", name: "" }];
                } else {
                    this.list = newval;
                }
                this.getSelectedOptions();
            },
        },
        list: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
    computed: {
        params: function () {
            let _params = {};
            _params = Object.assign(_params, this.query);
            return _params;
        },
        computedOptions: function () {
            return this.selectedOptions?.length ? unionBy([...this.options, ...this.selectedOptions], 'id') : [...this.options];
        },
    },
    methods: {
        // 获取选项
        loadOptions: function () {
            getMyPzList(this.params).then((res) => {
                this.options = res.data.data.list || [];
            });
        },
        // 展开下拉
        listOptions: function (status) {
            if (status) {
                this.loadOptions();
            }
        },
        // 搜索
        searchOptions: function (keywords) {
            let _params = Object.assign(this.params, { search: keywords });
            this.loadOptions();
        },
        // 获取已选取的选项
        getSelectedOptions: function () {
            const ids = this.list.map((item) => item.id)?.join(",");
            getMyPzList({ ids }).then((res) => {
                this.selectedOptions = res.data.data.list || [];
            });
        },
        // 添加
        addItem: function () {
            this.list.push(cloneDeep(this.default_item));
        },
        // 删除
        removeItem: function (i) {
            this.list.splice(i, 1);
        },
    },
    filters: {
        getLink: function (val) {
            return getLink("pz", val);
        },
    },
};
</script>

<style lang="less">
.m-publish-pz-list {
    .mt(10px);
    .u-item {
        display: flex;
        line-height: 40px;
    }
    .u-item-order {
        .fz(12px);
        color: #888;
    }
    .u-item-drag {
        .fz(24px,40px);
        color: #aaa;
        cursor: move;
        .y(top);
        .mr(5px);
        padding: 0 10px;
    }

    .u-item-select {
        flex: 1;
        max-width: 600px;
        .el-select {
            .w(100%);
        }
        .el-input__suffix .el-input__icon {
            &:after {
                // content:"\e6df";
                content: "\e6e1";
            }
            padding: 0;
            line-height: 32px;
            height: 34px;
            box-sizing: border-box;
            transform-origin: center;
        }
    }

    .u-item-name {
        .w(260px);
        .ml(10px);
    }
    .u-item-op {
        .ml(20px);
        .preview {
            .mr(10px);
        }
        i {
            .mr(5px);
        }
        span {
            .ml(0);
        }
        .el-button {
            .fz(13px);
        }
    }
}
.m-publish-pz-select-option {
    // 版本
    @origin: #0eb7ce;
    @std: #f0b400;
    display: flex;
    align-items: center;
    .i-client {
        .fl;
        .mr(5px);

        font-style: normal;
        .fz(12px,20px);
        padding: 1px 5px;
        .r(3px);
        // .mr(5px);

        &.std {
            border: 1px solid @std;
            color: @std;
        }

        &.origin {
            border: 1px solid @origin;
            color: @origin;
        }
    }
}
</style>
