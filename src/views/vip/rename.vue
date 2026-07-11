<template>
    <div>
        <CommonHeader></CommonHeader>
        <div class="m-vip-container m-rename-page" v-if="isLogin">
            <div class="m-vip-rename">
                <simple-header class="m-vip-rename-title" :title="$t('vip.rename.title')" :desc="$t('vip.rename.subtitle')" />

                <div class="m-vip-rename-main" v-if="!done">
                    <div class="m-rename-panel">
                        <div class="m-rename-count">
                            <span>{{ $t("vip.rename.remainingCount") }}</span>
                            <b>{{ count }}</b>
                        </div>

                        <div class="m-rename-exchange">
                            <div>
                                <b>{{ $t("vip.rename.pointsExchange") }}</b>
                                <span v-if="isCardLoading">{{ $t("vip.common.loadingExchange") }}</span>
                                <span v-else-if="cardLoadError">{{ cardLoadError }}</span>
                                <span v-else>{{ renameCardPointText }}</span>
                            </div>
                            <el-button type="primary" plain @click="buy" :loading="isBuying" :disabled="isCardLoading">
                                {{ $t("vip.common.exchange") }}
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
                        <el-form-item class="u-new-name" :label="$t('vip.rename.newName')">
                            <el-input
                                v-model="new_name"
                                :placeholder="$t('vip.rename.namePlaceholder')"
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
                                >{{ $t("vip.rename.confirmChange") }}</el-button
                            >
                            <el-button
                                @click="buy"
                                type="primary"
                                class="u-submit u-submit-buy"
                                v-else
                                icon="ShoppingCart"
                                :loading="isBuying"
                                >{{ $t("vip.rename.exchangeCount") }}</el-button
                            >
                        </el-form-item>
                    </el-form>
                </div>
                <result v-else>
                    <template #title>
                        <div class="m-rename-result-title">
                            {{ $t("vip.rename.successPrefix") }}<b>{{ new_name || $t("vip.common.unknown") }}</b>
                        </div>
                    </template>
                    <template #desc>
                        <div class="m-rename-result-desc">
                            <i class="el-icon-info"></i>
                            {{ $t("vip.rename.republishHint") }}<a href="/account/login">{{ $t("vip.rename.loginAgain") }}</a>
                        </div>
                    </template>
                </result>
            </div>
        </div>
        <div class="m-vip-container m-rename-page" v-else>
            <el-alert :title="$t('vip.common.loginRequired')" type="error" show-icon> </el-alert>
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
            if (!this.renameCard.id) return this.$t("vip.common.exchangeInfoUnavailableShort");
            const points = Number(this.renameCard.price_points) || 0;
            return points ? this.$t("vip.common.pointsPerExchange", { points }) : this.$t("vip.common.freeExchange");
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
                this.checktips = this.$t("vip.rename.invalidFormat");
                return false;
            }
            // 不允许使用”账号已注销“
            if (checkingName == "账号已注销") {
                this.valid = false;
                this.available = null;
                this.checktips = this.$t("vip.rename.invalidFormat");
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
            this.checktips = this.$t("vip.rename.checking");
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
                        this.checktips = this.$t("vip.rename.invalidFormat");
                    } else if (!this.available) {
                        this.checktips = msg || this.$t("vip.rename.nameUsed");
                    } else {
                        this.checktips = this.$t("vip.rename.nameAvailable");
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
                    this.cardLoadError = err?.response?.data?.msg || err?.message || this.$t("vip.common.tryLater");
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
            if (!this.canBuyInfo.points) return this.$t("vip.requirements.pointsInsufficient", { amount: this.renameCard.price_points || 0 });
            if (!this.canBuyInfo.box_coin) return this.$t("vip.requirements.boxcoinInsufficient", { amount: this.renameCard.price_boxcoin || 0 });
            if (!this.canBuyInfo.cny) return this.$t("vip.requirements.cnyInsufficient", { amount: this.renameCard.price_cny || 0 });
            if (!this.canBuyInfo.stock) return this.$t("vip.requirements.outOfStock");
            if (!this.canBuyInfo.buy_time) return this.$t("vip.requirements.outsideSaleTime");
            if (!this.canBuyInfo.level) return this.$t("vip.requirements.levelTooLow");
            if (!this.canBuyInfo.vip_limit) return this.$t("vip.requirements.membersOnly");
            return this.$t("vip.requirements.notEligible");
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
                        this.$alert(this.$t("vip.common.exchangeInfoUnavailable"), this.$t("vip.common.exchangeUnavailable"), {
                            confirmButtonText: this.$t("vip.common.gotIt"),
                            type: "warning",
                        });
                    }
                });
            }
            if (!this.canBuyInfo.canBuy) {
                return this.$alert(this.getUnavailableMessage(), this.$t("vip.common.purchaseUnavailable"), {
                    confirmButtonText: this.$t("vip.common.gotIt"),
                    type: "warning",
                });
            }
            this.$confirm(this.$t("vip.rename.confirmExchangeMessage", { points: Number(this.renameCard.price_points) || 0 }), this.$t("vip.common.confirmExchange"), {
                confirmButtonText: this.$t("vip.common.confirmExchange"),
                cancelButtonText: this.$t("vip.common.cancel"),
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
                                title: this.$t("vip.common.purchaseSuccess"),
                                message: this.$t("vip.rename.countRefreshed"),
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
