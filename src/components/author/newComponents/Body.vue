<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-share-list">
            <div v-for="(item, i) in list"  :key="i + item" class="u-share-item">
                <a class="u-face" :href="`/body/${item.id}`" target="_blank">
                    <i class="u-img">
                        <img class="u-pic" :src="showThumb(item)" loading="lazy" style="object-fit: cover;" />
                    </i>
                </a>
                <i class="u-star-mark" v-if="!!item.star">STAR</i>
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
            :current-page.sync="pageIndex"
            :page-size="pageSize"
        >
        </el-pagination>
    </div>
</template>

<script>
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { getBodyList } from "@/service/author/next.js";
export default {
    props: [],
    data: function() {
        return {
            loading: false,
            list: [],
            total: 1,
            pageSize:12,
            pageIndex: 1
        };
    },
    computed : {
        params : function (){
            return {
                user_id: this.uid,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            }
        },
        uid : function (){
            return ~~this.$store.state.uid
        },
    },
    methods: {
        loadData: function() {
            if (!this.uid) {
                return;
            }
            this.loading = true;
            getBodyList(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showThumb: function (item) {
            let url=item.images?.[0];
            return url ? getThumbnail(url,360) : require("@/assets/img/author/body_null.png");
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
<style lang="less">
@import "~@/assets/css/author/newCss/face.less";
</style>
