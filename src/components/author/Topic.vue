<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li v-for="(item, i) in list" :key="i + item" class="u-item">
                    <!-- Banner -->
                    <a class="u-banner" :href="postLink(item.id)" target="_blank">
                        <img :src="getBanner(item)" :key="item.id" />
                    </a>

                    <!-- 标题 -->
                    <h2 class="u-post">
                        <!-- 标题文字 -->
                        <a :href="postLink(item.id)" class="u-title" target="_blank"
                            >【{{ item.category }}】{{ item.title || "无标题" }}</a
                        >
                    </h2>

                    <!-- 字段 -->
                    <div class="u-content u-desc">
                        {{ item.introduction || "" }}
                    </div>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <span class="u-date">
                            Created on
                            <time>{{ dateFormat(item.created_at) }}</time>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="m-empty" v-else>
            <img src="@/assets/img/author/null.png" width="80%" />
        </div>

        <el-pagination
            class="m-author-pages"
            :hide-on-single-page="true"
            background
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="page"
            :page-size="per"
        >
        </el-pagination>
    </div>
</template>

<script>
import { getLink, showBanner } from "@jx3box/jx3box-common/js/utils";
import dayjs from "dayjs";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import { random } from "lodash";
import { getTopicList } from "@/service/author/author.js";
export default {
    props: [],
    data: function () {
        return {
            loading: false,
            list: [],
            total: 1,
            per: 6,
            page: 1,
        };
    },
    computed: {
        params: function () {
            return {
                user_id: this.uid,
                index: this.page,
                pageSize: this.per,
            };
        },
        uid: function () {
            return ~~this.$store.state.uid;
        },
    },
    methods: {
        loadData: function () {
            if (!this.uid) return;
            this.loading = true;
            getTopicList(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.page.pageTotal;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function (id) {
            return getLink("community", id);
        },
        dateFormat: function (val) {
            return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
        },
        getBanner: function (item) {
            if (item.banner_img) {
                return showBanner(item.banner_img);
            } else {
                // 从1-39中随机选一个
                const randomNum = random(1, 39);
                return __cdn + `design/random_cover/${randomNum}.jpg`;
            }
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
