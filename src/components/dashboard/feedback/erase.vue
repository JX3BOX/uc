<!--
 * @Author: iRuxu
 * @Date: 2022-07-03 00:02:30
 * @LastEditTime: 2022-07-03 02:09:18
 * @Description:
-->
<template>
    <div class="m-feedback-erase" v-loading="loading">
        <div class="m-feedback-article">
            <h1 class="u-title">账号注销</h1>
            <div v-html="sanitizedHTML(article)"></div>
        </div>
        <div class="u-tips">
            <div class="u-checkbox"><el-checkbox v-model="agree">我已知晓并同意上述规则</el-checkbox></div>
            <div class="u-confirm">
                <el-button size="small" type="danger" :disabled="!agree" @click="handleConfirm">确认注销</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import DOMPurify from 'dompurify';
import User from "@jx3box/jx3box-common/js/user";
import { getArticle } from "@jx3box/jx3box-common/js/api_misc";
import { leave } from "@/service/dashboard/feedback";
export default {
    name: "FeedbackErase",
    data() {
        return {
            agree: false,
            loading: false,

            article: "",
        };
    },
    mounted() {
        this.loadAlertInfo();
    },
    methods: {
        handleConfirm() {
            this.$confirm(
                "所有财富（例如盒币，红包，积分等将永远无法再使用，也不会退回），本账号绑定的邮箱手机等不可用于再次注册, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).then(() => {
                this.$prompt("请输入密码", "确认密码", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    inputType: "password",
                }).then(({ value }) => {
                    leave(value)
                        .then(() => {
                            this.$message({
                                type: "success",
                                message: "注销成功",
                            });
                            User.destroy();
                            location.href = "/";
                        })
                        .catch((res) => {
                            this.$message({
                                type: "error",
                                message: res.data.msg || "注销失败",
                            });
                        });
                });
            });
        },
        loadAlertInfo() {
            this.loading = true;
            getArticle(43049)
                .then((res) => {
                    this.article = res;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        sanitizedHTML(html){
            return DOMPurify.sanitize(html);
        }
    },
};
</script>

<style lang="less" scoped>
.m-feedback-erase {
    padding-bottom: 20px;
    .m-feedback-article {
        padding: 20px;
        font-size: 14px;
        color: #666;
        line-height: 1.5;
    }
    .u-title {
        .x;
    }

    .u-tips {
        margin-top: 20px;
        .x;
    }
    .u-confirm {
        .mt(10px);
    }
}
</style>
