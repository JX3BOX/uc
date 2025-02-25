<template>
    <uc class="m-dashboard-frame m-dashboard-skin" icon="el-icon-magic-stick" title="魔盒藏品" :tab-list="tabList">
        <div class="m-cert-list">
            <el-empty v-if="!list.length" description="您还未获得过证书~"></el-empty>
            <el-row :gutter="32">
                <el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="8" :xl="6">
                    <a
                        class="m-cert-item"
                        :href="getCertLink(item)"
                        target="_blank"
                        :class="{
                            tt_item: isSuperstar(item),
                        }"
                    >
                        <!-- 门派天团 -->
                        <div
                            v-if="isSuperstar(item)"
                            class="u-img"
                            :style="{
                                backgroundImage: `url(${require('@/assets/img/dashboard/certification/tt.png')})`,
                            }"
                        ></div>
                        <!-- 百强证书 -->
                        <div
                            v-else
                            class="u-img"
                            :style="{
                                backgroundImage: `url(${getImgPath(item.team_certificate.rank_id)})`,
                            }"
                        ></div>
                        <div class="m-info">
                            <div class="u-title">{{ item.team_certificate.rank_name }}</div>
                            <div class="u-tip">团队：{{ item.team_certificate.team_name }}</div>
                            <template v-if="isSuperstar(item)">
                                <div class="u-tip">
                                    门派：{{ tianTuanCertificateCode[item.team_certificate.sort_no] }}
                                </div>
                                <div class="u-tip">团长：{{ item.team_certificate.leader }}</div>
                                <div class="u-tip">通关时间：{{ item.team_certificate.time }}</div>
                            </template>
                            <template v-else>
                                <div class="u-tip">服务器：{{ item.team_certificate.team_server }}</div>
                                <div class="u-tip">团长：{{ item.team_certificate.leader }}</div>
                                <div class="u-tip">获得时间：{{ item.team_certificate.awardtime }}</div>
                            </template>
                        </div>
                        <!-- 门派天团 -->
                        <img
                            class="u-icon"
                            v-if="item.team_certificate.sort_no > 100"
                            :src="showSchoolIcon(tianTuanCertificateCode[item.team_certificate.sort_no])"
                            alt=""
                        />
                        <!-- 百强证书 -->
                        <img class="u-icon" v-else src="@/assets/img/dashboard/cert/CI_icon.svg" alt="" />
                    </a>
                </el-col>
            </el-row>

            <el-pagination
                class="m-cert-pages"
                background
                @current-change="handleCurrentChange"
                :page-size="per"
                :hide-on-single-page="true"
                :current-page.sync="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { antiqueTab } from "@/assets/data/dashboard/tabs.json";
import { teamCertificationRecordList } from "@/service/dashboard/treasure";
import User from "@jx3box/jx3box-common/js/user";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import tianTuanCertificateCode from "@/assets/data/dashboard/tianTuan_certificate_code.json";
import { showSchoolIcon } from "@jx3box/jx3box-common/js/utils";

export default {
    name: "treasure",
    components: {
        uc,
    },
    props: [],
    data: function () {
        return {
            tabList: antiqueTab,

            page: 1,
            per: 12,
            total: 0,
            list: [],
            tianTuanCertificateCode,
        };
    },
    computed: {},
    methods: {
        showSchoolIcon,
        load() {
            const screenWidth = window.innerWidth;
            if (screenWidth < 1920) {
                this.per = 10;
            }
            this.getCertificateList();
        },
        getCertificateList() {
            teamCertificationRecordList({
                index: this.page,
                pageSize: this.per,
            }).then((res) => {
                this.total = res.data.data.page.total;
                this.list = res.data.data.list;
            });
        },
        handleCurrentChange(current) {
            this.page = current;
            this.getCertificateList();
        },
        goDetail(url) {
            window.location.href = url;
        },
        getImgPath(code) {
            let imgUrl = "";
            imgUrl = `design/certification/CertCover_jdt${code < 10 ? "0" + code : code}.png`;
            return __cdn + imgUrl;
        },
        getCertLink(item) {
            if (item.team_certificate.sort_no > 100) {
                // 门派天团
                return `/author/${item.user_id}/groupCertificate/${item.id}`;
            } else {
                // 百强证书
                return `/author/${item.user_id}/certificate/${item.id}`;
            }
        },
        isSuperstar(item) {
            return item.team_certificate.sort_no > 100 ? true : false;
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
