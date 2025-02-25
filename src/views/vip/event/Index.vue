<template>
    <div class="m-vip-event-index">
        <div class="m-vip-event-index-list">
            <el-row :gutter="20" class="u-list">
                <el-col :span="6" v-for="(item, i) in list" :key="i">
                    <router-link :to="item.path" class="u-item">
                        <div class="u-img">
                            <img :src="item.img | showBanner" />
                        </div>
                        <div class="u-desc">{{ item.desc }}</div>
                    </router-link>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { getThumbnail,resolveImagePath } from "@jx3box/jx3box-common/js/utils";
export default {
    name: "Index",
    props: [],
    data: function() {
        return {
            list: [
                {
                    path: "rank-2",
                    desc: "第二届秘境百强榜活动会员奖励",
                    img:
                        "https://oss.jx3box.com/upload/post/2021/6/28/2699633.png",
                },
                {
                    path: "rank-1-sponsors",
                    desc: "第一届竞速活动赞助单位领取1年PRO会员",
                    img:
                        "https://oss.jx3box.com/upload/post/2021/3/20/3481617.png",
                },
                // {
                //     path: "vizir-500",
                //     desc: "网站前500名注册用户免费领取90天PRO会员",
                //     img:
                //         "https://oss.jx3box.com/upload/post/2021/3/20/84523.png",
                // },
                {
                    path: "kol-1",
                    desc: "KOL铭牌领取",
                    img:
                        "https://oss.jx3box.com/upload/post/2021/3/20/8189870.png",
                },
            ],
        };
    },
    computed: {},
    methods: {},
    filters: {
        showBanner: function(val) {
            return resolveImagePath(val)
        },
    },
    mounted: function() {},
};
</script>
