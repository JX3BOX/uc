<template>
    <div class="m-post">
        <ContentSkeleton v-if="loading" variant="list" :rows="6" compact />
        <!-- 列表 -->
        <div v-else-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li v-for="(item, i) in list" :key="i + item" class="u-item">
                    <!-- 标题 -->
                    <h2 class="u-post">
                        <!-- 标题文字 -->
                        <a :href="item.link || defult_link" class="u-title" target="_blank">{{
                            item.key || $t("author.common.noTitle")
                        }}</a>
                    </h2>
                    <!-- 字段 -->
                    <div class="u-desc">
                        {{ item.desc || $t("author.list.noNamespaceDescription") }}
                    </div>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <span class="u-date">
                            {{ $t("author.common.updatedOn") }}
                            <time>{{ dateFormat(item.updated) }}</time>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <div class="m-empty" v-else>
            <img src="@/assets/img/author/null.png" width="80%" />
        </div>

        <el-pagination
            v-if="!loading"
            class="m-author-pages"
            background
            :hide-on-single-page="true"
            layout="prev, pager, next"
            :total="total"
            v-model:current-page="page"
            :page-size="per"
        >
        </el-pagination>
    </div>
</template>

<script>
import dateFormat from "@/utils/dateFormat";
import { getNamespaces } from "@/service/author/helper.js";
export default {
    props: [],
    data: function () {
        return {
            loading: true,
            list: [],
            total: 1,
            per: 8,
            page: 1,
            defult_link: "https://www.jx3box.com",
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
            if (!this.uid) {
                this.loading = false;
                return;
            }
            this.loading = true;
            getNamespaces(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        dateFormat: function (val) {
            return dateFormat(new Date(~~val * 1000));
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
