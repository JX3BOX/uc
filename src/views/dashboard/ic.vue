<template>
    <div class="m-credit m-ic">
        <h2 class="u-title"><i class="el-icon-coin"></i> 我的盒码</h2>
        <div class="m-credit-table m-packet-table" v-loading="loading">
            <el-tabs v-model="tab" type="border-card">
                <el-tab-pane label="注册邀请码" name="first" lazy>
                    <div class="m-tip-box">
                        <el-button class="u-btn" type="primary" @click="createCode"> 生成邀请码 </el-button>
                        <el-alert class="m-ic-tip" title="邀请码生成规则" type="warning" show-icon>
                            <slot name="description"><div v-html="rules"></div> </slot>
                        </el-alert>
                    </div>

                    <div class="m-packet-table" v-if="list && list.length">
                        <table class="m-ic-in-list m-packet-in-list">
                            <tr>
                                <th>邀请码</th>
                                <th>状态</th>
                                <th>生成时间</th>
                            </tr>
                            <tr v-for="(item, i) in list" :key="i">
                                <td>
                                    {{ item.code }}
                                    <i
                                        class="u-copy el-icon-document-copy"
                                        v-clipboard:copy="item.code"
                                        v-clipboard:success="onCopy"
                                    ></i>
                                </td>
                                <td>
                                    <el-tag :type="item.status ? 'success' : 'info'" size="small">{{
                                        item.status ? "未使用" : "已使用"
                                    }}</el-tag>
                                </td>
                                <td>{{ formatDate(item.created_at) }}</td>
                            </tr>
                        </table>
                    </div>
                    <el-alert
                        v-else
                        class="m-credit-null m-packet-null"
                        title="没有找到相关条目"
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
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc.js";
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
                this.$message.success("生成邀请码成功");
                this.loadData();
            });
        },

        // 加载列表数据
        loadData: function () {
            this.loading = true;
            getMyInvitation()
                .then((res) => {
                    this.list = res.data.data;
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
        onCopy: function () {
            this.$message.success("复制成功");
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
