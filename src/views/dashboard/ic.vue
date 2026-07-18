<template>
    <div class="m-credit m-ic">
        <h2 class="u-title"><i class="el-icon-coin"></i> {{ $t("dashboard.invitation.title") }}</h2>
        <div class="m-credit-table m-packet-table">
            <ContentSkeleton v-if="loading" variant="table" :rows="6" :columns="3" />
            <el-tabs v-else v-model="tab" type="border-card">
                <el-tab-pane :label="$t('dashboard.invitation.registrationCode')" name="first" lazy>
                    <div class="m-tip-box">
                        <el-button class="u-btn" type="primary" @click="createCode"> {{ $t("dashboard.invitation.generate") }} </el-button>
                        <el-alert class="m-ic-tip" :title="$t('dashboard.invitation.rules')" type="warning" show-icon>
                            <slot name="description"><div v-html="rules"></div> </slot>
                        </el-alert>
                    </div>

                    <div class="m-packet-table" v-if="list && list.length">
                        <table class="m-ic-in-list m-packet-in-list">
                            <thead>
                                <tr>
                                    <th>{{ $t("dashboard.invitation.code") }}</th>
                                    <th>{{ $t("dashboard.common.status") }}</th>
                                    <th>{{ $t("dashboard.invitation.generatedAt") }}</th>
                                </tr>
                            </thead>
                            <tr v-for="(item, i) in list" :key="i">
                                <td>
                                    {{ item.code }}
                                    <i
                                        class="u-copy el-icon-document-copy"
                                        @click.stop="onCopy(item.code)"
                                    ></i>
                                </td>
                                <td>
                                    <el-tag :type="item.status ? 'success' : 'info'">{{
                                        item.status ? $t("dashboard.invitation.unused") : $t("dashboard.invitation.used")
                                    }}</el-tag>
                                </td>
                                <td>{{ formatDate(item.created_at) }}</td>
                            </tr>
                        </table>
                    </div>
                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        :title="$t('dashboard.common.noItems')"
                        type="info"
                        center
                        show-icon
                    ></el-alert>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { showTime } from "@jx3box/jx3box-common/js/moment";
import { genInvitation, getMyInvitation } from "@/service/dashboard/ic.js";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";
export default {
    name: "Ic",
    props: [],
    data: function () {
        return {
            // 记录列表
            loading: false,
            tab: "first",
            list: [],
            rules: ``,
        };
    },
    methods: {
        // 初始化
        init: function () {
            this.loadData();
            this.loadAc();
        },

        // 生成邀请码
        createCode() {
            genInvitation().then((res) => {
                this.$message.success(this.$t("dashboard.invitation.generateSuccess"));
                this.loadData();
            });
        },

        // 加载列表数据
        loadData: function () {
            this.loading = true;
            getMyInvitation()
                .then((res) => {
                    this.list = res.data.data || [];
                })
                .catch(() => {
                    this.list = [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        // 获取生成邀请码公告内容
        loadAc: function () {
            getBreadcrumb("user_invitation_register").then((data) => {
                this.rules = data;
            });
        },
        // 创建事件filters
        formatDate: function (val) {
            return showTime(val);
        },
        // 复制成功
        onCopy: function (code) {
            navigator.clipboard.writeText(code).then(() => {
                this.$message.success(this.$t("dashboard.common.copySuccess"));
            });
        },
    },
    created: function () {
        this.init();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/packet.less";
@import "~@/assets/css/dashboard/ic.less";
</style>
