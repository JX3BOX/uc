<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-share-list">
            <div v-for="(item, i) in list"  :key="i + item" class="u-share-item">
                <a class="u-face" :href="`/face/${item.id}`" target="_blank">
                    <i class="u-img">
                        <img class="u-pic" :src="showThumb(item)" loading="lazy" />
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
import { __imgPath } from "@/utils/config";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { getFaceList } from "@/service/author/next.js";
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
            getFaceList(this.params)
                .then((res) => {
                    this.list = res.data.data.list;
                    this.total = res.data.data.page.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        showThumb: function (item) {
            let url=item.images?.[0] || __imgPath + "image/face/null2.png";
            return getThumbnail(url,360);
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
