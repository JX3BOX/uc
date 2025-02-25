<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-emotions-list">
            <div v-for="(item, i) in list"  :key="i + item" class="u-list">
                <a class="u-pic" :href="postLink(item.id)" target="_blank">
                    <img :src="showEmotion(item.url)" :alt="item.desc" :key="item.url" class="u-img"/>
                    <div class="u-date">
                        <time >{{ timeago(item.updated_at) }}</time>
                    </div>
                </a>
            </div>
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
import { getLink, getThumbnail, resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import dayjs from 'dayjs'
import { getUserEmotions } from "@/service/author/cms.js";
export default {
    props: [],
    data: function() {
        return {
            loading: false,
            list: [],
            total: 1,
            per : 25,
            page : 1
        };
    },
    computed : {
        params : function (){
            return {
                user_id: this.uid,
                page: this.page,
                per: this.per,
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
            getUserEmotions(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function(id) {
            return getLink("emotion", id);
        },
        checkImageExt: function () {
            let ext = this.emotion?.url?.split(".").pop().toLowerCase();
            if (ext && ext != "gif") {
                this.types.push(ext, "gif");
                this.ext = ext;
            }
        },
        checkIsGif: function (url) {
            return url?.split(".").pop().toLowerCase() == "gif";
        },
        showEmotion: function (url) {
            if (this.mode == "single") {
                return resolveImagePath(url);
            } else {
                if (this.checkIsGif(url)) {
                    return resolveImagePath(url);
                } else {
                    return getThumbnail(url, "emotion_thumbnail");
                }
            }
        },
        timeago(date){
            let result="";
            let minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
            let hour = minute * 60;
            let day = hour * 24;
            let week = day * 7;
            let halfamonth = day * 15;
            let month = day * 30;
            let now = new Date().getTime();   //获取当前时间毫秒
            let diffValue = now - new Date(date).getTime();//时间差

            if(diffValue < 0){
                return;
            }
            var minC = diffValue/minute;  //计算时间差的分，时，天，周，月
            var hourC = diffValue/hour;
            var dayC = diffValue/day;
            var weekC = diffValue/week;
            var monthC = diffValue/month;
            if(monthC >= 1 && monthC <= 12){
                result = " " + parseInt(monthC) + "月前"
            }else if(weekC >= 1 && weekC <= 3){
                result = " " + parseInt(weekC) + "周前"
            }else if(dayC >= 1 && dayC <= 6){
                result = " " + parseInt(dayC) + "天前"
            }else if(hourC >= 1 && hourC <= 23){
                result = " " + parseInt(hourC) + "小时前"
            }else if(minC >= 1 && minC <= 59){
                result =" " + parseInt(minC) + "分钟前"
            }else if(diffValue >= 0 && diffValue <= minute){
                result = "刚刚"
            }else {
                let datetime = new Date();
                datetime.setTime(new Date(date));
                let Nyear = datetime.getFullYear();
                let Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
                let Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
                let Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
                let Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
                let Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
                result = Nyear + "-" + Nmonth + "-" + Ndate
            }
            return result;
        }
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
