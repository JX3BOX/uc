<template>
    <div class="m-post" v-loading="loading">
        <!-- 列表 -->
        <div v-if="list && list.length" class="m-topic-list">
            <topic-item v-for="(item, i) in list" :item="item" :key="i + item" class="u-item">

            </topic-item>
        </div>
        <div class="m-empty" v-else>
            <img src="https://cdn.jx3box.com/design/miniprogram/empty.png" width="80%" />
        </div>
    </div>
</template>

<script>
import { getLink, showBanner } from "@jx3box/jx3box-common/js/utils";
import dayjs from "dayjs";
import { __cdn } from "@/utils/config";
import { random } from "lodash";
import { getTopicList } from "@/service/author/author.js";
import TopicItem from "@/components/author/mobile/Pannel/TopicItem.vue";
export default {
    components: { TopicItem },
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
        params: function () {
            return {
                user_id: this.uid,
                index: this.page,
                pageSize: this.per,
            };
        },
        uid: function () {
            return ~~this.$store.state.uid;
        },
    },
    methods: {
        loadData: function () {
            if (!this.uid) return;
            this.loading = true;
            getTopicList(this.params)
                .then((res) => {
                    this.list = this.list.concat(res.data.data.list);
                    this.total = res.data.data.page.pageTotal;
                })
                .finally(() => {
                    this.loading = false;
                });
        },

        postLink: function (id) {
            return getLink("community", id);
        },
        dateFormat: function (val) {
            return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
        },
        getBanner: function (item) {
            if (item.banner_img) {
                return showBanner(item.banner_img);
            } else {
                // 从1-39中随机选一个
                const randomNum = random(1, 39);
                return __cdn + `design/random_cover/${randomNum}.jpg`;
            }
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
.m-topic-list{
    display: flex;
    gap: 20px;
    flex-direction: column;

}
</style>
