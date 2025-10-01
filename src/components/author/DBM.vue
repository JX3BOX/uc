<template>
    <div class="m-post" v-loading="loading">
        <div v-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li v-for="(item, i) in list"  :key="i + item" class="u-item">
                    <!-- 标题 -->
                    <h2 class="u-post">
                        <!-- 标题文字 -->
                        <a :href="postLink(item.id)" class="u-title" target="_blank">{{ item.title || "无标题" }}</a>
                    </h2>
                    <!-- 字段 -->
                    <div class="u-content u-desc">
                        <i :class="item.client" class="u-client">{{ clientLabel(item.client) }}</i>
                        {{ item.key }}
                    </div>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <span class="u-date">
                            Updated on
                            <time >{{ dateFormat(item.updated_at) }}</time>
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
import {getLink, showAvatar,authorLink,} from "@jx3box/jx3box-common/js/utils";
import { __postType, __clients } from "@/utils/config";
import dayjs from "dayjs";
import {getDBM} from "@/service/author/cms.js";
export default {
    name: "DBM",
    data() {
        return {
            loading: false,
            list: [],
            total: 1,
            per: 8,
            page: 1,
        };
    },
    computed: {
        uid: function() {
            return this.$route.params.id;
        },
        params() {
            return {
                user_id: this.uid,
                per: this.per,
                page: this.page,
            }
        }
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
    methods: {
        dateFormat(date) {
            return dayjs(date).format("YYYY-MM-DD");
        },
        showAvatar: function(userinfo) {
            return showAvatar(userinfo?.user_avatar);
        },
        showNickname : function (userinfo){
            return userinfo?.display_name || '匿名'
        },
        clientLabel: function(val) {
            val = val || "std";
            return __clients[val];
        },
        loadData: function(i = 1) {
            if (!this.uid) return;
            this.loading = true;
            getDBM(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink(id) {
            return getLink('pkg', id);
        }
    }
}
</script>
