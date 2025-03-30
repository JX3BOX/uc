<template>
    <div class="m-moment-box" v-loading="loading">

        <div v-if="list && list.length" class="m-moment-list">
            <div class="m-month-group" v-for="(monthGroup) in groupList" :key="monthGroup.month">
                <div class="u-month-title">
                    {{monthDict[monthGroup.month]}}月
                    <div class="u-slider"></div>
                </div>
                <div class="m-day-group" v-for="dayGroup in monthGroup.list" :key="dayGroup.day">
                    <div class="u-day-title">{{dayGroup.day}}</div>

                    <div class="m-list">
                        <MomentItem v-for="item in dayGroup.list" :key="item.id" :item="item"  />
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
import { authorUpdateList, getTopicReplyList } from "@/service/author/author.js";
import MomentItem from "@/components/author/mobile/Pannel/MomentItem.vue";
import { groupBy } from "lodash";
export default {
    name:"BoxMoment",
    components: { MomentItem },
    props: [],
    data: function () {
        return {
            loading: false,
            list: [],
            total: 1,
            per: 16,
            page: 1,

            monthDict: [
                "壹","贰","叁","肆","伍","陆","柒","捌","玖","拾","拾壹","拾贰"
            ]
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
        groupList(){
            // this.list format month format
            const list = groupBy(this.list, (item) => {
                return dayjs(item.updated_at).format('YYYY-MM');
            })
            const res= [];

            for (let i in list){

                const tmp = { month: dayjs(i).month(),formatMonth: i, list: [] }

                const dayList = groupBy(list[i], (item) => {
                    return dayjs(item.updated_at).day();
                })

                for (let j in dayList){

                    const innerList = Object.values(dayList[j])
                    // 排序一下
                    innerList.sort((a,b)=>{
                        return dayjs(b.updated_at).unix() - dayjs(a.updated_at).unix()
                    })

                    tmp.list.push({ day: ~~j+1, list: innerList })
                }

                tmp.list.sort((a,b)=>{
                    return b.day - a.day
                })
                res.push(tmp)
            }

            // tmp 从大到小
            res.sort((a,b)=>{
                return dayjs(b.formatMonth).unix() - dayjs(a.formatMonth).unix()
            })

            return res
        }
    },
    methods: {
        loadData: function () {
            if (!this.uid) return;
            this.loading = true;
            authorUpdateList(this.uid,this.params)
                .then((res) => {
                    // 月份分组
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
.m-moment-box{
    display: flex;
    padding: 16px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    width: 100%;
    box-sizing: border-box;

    .m-moment-list{
        display: flex;
        align-items: flex-start;
        align-self: stretch;
        flex-direction: column;
        gap: 20px;
        width: 100%;

        .m-month-group{
            display: flex;
            align-items: flex-start;
            align-self: stretch;
            flex-direction: column;
            gap: 20px;
            width: calc(100% - 10px);

            .u-month-title{
                display: flex;
                width: 60px;
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;

                color: var(--black-100, #FFF);
                text-align: center;

                /* 14 Bold */
                font-size: 14px;
                font-style: normal;
                font-weight: 700;
                line-height: 20px; /* 142.857% */

                .u-slider{
                    height: 2px;
                    width: 60px;
                    background: var(--black-100, #FFF);;
                }
            }
            .m-day-group{
                display: flex;
                align-items: flex-start;
                gap: 20px;
                width: 100%;
                .u-day-title{
                    color: var(--black-40, rgba(255, 255, 255, 0.40));
                    /* 14 Bold */
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: 20px; /* 142.857% */
                }

                .m-list{
                    flex: 1;
                    max-width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
            }
        }

    }




}
</style>
