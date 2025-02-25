<template>
    <div class="m-publish-collection-relation">
        <h5 class="u-schema">
            <!-- <span class="u-label">关联小册</span> -->
            <a class="u-add el-button el-button--primary el-button--mini" href="/publish/#/collection" target="_blank">+ 创建小册</a>
            <slot></slot>
            <a class="u-help u-icon-links" href="/tool/20891" target="_blank">
                <i class="el-icon-question"></i> 小册帮助指南
            </a>
        </h5>
        <el-select
            class="u-collection"
            v-model="post_collection"
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            filterable
            clearable
            placeholder="请选择一个小册（可选，非必填，可搜索）"
            @visible-change="visibleChange"
        >
            <el-option
                v-for="(item, index) in collections"
                :key="index"
                :label="item.title"
                :value="item.id"
            ></el-option>
            <div slot="empty" class="u-collection-null">
                <div>
                    没有找到匹配结果，
                    <a href="/publish/#/collection" target="_blank">创建小册</a>
                </div>
            </div>
        </el-select>
        <div class="u-tip" v-if="isEmpty">
            <i class="el-icon-info"></i> 当前没有任何小册，
            <a href="/publish/#/collection" target="_blank">创建小册</a>
        </div>
    </div>
</template>
<script>
import { get_my_collections } from "@/service/publish/collection";
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "publish_collection",
    props: ["data"],
    data: function () {
        return {
            post_collection: "",

            collections: [],
            copyCollections: [],

            isInit: true,
            loading: false,
            search: "",
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    computed: {
        isEmpty: function () {
            return !this.search && !this.collections.length;
        },
    },
    watch: {
        data: {
            immediate: true,
            handler(newval) {
                this.post_collection = Number(newval) || "";
            },
        },
        post_collection: {
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
    },
    methods: {
        loadCollections: function (keyword = "") {
            const params = {
                keyword,
            };
            get_my_collections(params).then((res) => {
                this.collections = res.data.data.list;

                if (this.isInit) {
                    this.copyCollections = cloneDeep(this.collections);
                    this.isInit = false;
                }
            });
        },
        remoteMethod: function (keyword = "") {
            this.search = keyword;
            this.loading = true;
            if (keyword !== "") {
                const params = {
                    keyword,
                };
                get_my_collections(params).then((res) => {
                    this.collections = res.data.data.list;
                    this.loading = false;
                });
            } else {
                this.collections = cloneDeep(this.copyCollections);
            }
        },
        visibleChange: function (val) {
            if (val) {
                this.collections = cloneDeep(this.copyCollections);
            }
        },
    },
    mounted: function () {
        this.loadCollections();
    },
    components: {},
};
</script>


<style lang="less">
.u-collection-null {
    padding: 5px 10px;
    .x;
    .fz(13px,34px);
    color: #999;
    a {
        box-shadow: 0 1px 0 @color-link;
    }
}
.m-publish-collection-relation {
    h5 {
        margin: 20px 0;
        font-size: 14px;
        line-height: 18px;
        font-weight: normal;
    }

    .u-icon-links {
        margin-left: 10px;
        font-size: 13px;
        color: #0366d6;
        box-shadow: 0 1px 0 #0366d6;

        &:hover {
            color: @pink;
            box-shadow: 0 1px 0 #f39;
        }
    }

    // .u-add{
    //     .ml(5px);
    // }
    .u-help {
        .fr;
    }
    .u-collapse {
        .ml(20px);
    }
    .u-collection {
        .w(100%);
    }
    .u-tip {
        .fz(13px);
        color: #999;
        .mt(8px);
        a {
            box-shadow: 0 1px 0 @color-link;
        }
    }
}
</style>
