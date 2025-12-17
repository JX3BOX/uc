<!--
 * @Author: iRuxu
 * @Date: 2022-05-02 10:53:27
 * @LastEditTime: 2022-07-21 22:35:52
 * @Description:
-->
<template>
    <div v-loading="loading" class="m-post">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li v-for="(item, i) in list"  :key="i + item" class="u-item">
                    <!-- 标题 -->
                    <h2 class="u-post">
                        <!-- 标题文字 -->
                        <a :href="postLink(item.type, item.source_id, item.client)" class="u-title" target="_blank">{{ item.title || "无标题" }}</a>
                    </h2>
                    <!-- 字段 -->
                    <div class="u-content u-desc">
                        <i :class="item.client" class="u-client">{{ item.client | clientLabel }}</i>{{ item.type | showType }}百科
                    </div>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <span class="u-date">
                            Updated on
                            <time >{{ item.updated | dateFormat }}</time>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="m-empty" v-else>
            <img src='@/assets/img/author/null.png' width="80%">
        </div>
        <el-pagination
            :current-page.sync="page"
            :hide-on-single-page="true"
            :page-size="per"
            :total="total"
            background
            class="m-author-pages"
            layout="prev, pager, next"
        >
        </el-pagination>
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { getWikis } from "@/service/author/helper.js";
import { __wikiType, __clients, __Root, __OriginRoot } from "@/utils/config";
export default {
    name: "Cj",
    props: [],
    data: function () {
        return {
            loading: false,
            list: [],
            total: 1,
            per: 8,
            page: 1,
            root: {
                std: __Root.slice(0,-1),
                all: __Root.slice(0,-1),
                origin: __OriginRoot.slice(0,-1),
            },
        };
    },
    computed: {
        params: function () {
            return {
                user_id: this.uid,
                page: this.page,
                per: this.per,
            };
        },
        uid: function () {
            return ~~this.$store.state.uid;
        },
        userdata: function () {
            return this.$store.state.userdata;
        },
    },
    methods: {
        loadData: function () {
            if (!this.uid) return;
            this.loading = true;
            getWikis(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function (type, id, client) {
            return this.root[client] + getLink(type, id);
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(~~val * 1000));
        },
        showType: function (type) {
            return __wikiType[type];
        },
        clientLabel: function (val) {
            val = val || "std";
            return __clients[val];
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function () {
                this.loadData();
            },
        },
    },
    mounted: function () {},
};
</script>
