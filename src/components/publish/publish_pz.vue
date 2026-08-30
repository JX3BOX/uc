<template>
    <div class="m-publish-pz" v-loading="loading">
        <el-divider content-position="left">{{ $t("publish.gear.title") }}</el-divider>
        <div class="m-publish-pz-header">
            <el-button
                class="u-add u-btn"
                icon="CirclePlus"
                type="primary"
                @click="addItem"
                :disabled="list.length >= limit"
                >{{ $t("publish.gear.add") }}</el-button
            >
            <slot name="prepend" class="m-publish-pz-prepend"></slot>
        </div>
        <div class="m-publish-pz-list">
            <draggable
                class="u-list"
                :list="list"
                draggable=".u-item"
                item-key="id"
                v-bind="{ animation: 150, scrollSensitivity: 200 }"
            >
                <template #item="{ element, index }">
                    <div class="u-item">
                        <span class="u-item-order">{{ index + 1 }}.</span>
                        <i class="u-item-drag el-icon-rank"></i>
                        <div class="u-item-select">
                            <el-select
                                v-model="element.id"
                                :placeholder="$t('publish.gear.selectPlaceholder')"
                                clearable
                                filterable
                                remote
                                :loading="search_loading"
                                @visible-change="listOptions"
                                :remote-method="searchOptions"
                                size="large"
                            >
                                <el-option
                                    v-for="option in computedOptions"
                                    :key="option.id"
                                    :label="option.title"
                                    :value="option.id"
                                    class="m-publish-pz-select-option"
                                >
                                    <i class="u-client i-client" :class="option.client || 'std'">{{
                                        option.client == "origin" ? $t("publish.form.originServer") : $t("publish.form.standardServer")
                                    }}</i>
                                    <i class="u-level i-client" :class="option.client || 'std'"
                                        >Lv.{{ option.global_level || "-" }}</i
                                    >
                                    <span>{{ option.title }}</span>
                                </el-option>
                            </el-select>
                        </div>
                        <div class="u-item-name">
                            <el-input
                                v-model="element.name"
                                :placeholder="$t('publish.gear.shortNamePlaceholder')"
                                clearable
                                :maxlength="12"
                                :minlength="1"
                                :show-word-limit="true"
                                size="large"
                            ></el-input>
                        </div>
                        <div class="u-item-op">
                            <a
                                class="preview el-button delete el-button--text"
                                :href="getLink(element.id)"
                                v-if="element.id"
                                target="_blank"
                            >
                                <i class="el-icon-view"></i>{{ $t("publish.common.preview") }}
                            </a>
                            <el-button class="delete" link icon="Delete" @click="removeItem(index)">{{ $t("publish.common.delete") }}</el-button>
                        </div>
                    </div>
                </template>
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
import { cloneDeep, unionBy } from "lodash";
export default {
    name: "PublishPz",
    props: {
        modelValue: {
            type: Array,
            default: undefined,
        },
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
            optionsRequestId: 0,

            selectedOptions: [],
            selectedRequestId: 0,
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (newval !== undefined) {
                    if (!newval || !newval.length) {
                        this.list = [{ id: "", name: "" }];
                    } else {
                        this.list = newval;
                    }
                    this.getSelectedOptions();
                }
            },
        },
        data: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (this.modelValue === undefined) {
                    if (!newval || !newval.length) {
                        this.list = [{ id: "", name: "" }];
                    } else {
                        this.list = newval;
                    }
                    this.getSelectedOptions();
                }
            },
        },
        list: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
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
            return this.selectedOptions?.length
                ? unionBy([...this.options, ...this.selectedOptions], "id")
                : [...this.options];
        },
    },
    methods: {
        // 获取选项
        loadOptions: function (params = this.params) {
            const requestId = ++this.optionsRequestId;
            this.search_loading = true;
            return getMyPzList(params)
                .then((res) => {
                    if (requestId !== this.optionsRequestId) return;
                    this.options = res.data.data.list || [];
                })
                .finally(() => {
                    if (requestId === this.optionsRequestId) this.search_loading = false;
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
            this.loadOptions({ ...this.params, search: keywords || undefined });
        },
        // 获取已选取的选项
        getSelectedOptions: function () {
            const ids = this.list.map((item) => item.id).filter(Boolean);
            const requestId = ++this.selectedRequestId;
            if (!ids.length) {
                this.selectedOptions = [];
                this.loading = false;
                return;
            }

            this.loading = true;
            return getMyPzList({ ids: ids.join(",") })
                .then((res) => {
                    if (requestId !== this.selectedRequestId) return;
                    this.selectedOptions = res.data.data.list || [];
                })
                .finally(() => {
                    if (requestId === this.selectedRequestId) this.loading = false;
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
        align-items: center;
        min-height: 40px;

        & + .u-item {
            .mt(10px);
        }
    }
    .u-item-order {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        .w(24px);
        .fz(12px);
        color: #888;
    }
    .u-item-drag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: none;
        .fz(24px);
        color: #aaa;
        cursor: move;
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
        .flex;
        align-items: center;
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

@media screen and (max-width: @phone) {
    .m-publish-pz-list {
        min-width: 0;

        .u-item {
            display: grid;
            grid-template-columns: 24px 36px minmax(0, 1fr);
            gap: 8px 4px;
            width: 100%;
            min-width: 0;
            padding: 12px 0;
            border-bottom: 1px dashed #e4e7ed;
            box-sizing: border-box;
        }

        .u-item-order,
        .u-item-drag {
            margin: 0;
            padding: 0;
        }

        .u-item-select {
            width: 100%;
            min-width: 0;
            max-width: none;
        }

        .u-item-name {
            grid-column: 3;
            width: 100%;
            min-width: 0;
            margin-left: 0;
        }

        .u-item-op {
            grid-column: 3;
            min-width: 0;
            margin-left: 0;
            flex-wrap: wrap;

            .preview {
                margin-right: 8px;
            }
        }
    }

    .m-publish-pz-header {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .m-publish-pz-select-option {
        min-width: 0;

        span:last-child {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
