<template>
    <div class="m-moment-item" >
        <div class="u-desc">
            <span class="u-time">{{time}}</span>
            <span class="u-text">发布了{{labelType}}</span>
        </div>
        <div class="m-content">
            <el-image :src="banner" class="u-banner" fit="cover" />


            <div class="m-right">
                <div class="u-title">
                    {{item.title}}
                </div>
                <div class="u-time">
                    {{date}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getLink, showBanner } from "@jx3box/jx3box-common/js/utils";
import dayjs from 'dayjs'
import { getTopicReplyList } from "@/service/author/author.js";
import { __appType, __gameType, __postType, __wikiType } from "@jx3box/jx3box-common/data/jx3box.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import fb from "@/post/fb.vue";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
export default {
    props: ["item"],

    computed: {
        uid: function () {
            return ~~this.$store.state.uid;
        },
        time: function(){
            return dayjs(this.item.updated_at).format("HH:mm");
        },
        date:function(){
            return dayjs(this.item.updated_at).format("YYYY-MM-DD");
        },
        banner(){

            if (this.item.banner) {
                return showBanner(this.item.banner);
            }

            const subType = this.item.post_subtype;
            switch (this.item.post_type) {
                case "macro":
                case "pvp":
                case "bps":
                    const xfFormat = xfmap[subType]?.id || "0";
                    return __imgPath + `image/bps_thumbnail/${xfFormat}.png`;
                case "fb":
                    const fbFormat = fb[subType] || "null";
                    return __imgPath + `image/fb_map_thumbnail/${fbFormat}.png`;
                case "tools":
                    return __imgPath + `image/banner/tool${subType}.png`;
                case "community":
                    // 随机数0-50
                    return showBanner(`https://cdn.jx3box.com/design/random_cover/${Math.floor(Math.random() * 50)}.jpg`);
                default:
                    return showBanner(`https://cdn.jx3box.com/design/random_cover/${Math.floor(Math.random() * 50)}.jpg`);
            }
        },
        labelType() {
            let types = Object.assign({
                bbs:"帖子"
            }, __postType, __wikiType, __appType, __gameType);
            const type = this.item.post_type;
            return types[type] || type;
        },
    },
    methods: {

    },
    watch: {

    },
};
</script>


<style lang="less">
.m-moment-item{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    align-self: stretch;
    width: 100%;

    .u-desc{
        display: flex;
        align-items: center;
        gap: 10px;

        color: var(--black-80, rgba(255, 255, 255, 0.80));

        /* 12 Regular */
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px; /* 150% */
    }

    .m-content{
        display: flex;
        padding: 12px;
        align-items: flex-start;
        gap: 12px;
        align-self: stretch;

        border-radius: 8px;
        background: var(--black-5, rgba(28, 28, 28, 0.05));

        .u-banner{
            border-radius: var(--4, 4px);
            width: 126px;
            height: 64.145px;
            overflow: hidden;
        }

        .m-right{
            display: flex;
            padding: 0 0;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            flex: 1 0 0;
            align-self: stretch;
            .u-title{
                color: var(--black-40, rgba(28, 28, 28, 0.40));

                // 最多两行超出省略号
                max-height: 40px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;


                /* 14 Regular */
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px; /* 142.857% */
            }

            .u-time{
                color: var(--black-40, rgba(28, 28, 28, 0.40));

                /* 12 Regular */
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px; /* 150% */
            }
        }
    }
}
</style>
