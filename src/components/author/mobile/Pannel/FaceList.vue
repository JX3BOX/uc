<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-face-list">
            <div v-for="(item, i) in list"  :key="i + item" class="m-face-item">
                <a :href="`/face/${item.id}`">
                    <div class="u-item_img" >
                        <img class="u-pic" :src="showThumb(item)"  />

                        <div class="u-face-body">
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
import { __imgPath } from "@/utils/config";
import { getThumbnail } from "@jx3box/jx3box-common/js/utils";
import { getFaceList } from "@/service/author/next.js";
import { bodyMap } from "@jx3box/jx3box-facedat/assets/data/index.json";
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
                    this.list = this.list.concat(res.data.data.list || []);
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
.m-face-list{
    display: flex;
    flex-wrap: wrap;
    gap: 13px;
    justify-content: space-between;
    .m-face-item{
        max-width: calc((100% - 39px) /3);
        border-radius: 4px;
        border: 0.5px solid var(--black-5, rgba(255, 255, 255, 0.10));
        .u-item_img {
            .r(4px);
            border-radius: 4px;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.80) 100%);
            overflow: hidden;
            position: relative;
            height: 100%;
            width: 100%;
            max-height: 103px;
            max-width: 103px;

            .u-pic{
                width: 100%;
                height: 100%;
            }
            .u-face-body{
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
