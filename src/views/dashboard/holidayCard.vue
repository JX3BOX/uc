<template>
    <uc class="m-dashboard-frame m-dashboard-skin" icon="el-icon-magic-stick" title="魔盒藏品" :tab-list="tabList">
        <div class="m-cert-list">
            <el-empty v-if="!list.length" description="您还未获得过贺卡~"></el-empty>
            <el-row :gutter="32" v-else>
                <el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="8" :xl="6">
                    <a class="m-cert-item m-feast-item" :href="getCertLink(item)" target="_blank">
                        <div class="u-img u-card"></div>
                        <div class="m-info">
                            <div class="u-title">{{ item.event_name }}</div>
                            <div class="u-tip">{{ item.event_wish }}</div>
                            <div class="u-tip">获得时间：{{ formatTime(item.created_at) }}</div>
                        </div>
                        <img class="u-icon" src="@/assets/img/dashboard/holidayCard/feast_icon.svg" />
                    </a>
                </el-col>
            </el-row>
        </div>

        <el-pagination
            class="m-pagination"
            background
            :hide-on-single-page="true"
            :page-size="pageSize"
            :current-page.sync="pageIndex"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="currentChange"
        />
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { antiqueTab } from "@/assets/data/dashboard/tabs.json";
import { getHolidayCard } from "@/service/dashboard/treasure";

export default {
    name: "treasure",
    components: {
        uc,
    },
    props: [],
    data: function () {
        return {
            tabList: antiqueTab,
            list: [],

            pageSize: 10,
            pageIndex: 1,
            total: 0,
        };
    },
    computed: {},
    methods: {
        load() {
            this.getCertificateList();
        },
        getCertificateList() {
            const params = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            };
            getHolidayCard(params).then((res) => {
                this.list = res.data.data.list;
                this.total = res.data.data.page.total;
            });
        },
        formatTime(time) {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
        },
        getCertLink(item) {
            return `/author/${item.user_id}/holiday-card/${item.event_id}?id=${item.id}`;
        },
        currentChange(val) {
            this.pageIndex = val;
            this.getCertificateList();
        },
    },
    mounted: function () {
        this.load();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/certification.less";
</style>
