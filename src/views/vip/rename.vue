<template>
    <div id="app">
        <Header></Header>
        <div class="m-vip-container" v-if="isLogin">
            <div class="m-vip-rename">
                <simple-header class="m-vip-rename-title" title="修改您的昵称" desc="Rename your nickname" />
                <div class="u-tip">
                    <div v-if="!had_renamed"><i class="el-icon-s-opportunity"></i> 每个账号拥有一次免费更名机会</div>
                    <div v-else>
                        当前剩余可改名次数 <b>{{ count }}</b>
                        <el-button @click="toPurchaseRenameCard" type="primary" size="small" icon="el-icon-shopping-cart-2" style="margin-left: 10px;">购买改名卡</el-button>
                    </div>
                </div>
                <el-form
                    class="m-vip-rename-form"
                    ref="form"
                    label-width="80px"
                    label-position="left"
                    v-if="!done"
                    :class="{ isNormal: count }"
                >
                    <el-form-item class="u-old-name" label="当前昵称">
                        <b>{{ old_name }}</b>
                    </el-form-item>
                    <el-form-item class="u-new-name" label="新昵称">
                        <el-input
                            v-model="new_name"
                            placeholder="2-20个字符,不允许特殊字符"
                            show-word-limit
                            :maxlength="20"
                            :minlength="2"
                            @input="checkName"
                            :disabled="!count"
                        >
                            <i slot="append" class="u-status" :class="checkicon"></i>
                        </el-input>
                        <el-alert v-if="!isEmpty" :title="checktips" :type="status ? 'success' : 'error'" show-icon>
                        </el-alert>
                    </el-form-item>
                    <el-form-item class="u-btns" label="">
                        <el-button
                            @click="submit"
                            type="primary"
                            class="u-submit u-submit-rename"
                            icon="el-icon-check"
                            v-if="count"
                            :disabled="!status"
                            >提交</el-button
                        >
                        <el-button
                            @click="buy"
                            type="primary"
                            class="u-submit u-submit-buy"
                            v-else
                            icon="el-icon-shopping-cart-2"
                            >购买改名次数</el-button
                        >
                    </el-form-item>
                </el-form>
                <result v-else>
                    <div slot="title" class="m-rename-result-title">
                        修改成功，新昵称<b>{{ new_name || "未知" }}</b>
                    </div>
                    <div slot="desc" class="m-rename-result-desc">
                        <i class="el-icon-info"></i>
                        修改昵称后部分应用需要自行重新更新作品方可生效，<a href="/account/login">重新登录</a>
                    </div>
                </result>
            </div>
        </div>
        <div class="m-vip-container" v-else>
            <el-alert title="请先登录" type="error" show-icon> </el-alert>
        </div>
        <paypop
            v-if="will"
            v-model="dialog_visible"
            :productDesc="productDesc"
            :productId="productId"
            :returnUrl="returnUrl"
            @done="finish"
        />
        <Footer></Footer>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { sterilizer } from "sterilizer/index.js";
import { checkNickname, doRename } from "@/service/vip/rename.js";
import result from "@/components/vip/result.vue";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import paypop from "@/components/vip/paypop.vue";
import callback from "@/utils/callback.js";
import simple_header from "@/components/vip/simple_header.vue";
export default {
    data: function () {
        return {
            // position: window.innerWidth < 768 ? "top" : "left",
            // 资产与权限
            isLogin: User.isLogin(),
            asset: "",

            // 改名输入逻辑
            old_name: User.getInfo().name,
            new_name: "",
            available: null,
            valid: null,
            count: 1,

            // 状态与流程控制
            done: false, //是否改名完成
            pay_success: false, //支付完成回调
            refer: "", //开通完成后跳转至付费产品

            // 支付弹层
            dialog_visible: false, //弹层可见性
            will: false, //用于确认支付弹层是否加载，再次打开窗口时不会重新创建订单
            productId: "4", //改名卡产品ID
            productDesc: "购买改名卡", //弹层标题
            returnUrl: callback("rename"), //支付宝回调地址，当前页面

            checktips: "",
        };
    },
    computed: {
        isEmpty: function () {
            return this.new_name == "";
        },
        status: function () {
            return this.available && this.valid;
        },
        checkicon: function () {
            if (this.isEmpty) {
                return "el-icon-remove";
            }
            if (this.status) {
                return "el-icon-success";
            } else {
                return "el-icon-error";
            }
        },
        had_renamed: function () {
            return (this.asset && ~~this.asset.had_renamed) || false;
        },
    },
    methods: {
        checkName: function () {
            // 为空退出
            if (this.isEmpty) {
                this.valid = null;
                this.available = null;
                return false;
            }
            // 长度限制
            if (this.new_name.length < 2 || this.new_name.length > 20) {
                this.valid = false;
                return false;
            }
            // 不允许使用”账号已注销“
            if (this.new_name == "账号已注销") {
                this.valid = false;
                return false;
            }
            // 禁用符号
            this.new_name = sterilizer(this.new_name).kill().removeSpace().toString();
            this.valid = true;
            let msg = "";
            // 可用性检查
            checkNickname(this.new_name)
                .then((res) => {
                    this.available = res.data.data;
                })
                .catch((err) => {
                    this.available = false;
                    msg = err.data.msg;
                })
                .finally(() => {
                    if (!this.valid) {
                        this.checktips = "昵称格式不正确，长度2-20字符，禁止使用所有特殊符号";
                    } else if (!this.available) {
                        this.checktips = msg || "昵称已被使用";
                    } else {
                        this.checktips = "昵称可以使用";
                    }
                });
        },
        checkPermission: function () {
            User.getAsset().then((data) => {
                this.asset = data;
                this.count = ~~data.rename_card_count;
                console.log("当前改名次数", this.count);
            });
        },
        submit: function () {
            doRename(this.new_name).then(() => {
                User.destroy().then((res) => {
                    this.done = true;
                    setTimeout(function () {
                        location.href = __Root + "account/login";
                    }, 2000);
                });
            });
        },
        buy: function () {
            this.will = true;
            this.dialog_visible = true;
        },
        finish: function () {
            location.reload();
        },
        toPurchaseRenameCard() {
            const url = "/vip/mall/38";
            window.open(url, "_blank");
        }
    },
    mounted: function () {
        this.checkPermission();
    },
    components: {
        result,
        paypop,
        "simple-header": simple_header,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/rename.less";
</style>
