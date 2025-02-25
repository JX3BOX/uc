<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li v-for="(item, i) in list"  :key="i + item" class="u-item">
                    <!-- 标题 -->
                    <h2 class="u-jokes">
                        <!-- 标题文字 -->
                        <a :href="postLink(item.id)" class="u-title" target="_blank">{{ item.content || "无标题" }}</a>
                    </h2>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <span class="u-date">
                            Created on
                            <time >{{ dateFormat(item.created_at) }}</time>
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
import dayjs from 'dayjs'
import { getUserJokes } from "@/service/author/cms.js";
export default {
    props: [],
    data: function() {
        return {
            loading: false,
            list: [],
            total: 1,
            per : 6,
            page : 1
        };
    },
    computed : {
        params : function (){
            return {
                user_id: this.uid,
                page: this.page,
                per: this.per
            }
        },
        uid : function (){
            return ~~this.$store.state.uid
        }
    },
    methods: {
        loadData: function() {
            if (!this.uid) {
                return;
            }
            this.loading = true;
            getUserJokes(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function(id) {
            return getLink("joke", id);
        },
        dateFormat: function(val) {
            return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
        },
    },
    watch : {
        params : {
            deep:true,
            immediate:true,
            handler : function (){
                this.loadData();
            }
        }
    },
    mounted: function() {

    },
};
</script>
