<template>
    <div>
        <CommonHeader></CommonHeader>
        <div class="m-vip-container m-rename-page" v-if="isLogin">
            <div class="m-vip-rename">
                <simple-header class="m-vip-rename-title" title="修改昵称" desc="Rename your nickname" />

                <div class="m-vip-rename-main" v-if="!done">
                    <div class="m-rename-panel">
                        <div class="m-rename-count">
                            <span>剩余改名次数</span>
                            <b>{{ count }}</b>
                        </div>

                        <div class="m-rename-exchange">
                            <div>
                                <b>积分兑换改名次数</b>
                                <span v-if="isCardLoading">正在读取兑换信息...</span>
                                <span v-else-if="cardLoadError">{{ cardLoadError }}</span>
                                <span v-else>{{ renameCardPointText }}</span>
                            </div>
                            <el-button type="primary" plain @click="buy" :loading="isBuying" :disabled="isCardLoading">
                                兑换
                            </el-button>
                        </div>
                    </div>

                    <el-form
                        class="m-vip-rename-form"
                        ref="form"
                        label-width="0"
                        label-position="top"
                        :class="{ isNormal: count }"
                        size="large"
                    >
                        <el-form-item class="u-new-name" label="输入新名字">
                            <el-input
                                v-model="new_name"
                                placeholder="2-20个字符,不允许特殊字符"
                                show-word-limit
                                :maxlength="20"
                                :minlength="2"
                                @input="checkName"
                                :disabled="!count"
                            >
                                <template #append v-if="!isEmpty">
                                    <i class="u-status" :class="checkicon"></i>
                                </template>
                            </el-input>
                            <el-alert v-if="!isEmpty" :title="checktips" :type="status ? 'success' : 'error'" show-icon>
                            </el-alert>
                        </el-form-item>
                        <el-form-item class="u-btns" label="">
                            <el-button
                                @click="submit"
                                type="primary"
                                class="u-submit u-submit-rename"
                                icon="Check"
                                v-if="count"
                                :disabled="!status"
                                >确认修改</el-button
                            >
                            <el-button
                                @click="buy"
                                type="primary"
                                class="u-submit u-submit-buy"
                                v-else
                                icon="ShoppingCart"
                                :loading="isBuying"
                                >兑换改名次数</el-button
                            >
                        </el-form-item>
                    </el-form>
                </div>
                <result v-else>
                    <template #title>
                        <div class="m-rename-result-title">
                            修改成功，新昵称<b>{{ new_name || "未知" }}</b>
                        </div>
                    </template>
                    <template #desc>
                        <div class="m-rename-result-desc">
                            <i class="el-icon-info"></i>
                            修改昵称后部分应用需要自行重新更新作品方可生效，<a href="/account/login">重新登录</a>
                        </div>
                    </template>
                </result>
            </div>
        </div>
        <div class="m-vip-container m-rename-page" v-else>
            <el-alert title="请先登录" type="error" show-icon> </el-alert>
        </div>
        <CommonFooter></CommonFooter>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { sterilizer } from "sterilizer/index.js";
import { checkNickname, doRename } from "@/service/vip/rename.js";
import result from "@/components/vip/result.vue";
import { __Root } from "@/utils/config";
import simple_header from "@/components/vip/simple_header.vue";
import { getItem } from "@/service/vip/mall";
import { handleMallExchangeError } from "@/utils/mallExchangeError";

const RENAME_CARD_ID = 38;

export default {
    data: function () {
        return {
            // 资产与权限
            isLogin: User.isLogin(),
            asset: {},

            // 改名输入逻辑
            new_name: "",
            available: null,
            valid: null,
            count: 1,

            // 状态与流程控制
            done: false, //是否改名完成
            renameCardId: RENAME_CARD_ID,
            renameCard: {},
            isCardLoading: false,
            isBuying: false,
            cardLoadError: "",
            checkToken: 0,

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
        stock() {
            return Number(this.renameCard.stock) || 0;
        },
        renameCardPointText() {
            if (!this.renameCard.id) return "兑换信息暂不可用";
            const points = Number(this.renameCard.price_points) || 0;
            return points ? `${points} 积分 / 次` : "免费兑换";
        },
        canBuyInfo() {
            const item = this.renameCard || {};
            const info = {
                canBuy: true,
                vip_limit: true,
                box_coin: true,
                points: true,
                cny: true,
                level: true,
                buy_time: true,
                stock: true,
            };
            if (!item.id) info.canBuy = false;
            if (item.vip_limit === 1 && !User._isPRO(this.asset)) {
                info.canBuy = false;
                info.vip_limit = false;
            }
            if ((Number(this.asset.points) || 0) < (Number(item.price_points) || 0)) {
                info.canBuy = false;
                info.points = false;
            }
            if ((Number(this.asset.box_coin) || 0) < (Number(item.price_boxcoin) || 0)) {
                info.canBuy = false;
                info.box_coin = false;
            }
            if ((Number(this.asset.cny) || 0) < (Number(item.price_cny) || 0)) {
                info.canBuy = false;
                info.cny = false;
            }
            if ((Number(this.asset.experience) || 0) < (Number(item.exp_limit) || 0)) {
                info.canBuy = false;
                info.level = false;
            }
            if (!this.isInSellTime(item)) {
                info.canBuy = false;
                info.buy_time = false;
            }
            if (this.stock <= 0) {
                info.canBuy = false;
                info.stock = false;
            }
            return info;
        },
    },
    methods: {
        checkName: function () {
            // 为空退出
            if (this.isEmpty) {
                this.valid = null;
                this.available = null;
                this.checktips = "";
                return false;
            }
            const checkingName = this.new_name;
            const token = ++this.checkToken;
            // 长度限制
            if (checkingName.length < 2 || checkingName.length > 20) {
                this.valid = false;
                this.available = null;
                this.checktips = "昵称格式不正确，长度2-20字符，禁止使用所有特殊符号";
                return false;
            }
            // 不允许使用”账号已注销“
            if (checkingName == "账号已注销") {
                this.valid = false;
                this.available = null;
                this.checktips = "昵称格式不正确，长度2-20字符，禁止使用所有特殊符号";
                return false;
            }
            // 禁用符号
            this.new_name = sterilizer(this.new_name).kill().removeSpace().toString();
            if (this.new_name !== checkingName) {
                this.checkName();
                return false;
            }
            this.valid = true;
            this.available = null;
            this.checktips = "正在检查昵称...";
            let msg = "";
            // 可用性检查
            checkNickname(checkingName)
                .then((res) => {
                    if (token !== this.checkToken || checkingName !== this.new_name) return;
                    this.available = res.data.data;
                })
                .catch((err) => {
                    if (token !== this.checkToken || checkingName !== this.new_name) return;
                    this.available = false;
                    msg = err?.response?.data?.msg || err?.data?.msg || err?.message || "";
                })
                .finally(() => {
                    if (token !== this.checkToken || checkingName !== this.new_name) return;
                    if (!this.valid) {
                        this.checktips = "昵称格式不正确，长度2-20字符，禁止使用所有特殊符号";
                    } else if (!this.available) {
                        this.checktips = msg || "昵称已被使用";
                    } else {
                        this.checktips = "昵称可以使用";
                    }
                });
        },
        checkPermission: function (minRenameCount = 0) {
            return User.getAsset().then((data) => {
                const count = Math.max(~~data.rename_card_count, minRenameCount);
                const asset = {
                    ...data,
                    rename_card_count: count,
                };
                this.asset = asset;
                this.$store.commit("mallNew/toState", { asset });
                this.count = count;
            });
        },
        loadRenameCard() {
            this.isCardLoading = true;
            this.cardLoadError = "";
            return getItem(this.renameCardId)
                .then((res) => {
                    this.renameCard = res.data?.data || {};
                })
                .catch((err) => {
                    this.cardLoadError = err?.response?.data?.msg || err?.message || "请稍后再试";
                })
                .finally(() => {
                    this.isCardLoading = false;
                });
        },
        isInSellTime(item = {}) {
            if (item.on_selling === 0) return false;
            const now = Date.now();
            const start = item.start_sell_time ? new Date(item.start_sell_time).getTime() : null;
            const end = item.end_sell_time ? new Date(item.end_sell_time).getTime() : null;
            if (start && now < start) return false;
            if (end && now > end) return false;
            return true;
        },
        getUnavailableMessage() {
            if (!this.canBuyInfo.points) return `积分不足：需要 ${this.renameCard.price_points || 0} 积分`;
            if (!this.canBuyInfo.box_coin) return `盒币不足：需要 ${this.renameCard.price_boxcoin || 0} 盒币`;
            if (!this.canBuyInfo.cny) return `金箔不足：需要 ${this.renameCard.price_cny || 0} 金箔`;
            if (!this.canBuyInfo.stock) return "库存不足：当前不可购买";
            if (!this.canBuyInfo.buy_time) return "当前不在可购买时间内";
            if (!this.canBuyInfo.level) return "账号等级不足，暂不能购买";
            if (!this.canBuyInfo.vip_limit) return "该商品仅会员可购买";
            return "当前不满足购买条件";
        },
        submit: function () {
            if (!this.isLogin) {
                return User.toLogin();
            }
            if (!this.count || !this.status) return;
            doRename(this.new_name).then(() => {
                User.destroy().then(() => {
                    this.done = true;
                    setTimeout(function () {
                        location.href = __Root + "account/login";
                    }, 2000);
                });
            });
        },
        buy: function () {
            if (!this.isLogin) {
                return User.toLogin();
            }
            if (!this.renameCard.id) {
                return this.loadRenameCard().then(() => {
                    if (!this.renameCard.id) {
                        this.$alert("兑换信息暂不可用，请稍后再试", "暂不能兑换", {
                            confirmButtonText: "知道了",
                            type: "warning",
                        });
                    }
                });
            }
            if (!this.canBuyInfo.canBuy) {
                return this.$alert(this.getUnavailableMessage(), "暂不能购买", {
                    confirmButtonText: "知道了",
                    type: "warning",
                });
            }
            this.$confirm(`确认消耗${Number(this.renameCard.price_points) || 0}积分兑换一次改名卡吗？`, "确认兑换", {
                confirmButtonText: "确认兑换",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.isBuying = true;
                    const nextCount = this.count + 1;
                    return this.$store
                        .dispatch("mallNew/buyGoods", {
                            id: this.renameCardId,
                            count: 1,
                            addressId: 0,
                            remark: "改名次数积分兑换",
                        })
                        .then(() => {
                            this.$store.commit("mallNew/toState", { pay_status: false });
                            return Promise.all([this.checkPermission(nextCount), this.loadRenameCard()]);
                        })
                        .then(() => {
                            this.$notify.success({
                                title: "购买成功",
                                message: "改名次数已刷新",
                            });
                        });
                })
                .catch((error) => {
                    if (error === "cancel" || error === "close") return;
                    return handleMallExchangeError(this, error);
                })
                .finally(() => {
                    this.isBuying = false;
                });
        },
    },
    mounted: function () {
        this.isLogin && this.checkPermission();
        this.loadRenameCard();
    },
    components: {
        result,
        "simple-header": simple_header,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/rename.less";
</style>
