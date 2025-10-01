<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li v-for="(item, i) in list"  :key="i + item" class="u-item">
                    <!-- 标题 -->
                    <h2 class="u-post">
                        <!-- 标题文字 -->
                        <a :href="postLink(item.id,item.client)" class="u-title" target="_blank">{{ item.title || "无标题" }}</a>
                    </h2>
                    <!-- 字段 -->
                    <div class="u-content u-desc">
                        <el-tag type="primary" size="mini" v-for="(tag,index) in JSON.parse(item.tags||[])" :key="'tag'+index" class="u-tag">{{ tag }}</el-tag>
                    </div>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <span class="u-date">
                            Created on
                            <time >{{ item.createTime || dateFormat }}</time>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="m-empty" v-else>
            <img src='@/assets/img/author/null.png' width="80%">
        </div>
        <el-pagination
            class="m-author-pages"
            background
            :hide-on-single-page="true"
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            :page-size="per"
        >
        </el-pagination>
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { getQuestions } from "@/service/author/next.js";
import {  __clients , __Root, __OriginRoot} from "@/utils/config";
export default {
    name: "Question",
    props: [],
    data: function() {
        return {
            loading: false,
            list: [],
            total: 1,
            per: 8,
            page: 1,
            root: {
                std: __Root.slice(0,-1),
                origin: __OriginRoot.slice(0,-1),
                all : ''
            },
        };
    },
    computed: {
        params: function() {
            return {
                uid: this.uid,
                pageIndex: this.page,
                pageSize: this.per,
            };
        },
        uid : function (){
            return ~~this.$store.state.uid
        },
        userdata: function() {
            return this.$store.state.userdata;
        },
    },
    methods: {
        loadData: function() {
            if (!this.uid) return;
            this.loading = true;
            getQuestions(this.params)
                .then((res) => {
                    this.list = res.data.data;
                    this.total = res.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function(id,client) {
            return this.root[client] + getLink('question', id);
        },
    },
    filters: {

        dateFormat: function(val) {
            return dateFormat(new Date(~~val * 1000));
        },
        clientLabel: function(val) {
            val = val || "std";
            return __clients[val];
        },
    },
    watch: {
        params: {
            deep: true,
            immediate: true,
            handler: function() {
                this.loadData();
            },
        },
    },
    mounted: function() {},
};
</script>

<style lang="less"></style>
