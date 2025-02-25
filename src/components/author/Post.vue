<template>
    <div class="m-post" v-loading="loading">
        <!--        </el-timeline>-->
        <div v-if="list && list.length" class="m-archive-list">
            <ul class="u-list">
                <li class="u-item" v-for="(item, i) in list" :key="i + item">
                    <!-- Banner -->
                    <a class="u-banner" :href="postLink(item.post_type, item.ID, item.client)" target="_blank">
                        <img :src="getBanner(item, item.post_subtype, item.post_type)" :key="item.ID" />
                    </a>

                    <!-- 标题 -->
                    <h2 class="u-post">
                        <!-- 标题文字 -->
                        <a class="u-title" :href="postLink(item.post_type, item.ID, item.client)" target="_blank">{{
                            item.post_title || "无标题"
                        }}</a>
                    </h2>

                    <!-- 字段 -->
                    <div class="u-content u-desc">
                        {{ item.post_excerpt || item.post_title || "这个作者很懒,什么都没有留下" }}
                    </div>

                    <!-- 作者 -->
                    <div class="u-misc">
                        <span class="u-date">
                            Updated on
                            <time>{{ item.post_modified | dateFormat }}</time>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
        <!-- <el-alert v-else title="没有找到相关条目" type="info" show-icon> </el-alert> -->
        <div class="m-empty" v-else>
            <img src="@/assets/img/author/null.png" width="80%" />
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
import { getLink, showBanner } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { getPosts } from "@/service/author/cms.js";
import { __postType, __clients, __Root, __OriginRoot, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
export default {
    props: [],
    data: function () {
        return {
            loading: false,
            list: [],
            total: 1,
            per: 6,
            page: 1,
            root: {
                std: __Root.slice(0, -1),
                origin: __OriginRoot.slice(0, -1),
                all: "",
                "wujie": ""
            },
        };
    },
    computed: {
        params: function () {
            return {
                author: this.uid,
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
        loadData: function (i = 1) {
            if (!this.uid) return;
            this.loading = true;
            getPosts(this.params)
                .then((res) => {
                    this.list = res.data.data.list || [];
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function (type, id, client) {
            client = client || "all";
            return this.root[client] + getLink(type, id);
        },
        getBanner: function (item, subtype, post_type) {
            if (item.post_banner) {
                return showBanner(item.post_banner);
            } else {
                if (post_type == "bps" || post_type == "macro" || post_type == "pvp") {
                    let img_name = (subtype && xfmap[subtype]?.["id"]) || 0;
                    return __imgPath + "image/bps_thumbnail/" + img_name + ".png";
                } else if (post_type == "fb") {
                    let zlp = item.post_meta?.fb_zlp || item.zlp || this.$store.state.default_zlp;
                    let fb = item.post_subtype || this.$store.state.default_fb;
                    let img = this.$store.state.map?.[zlp]?.dungeon?.[fb].icon;
                    if (img) {
                        return __imgPath + img;
                    } else {
                        return __imgPath + "image/fb_map_thumbnail/null.png";
                    }
                } else if (post_type == "share") {
                    let url = _.get(item.post_meta, "pics[0]['url']");
                    if (url) {
                        return showBanner(url, "face");
                    } else {
                        return __imgPath + "image/face/null2.png";
                    }
                }
                return __imgPath + `image/banner/` + post_type + subtype + ".png";
            }
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(val));
        },
        typeFormat: function (type) {
            return __postType[type];
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

<style lang="less">
.m-post {
    padding: 20px;
    .el-tabs__item {
        .bold;
    }
    .u-type {
        margin: 0;
    }
    .u-title {
        &:hover {
            color: @pink;
        }
    }
}
.m-post-list {
    padding-left: 20px;
}
.m-author-pages {
    .x;
    max-width: 100%;
    overflow-x: auto;
}
</style>
