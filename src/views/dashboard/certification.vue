<template>
    <uc class="m-dashboard-frame m-dashboard-skin" icon="el-icon-magic-stick" :title="$t('dashboard.treasure.title')" :tab-list="tabList">
        <div class="m-cert-list">
            <ContentSkeleton v-if="loading" variant="cards" :rows="per" :columns="4" />
            <el-row v-else-if="list.length" :gutter="32">
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
                            <div class="u-tip">{{ $t("dashboard.certification.team") }}：{{ item.team_certificate.team_name }}</div>
                            <template v-if="isSuperstar(item)">
                                <div class="u-tip">
                                    {{ $t("dashboard.role.school") }}：{{ tianTuanCertificateCode[item.team_certificate.sort_no] }}
                                </div>
                                <div class="u-tip">{{ $t("dashboard.certification.leader") }}：{{ item.team_certificate.leader }}</div>
                                <div class="u-tip">{{ $t("dashboard.certification.clearTime") }}：{{ item.team_certificate.time }}</div>
                            </template>
                            <template v-else>
                                <div class="u-tip">{{ $t("dashboard.role.server") }}：{{ item.team_certificate.team_server }}</div>
                                <div class="u-tip">{{ $t("dashboard.certification.leader") }}：{{ item.team_certificate.leader }}</div>
                                <div class="u-tip">{{ $t("dashboard.common.obtainedAt") }}：{{ item.team_certificate.awardtime }}</div>
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
            <el-empty v-else :description="emptyText"></el-empty>

            <el-pagination
                v-if="!loading && total"
                class="m-cert-pages"
                background
                @current-change="handleCurrentChange"
                :page-size="per"
                :hide-on-single-page="true"
                v-model:current-page="page"
                layout="total, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import tabsData from "@/assets/data/dashboard/tabs.json";
const { antiqueTab } = tabsData;
import { teamCertificationRecordList } from "@/service/dashboard/treasure";
import { __cdn } from "@/utils/config";
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
            loading: true,
            loadError: false,
            tianTuanCertificateCode,
        };
    },
    computed: {
        emptyText() {
            return this.loadError ? this.$t("dashboard.certification.loadFailed") : this.$t("dashboard.certification.empty");
        },
    },
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
            this.loading = true;
            this.loadError = false;
            teamCertificationRecordList({
                index: this.page,
                pageSize: this.per,
            })
                .then((res) => {
                    const data = res.data.data || {};
                    this.total = data.page?.total || 0;
                    this.list = data.list || [];
                })
                .catch(() => {
                    this.total = 0;
                    this.list = [];
                    this.loadError = true;
                })
                .finally(() => {
                    this.loading = false;
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
