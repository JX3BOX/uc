<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-reply-list">
                <div v-for="(item, i) in list" :key="i + item" class="m-reply-item" @click="toDetail(item)">
                    <div class="m-ext-info">
                        <div class="u-tag">
                            {{ item.topic?.category }}
                        </div>
                        <time class="u-time">{{ dateFormat(item.created_at) }}</time>
                    </div>
                   <div class="m-content-card">
                       <!-- 标题 -->
                       <div class="u-content">
                           <!-- 标题文字 -->
                           {{cleanContent(item.content)}}
                       </div>

                       <!-- 作者 -->
                       <div class="u-reply-title">
                            {{item.topic?.title}}
                       </div>
                   </div>
            </div>
        </div>
        <div class="m-empty" v-else>
            <img src="https://cdn.jx3box.com/design/miniprogram/empty.png" width="80%" />
        </div>
    </div>
</template>

<script>
import { getLink } from "@jx3box/jx3box-common/js/utils";
import dayjs from 'dayjs'
import { getTopicReplyList } from "@/service/author/author.js";
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
        uid: function () {
            return ~~this.$store.state.uid;
        },
        params: function () {
            return {
                user_id: this.uid,
                index: this.page,
                pageSize: this.per,
            };
        },
    },
    methods:{
        toDetail(item){
            const wx = require('weixin-js-sdk');
            wx.miniProgram?.navigateTo({url: `/pages/publish/detail/detail?id=${item.topic_id}`})
        },
        loadData: function () {
            if (!this.uid) return;
            this.loading = true;
            getTopicReplyList(this.params)
                .then((res) => {
                    this.list = this.list.concat(res.data.data.list||[]);
                    this.total = res.data.data.page.pageTotal;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function (item) {
            const floor = item.floor;
            const communityPer = 10;
            const page = Math.ceil((floor - 1) / communityPer);
            return getLink("community", item.topic_id) + `?floor=${floor}&page=${page}`;
        },
        dateFormat: function (val) {
            return dayjs(val).format("YYYY-M-DD HH:mm:ss");
        },
        cleanContent(content){
            return content?.replace(/<img[^>]*>/g, "#图片")?.replace(/<\/?[^>]+(>|$)/g, "");
        },
        loadMore(){
            if (this.loading) return;
            if (document.documentElement.scrollTop + window.innerHeight + 100 >= document.documentElement.scrollHeight) {
                if (this.list.length < this.total) {
                    this.page++;
                }
            }
        }
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
    mounted() {
        window.addEventListener("scroll", this.loadMore);
    },
    destroyed() {
        window.removeEventListener("scroll", this.loadMore);
    }
};
</script>


<style lang="less">
.m-reply-list{
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    .m-reply-item{
        display: flex;
        flex-direction: column;
        gap: 8px;
        .m-ext-info{
            display: flex;
            justify-content: space-between;
            align-items: center;
            align-self: stretch;

            .u-tag{
                display: flex;
                padding: 3px 16px;
                align-items: center;
                gap: 10px;

                border-radius: 8px;
                border: 1px solid rgba(40, 40, 40, 0.05);
                background: var(--primary-brand-4, #282828);

                color: var(--black-40, rgba(255, 255, 255, 0.40));

                /* 12 Bold */
                font-size: 12px;
                font-style: normal;
                font-weight: 700;
                line-height: 18px; /* 150% */
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

        .m-content-card{
            display: flex;
            padding: 12px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;

            border-radius: var(--8, 8px);
            background: var(--black-5, rgba(255, 255, 255, 0.10));

            .u-content{
                color: var(--black-80, rgba(255, 255, 255, 0.80));

                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px;

                padding: 8px;
                display: flex;
                flex-direction: column;
                width: 100%;
                box-sizing: border-box;

                border-radius: 8px;
                background: var(--white-80, rgba(28, 28, 28, 0.80));

                // 超出换行
                overflow: hidden;
                max-width: 100%;
                // 最多28个中文字符



            }

            .u-reply-title{
                color: var(--black-20, rgba(255, 255, 255, 0.20));

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
