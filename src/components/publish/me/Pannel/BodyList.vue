<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-body-list">
            <div v-for="(item, i) in list"  :key="i + item" class="m-body-item">
                <a class="u-face" :href="`/body/${item?.id}`" target="_blank">
                    <div class="u-item_img">
                        <img class="u-pic" :src="showThumb(item)" loading="lazy"  style="object-fit: cover" />
                        <div class="u-body-body">
                            {{bodyMap[item.body_type]?.label || '未知'}}
                        </div>
                        <div class="u-item_tag">
                            <div class="u-tag_item green" v-if="item.is_new_face"></div>
                            <div class="u-tag_item mint" v-else></div>
                            <div class="u-tag_item new" v-if="!!item.is_unlimited"></div>
                            <div class="u-tag_item purple" v-if="!!item.star"></div>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div class="m-empty" v-else>
            <img src="https://cdn.jx3box.com/design/miniprogram/empty.png" width="80%" />
        </div>
    </div>
</template>

<script>
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { bodyMap } from "@jx3box/jx3box-facedat/assets/data/index.json";
import { getBodyList } from "@/service/publish/body";
export default {
    props: [],
    data: function() {
        return {
            loading: false,
            list: [],
            total: 1,
            pageSize:12,
            pageIndex: 1,
            bodyMap: bodyMap
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
    },
    methods: {
        loadData: function() {
            this.loading = true;
            getBodyList(this.params)
                .then((res) => {
                    this.list = this.list.concat(res.data.data.list||[]);
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
        loadMore(){
            if (this.loading) return;
            if (document.documentElement.scrollTop + window.innerHeight + 100 >= document.documentElement.scrollHeight) {
                if (this.list.length < this.total) {
                    this.pageIndex++;
                }
            }
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
    mounted() {
        window.addEventListener("scroll", this.loadMore);
    },
    destroyed() {
        window.removeEventListener("scroll", this.loadMore);
    }

};
</script>
<style lang="less">

.m-body-list{
    display: flex;
    flex-wrap: wrap;
    gap: 13px;
    justify-content: space-between;
    .m-body-item{
        max-width: calc((100% - 39px) /3);
        border-radius: 4px;
        border: 0.5px solid var(--black-5, rgba(255, 255, 255, 0.10));
        .u-item_img {
            .r(4px);
            overflow: hidden;
            position: relative;
            height: 100%;
            width: 100%;
            max-height: 160px;
            max-width: 103px;
            border-radius: 4px;
            border: 0.5px solid var(--black-5, rgba(255, 255, 255, 0.10));

            .u-pic{
                width: 100%;
                height: 100%;
            }

            .u-body-body{
                position: absolute;
                bottom: 10px;
                left: 4px;
                color: var(--primary-white, #FFF);

                /* 10 Regular */
                font-size: 10px;
                font-style: normal;
                font-weight: 400;
                line-height: 15px; /* 150% */
            }


            .u-item_tag {
                .flex;
                gap: 4px;
                padding: 4px 4px;
                box-sizing: border-box;
                position: absolute;
                bottom: 0px;

                .u-tag_item {
                    .size(12px, 2px);
                    border-radius: 100px;

                    &.green {
                        background: #34c759;
                    }

                    &.mint {
                        background: #23abe5;
                    }

                    &.purple {
                        background: #af52de;
                    }

                    &.new {
                        background: #ff72af;
                    }
                }
            }
        }



    }
}


</style>
