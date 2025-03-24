<template>
   <sub-tab-content :list="list" @change-tab="changeTab">
       <div class="m-post" v-loading="loading">
           <!--        </el-timeline>-->
           <div v-if="posts && posts.length" class="m-archive-list">
               <div class="u-list">
                       <a class="u-item" target="_blank" :href="postLink(item.post_type, item.ID, item.client)" v-for="(item, i) in posts" :key="i + item">
                           <!-- Banner -->

                           <div class="u-banner" target="_blank">
                               <img :src="getBanner(item, item.post_subtype, item.post_type)" :key="item.ID" />
                           </div>

                           <!-- 标题 -->
                           <div class="u-post">
                               <!-- 标题文字 -->
                               <div class="u-title"  target="_blank">{{item.post_title || "无标题" }}</div>
                               <!--                        <div class="u-desc">-->
                               <!--                            {{ item.post_excerpt || item.post_title || "这个作者很懒,什么都没有留下" }}-->
                               <!--                        </div>-->
                               <time class="u-time">{{ item.post_modified | dateFormat }}</time>
                           </div>
                       </a>

               </div>
           </div>
           <!-- <el-alert v-else title="没有找到相关条目" type="info" show-icon> </el-alert> -->
           <div class="m-empty" v-else>
               <img src="https://cdn.jx3box.com/design/miniprogram/empty.png" width="80%" />
           </div>
       </div>
   </sub-tab-content>
</template>

<script>
import { getLink, showBanner } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { getPosts } from "@/service/author/cms.js";
import { __postType, __clients, __Root, __OriginRoot, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import SubTabContent from "@/components/author/mobile/Pannel/SubTabContent.vue";
export default {
    components: { SubTabContent },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data: function () {
        return {
            loading: false,
            posts: [],
            total: 1,
            per: 6,
            page: 1,
            currentTab: "",
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
        changeTab(e){
            this.currentTab = e;
            this.page = 1;
            this.loadData(true)
        },
        loadData: function (init = false) {
            if (!this.uid || !this.currentTab || (this.posts>= this.total && !init)){
                return;
            }
            this.loading = true;
            getPosts({...this.params,type: this.currentTab})
                .then((res) => {
                    if (init){
                        this.posts = [];
                    }
                    this.posts = this.posts.concat(res.data.data.list || []);
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
        loadMore(){
            if (this.loading) return;
            if (document.documentElement.scrollTop + window.innerHeight + 100 >= document.documentElement.scrollHeight) {
                if (this.posts.length < this.total) {
                    this.page++;
                    this.loadData();
                }
            }
        }
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

    },
    mounted() {
        window.addEventListener("scroll", this.loadMore);
    },
    destroyed() {
        window.removeEventListener("scroll", this.loadMore);
    }
};
</script>

<style lang="less">

.m-post{
    width: 100%;
    .m-archive-list{
        .u-list{
            display: flex;
            flex-direction: column;
            gap: 20px;
            .u-item{
                display: flex;
                width: 100%;
                justify-content: flex-start;
                gap: 12px;

                .u-banner{
                    flex: 1 0 0;
                    max-width: 126px;
                    max-height: 64.145px;
                    overflow: hidden;
                    background: none;
                    // 解锁图片比例，撑满
                    img{
                        min-height: 100%;
                        min-width: 100%;
                        overflow: hidden;
                        background: none;

                    }
                    border-radius: 4px;
                    background: #DFDFDF;
                }

                .u-post{
                    flex: 1 0 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .u-title{
                        color: var(--black-100, #FFF);
                        /* 14 Regular */
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 20px; /* 142.857% */

                        // 最多两行
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                    .u-time{
                        color: var(--black-40, rgba(255, 255, 255, 0.40));

                        /* 12 Regular */
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 18px; /* 150% */
                    }
                }
            }

        }
    }
}

</style>
