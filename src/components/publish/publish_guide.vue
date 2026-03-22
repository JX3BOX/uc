<template>
    <!-- 前后引导 -->
    <div class="m-publish-guide">
        <label class="el-form-item__label">前后引导 </label>
        <div class="u-condition u-prev" key="prev">
            <span class="u-prepend">上一篇</span>
            <el-select
                filterable
                remote
                placeholder="输入关键词进行搜索"
                :remote-method="remoteMethodPrev"
                v-model="prevPost"
                clearable
                size="small"
            >
                <el-option v-for="item in prev" :key="item.ID" :value="item.ID" :label="item.post_title">
                    <div class="u-post-select__item">
                        <el-tag v-if="item.post_type" :type="item.visible != 0 ? 'warning' : ''">{{
                            showPostType(item.post_type)
                        }}</el-tag>
                        {{ item.post_title }}
                    </div></el-option
                >
            </el-select>
        </div>
        <div class="u-condition u-next" key="next">
            <span class="u-prepend">下一篇</span>
            <el-select
                filterable
                remote
                placeholder="输入关键词进行搜索"
                :remote-method="remoteMethodNext"
                v-model="nextPost"
                clearable
                size="small"
            >
                <el-option v-for="item in next" :key="item.ID" :value="item.ID" :label="item.post_title">
                    <div class="u-post-select__item">
                        <el-tag v-if="item.post_type" :type="item.visible != 0 ? 'warning' : ''">{{
                            showPostType(item.post_type)
                        }}</el-tag>
                        {{ item.post_title }}
                    </div></el-option
                >
            </el-select>
        </div>
    </div>
</template>

<script>
import { __postType } from "@/utils/config";
import { getMyPosts } from "@/service/publish/cms";
import { cloneDeep } from "lodash";
export default {
    name: "PublishGuide",
    emits: ["update:data"],
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            prev: [],
            next: [],

            isInit: true,
        };
    },
    computed: {
        prevPost: {
            get() {
                return this.data?.prev_post || "";
            },
            set(val) {
                this.updateData({ prev_post: val });
            },
        },
        nextPost: {
            get() {
                return this.data?.next_post || "";
            },
            set(val) {
                this.updateData({ next_post: val });
            },
        },
        form() {
            return {
                prev_post: this.data.prev_post,
                next_post: this.data.next_post,
            };
        },
    },
    watch: {
        form: {
            handler: async function (val) {
                if ((val.prev_post || val.next_post) && this.isInit) {
                    const { prev_post, next_post } = this.data;

                    const list = [prev_post, next_post].filter((item) => item).join(",");

                    if (list) {
                        const res = await this.loadPosts({ list });

                        this.prev = [...res, ...this.prev];
                        this.next = [...res, ...this.next];
                    }
                    this.isInit = false;
                }
            },
            deep: true,
        },
    },
    async mounted() {
        const res = await this.loadPosts({
            page: 1,
            per: 5,
        });
        this.prev = cloneDeep(res);
        this.next = cloneDeep(res);
    },
    methods: {
        updateData(patch) {
            this.$emit("update:data", { ...this.data, ...patch });
        },
        async remoteMethodPrev(keyword) {
            if (keyword) {
                const params = {
                    title: keyword,
                    page: 1,
                    per: 10,
                };
                const res = await this.loadPosts(params);
                this.prev = cloneDeep(res);
            } else {
                this.prev = [];
            }
        },
        async remoteMethodNext(keyword) {
            if (keyword) {
                const params = {
                    title: keyword,
                    page: 1,
                    per: 10,
                };
                const res = await this.loadPosts(params);
                this.next = cloneDeep(res);
            } else {
                this.next = [];
            }
        },
        showPostType: function (type) {
            const typeMap = {
                ...__postType,
                bbs: "茶馆",
            };
            return typeMap[type];
        },
        async loadPosts(params) {
            return await getMyPosts(params).then((res) => {
                return res.data.data?.list;
            });
        },
    },
};
</script>

<style lang="less">
.m-publish-guide {
    .flex;
    align-items: center;
    margin-bottom: 22px;
    .el-form-item__label {
        width: 80px;
    }
    .u-condition {
        height: 32x;
        width: auto;
        .flex;
        align-items: center;

        .u-prepend {
            background-color: #f5f7fa;
            color: #909399;
            border: 1px solid #dcdfe6;
            border-right: none;
            border-radius: 4px 0 0 4px;
            padding: 0 15px;
            min-width: 80px;
            height: 32px !important;
            box-sizing: border-box;
            .fz(12px);
            .flex;
            align-items: center;
            justify-content: center;
        }

        .el-select {
            .db;
            .w(260px);
            margin-left: -1px;

            .el-select__wrapper {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                box-shadow: 0 0 0 1px #dcdfe6 inset;
                height: 32px;
                box-sizing: border-box;

                &.is-focus {
                    box-shadow: 0 0 0 1px @primary inset !important;
                }
            }

            .el-input__inner {
                height: 32px;
            }
        }
    }
    .u-prev {
        margin-right: 20px;
    }
}

.u-post-select__item {
    .flex;
    align-items: center;
    gap: 5px;
    .pr;
}

@media screen and (max-width: @phone) {
    .m-publish-guide {
        flex-wrap: wrap;
        .el-form-item__label {
            width: 100%;
        }
        .u-prev {
            margin-bottom: 10px;
        }
    }
}
</style>
