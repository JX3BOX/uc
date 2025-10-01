<template>
    <div class="m-qqbot m-item">
        <span class="u-profile-item">
            <img class="u-qqbot" svg-inline :src="icon('qqbot')" />
            <span class="u-status"> QQ机器人 </span>
        </span>
        <el-button type="primary" @click="bind" size="large" v-if="!checkStatus"> 立即绑定 </el-button>
        <el-button v-else @click="unbind" size="large" type="danger">
            <span class="u-status"> 解除绑定 </span>
        </el-button>

        <el-dialog
            class="m-qqbot-dialog"
            :width="isPhone ? '95%' : ''"
            align="center"
            title="绑定魔盒QQ机器人"
            :visible.sync="showDialog"
        >
            <div class="m-qqbot-content">
                <span
                    class="u-token"
                    title="点击复制"
                    v-clipboard:copy="bindText"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                >
                    <i class="el-icon-document-copy"></i>
                    {{ bindText }}
                </span>
            </div>
            <div class="m-custom-tip">
                请复制以上内容，私聊发送给魔盒QQ机器人<br>
                QQ: <b>{{ qq }}</b>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { __cdn } from "@/utils/config";
import { getQQbotToken, unbindQQbot } from "@/service/dashboard/profile";
export default {
    name: "qqbot",
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    data: function () {
        return {
            showDialog: false,

            token: "",
            qq: "3889010020",

            isPhone: window.innerWidth < 768,
        };
    },
    computed: {
        checkStatus: function () {
            return this.data.qqbot;
        },
        bindText() {
            return `绑定账号 ${this.token}`;
        },
    },
    methods: {
        icon: function (type) {
            return __cdn + "design/user/" + "qqbot.png";
        },
        bind: function () {
            getQQbotToken().then((res) => {
                this.token = res.data.data.token;
                this.showDialog = true;
            });
        },
        unbind: function () {
            this.$confirm("确定要解绑【魔盒QQ机器人】吗？", "解绑", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    unbindQQbot().then((res) => {
                        this.$message({
                            type: "success",
                            message: "解绑成功",
                        });
                        this.$emit("refresh");
                    });
                })
                .catch(() => {});
        },
        onCopy: function (val) {
            this.$notify({
                title: "复制成功",
                message: val.text,
                type: "success",
            });
        },
        onError: function () {
            this.$notify.error({
                title: "复制失败",
                message: "请手动复制",
            });
        },
    },
};
</script>

<style lang="less">
.m-qqbot-dialog {
    .m-qqbot-content {
        padding: 20px;
        max-width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
        .u-token {
            .fz(20px);
            background-color: #e6f0fb;
            border: 1px solid @color-link;
            color: @color-link;
            padding: 20px;
            font-weight: 400;
            .r(4px);
            white-space: nowrap;

            i {
                .fz(20px);
                .y;
            }
            .pointer;
        }
    }
    .m-custom-tip {
        .x;
        .mt(20px);
        max-width: 680px;
        .auto(x);
        .fz(14px,2);
        b{
            color:orange;
        }
    }

    @media screen and (max-width: @phone) {
        .m-qqbot-content {
            padding: 8px;
            .u-token {
                .fz(14px);
                background-color: #e6f0fb;
                border: 1px solid @color-link;
                color: @color-link;
                padding: 8px 2px;
                .r(4px);

                i {
                    .fz(13px);
                    .y;
                }
                .pointer;
            }
        }
    }
}
</style>
