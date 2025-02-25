<template>
    <div class="m-post" v-loading="loading">
        <el-timeline class="m-post-list" v-if="list && list.length">
            <el-timeline-item
                v-for="(item, i) in list"
                :key="i"
                :timestamp="item.updated | dateFormat"
                placement="top"
            >
                <h4 class="u-type">{{item.type | showTypeLabel}}</h4>
                <p>
                    <a
                        :href="postLink(item.id)"
                        class="u-title"
                        target="_blank"
                        >{{ item.title || "无标题" }}</a
                    >
                </p>
            </el-timeline-item>
        </el-timeline>
        <el-alert v-else title="没有找到相关条目" type="info" show-icon>
        </el-alert>

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
import { getLink } from "@jx3box/jx3box-common/js/utils";
import dateFormat from "@/utils/dateFormat";
import { getPlans } from "@/service/author/helper.js";
const types = {
    "1" : '物品清单',
    "2" : "装备清单"
}
export default {
    props: [],
    data: function() {
        return {
            loading: false,
            list: [],
            total: 1,
            per : 10,
            page : 1,

            types
        };
    },
    computed : {
        params : function (){
            return {
                user_id: this.uid,
                page: this.page,
                limit: this.per
            }
        },
        uid : function (){
            return ~~this.$store.state.uid
        },
        userdata: function() {
            return this.$store.state.userdata;
        },
    },
    methods: {
        loadData: function() {
            if (!this.uid) return;
            this.loading = true;
            getPlans(this.params)
                .then((res) => {
                    this.list = res.data.data.data;
                    this.total = res.data.data.total;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        postLink: function(id) {
            return getLink("item_plan", id);
        },
    },
    filters: {
        dateFormat: function(val) {
            return dateFormat(new Date(~~val*1000));
        },
        showTypeLabel : function (val){
            return types[val]
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
