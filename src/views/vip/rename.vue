<template>
    <div>
        <CommonHeader></CommonHeader>
        <div class="m-vip-container m-rename-page" v-if="isLogin">
            <div class="m-vip-rename">
                <simple-header class="m-vip-rename-title" title="修改您的昵称" desc="Rename your nickname" />
                <div class="u-tip">
                    <div v-if="!had_renamed"><i class="el-icon-s-opportunity"></i> 每个账号拥有一次免费更名机会</div>
                    <div v-else>
                        当前剩余可改名次数 <b>{{ count }}</b>
                        <el-button
                            @click="buy"
                            type="primary"
                            icon="ShoppingCart"
                            style="margin-left: 10px"
                            :loading="isBuying"
                            >购买改名卡</el-button
                        >
                    </div>
                </div>

                <div class="m-vip-rename-main" v-if="!done">
                    <el-form
                        class="m-vip-rename-form"
                        ref="form"
                        label-width="80px"
                        label-position="left"
                        :class="{ isNormal: count }"
                        size="large"
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
                                <template #append>
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
                                >提交</el-button
                            >
                            <el-button
                                @click="buy"
                                type="primary"
                                class="u-submit u-submit-buy"
                                v-else
                                icon="ShoppingCart"
                                :loading="isBuying"
                                >购买改名次数</el-button
                            >
                        </el-form-item>
                    </el-form>

                    <div class="m-rename-card">
                        <div class="m-card-head">
                            <div class="u-card-kicker">改名卡</div>
                            <a class="u-mall-link" :href="`/vip/mall/${renameCardId}`" target="_blank">查看商品</a>
                        </div>
                        <div class="m-rename-good" v-if="isCardLoading">
                            <i class="el-icon-loading"></i>
                            <span>正在读取商品信息...</span>
                        </div>
                        <div class="m-rename-good is-error" v-else-if="cardLoadError">
                            <b>商品信息加载失败</b>
                            <span>{{ cardLoadError }}</span>
                            <button type="button" @click="loadRenameCard">重试</button>
                        </div>
                        <template v-else>
                            <div class="m-rename-good">
                                <img v-if="renameCardCover" class="u-card-cover" :src="renameCardCover" :alt="renameCard.title" />
                                <div v-else class="u-card-cover u-card-cover-null">改名</div>
                                <div class="m-card-info">
                                    <div class="u-card-title">{{ renameCard.title || "改名卡" }}</div>
                                    <div class="u-card-desc">购买后可增加 1 次昵称修改机会</div>
                                </div>
                            </div>
                            <div class="m-card-cost">
                                <span v-if="renameCard.price_points">
                                    <img src="@/assets/img/vip/vip2/points.svg" alt="" svg-inline />
                                    {{ renameCard.price_points }} 积分
                                </span>
                                <span v-if="renameCard.price_boxcoin">
                                    <img src="@/assets/img/vip/vip2/box_icon.svg" alt="" svg-inline />
                                    {{ renameCard.price_boxcoin }} 盒币
                                </span>
                                <span v-if="renameCard.price_cny">{{ renameCard.price_cny }} 金箔</span>
                                <span v-if="!cardCostText">待配置</span>
                            </div>
                            <div class="m-card-meta">
                                <span :class="{ canBuy: canBuyInfo.points }">积分</span>
                                <span :class="{ canBuy: canBuyInfo.box_coin }">盒币</span>
                                <span :class="{ canBuy: canBuyInfo.cny }">金箔</span>
                                <span :class="{ canBuy: canBuyInfo.stock }">库存{{ stockText }}</span>
                                <span :class="{ canBuy: canBuyInfo.buy_time }">购买期</span>
                            </div>
                            <button
                                class="u-card-buy"
                                type="button"
                                :class="{ disabled: !canBuyRenameCard }"
                                :disabled="isBuying"
                                @click="buy"
                            >
                                {{ buyButtonText }}
                            </button>
                        </template>
                    </div>
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
import { __Root, __cdn } from "@/utils/config";
import simple_header from "@/components/vip/simple_header.vue";
import { getItem } from "@/service/vip/mall";
import { handleMallExchangeError } from "@/utils/mallExchangeError";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";

const RENAME_CARD_ID = 38;

export default {
    data: function () {
        return {
            // 资产与权限
            isLogin: User.isLogin(),
            asset: {},

            // 改名输入逻辑
            old_name: User.getInfo().name,
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
        renameCardCover() {
            return this.normalizeImageUrl(this.renameCard.goods_images?.[0]);
        },
        stock() {
            return Number(this.renameCard.stock) || 0;
        },
        stockText() {
            return this.stock > 0 ? `${this.stock} 件` : "不足";
        },
        cardCostText() {
            const costs = [];
            if (this.renameCard.price_points) costs.push(`${this.renameCard.price_points} 积分`);
            if (this.renameCard.price_boxcoin) costs.push(`${this.renameCard.price_boxcoin} 盒币`);
            if (this.renameCard.price_cny) costs.push(`${this.renameCard.price_cny} 金箔`);
            return costs.join(" + ");
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
        canBuyRenameCard() {
            return !!this.canBuyInfo.canBuy && !this.isBuying;
        },
        buyButtonText() {
            if (this.isBuying) return "购买中...";
            return "直接购买改名卡";
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
            return User.getAsset().then((data) => {
                this.asset = data;
                this.$store.commit("mallNew/toState", { asset: data });
                this.count = ~~data.rename_card_count;
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
        normalizeImageUrl(url) {
            const value = String(url || "").trim();
            if (!value) return "";
            if (/^(?:data:|blob:)/i.test(value)) return value;
            if (value.startsWith("//")) return resolveImagePath(`https:${value}`);
            if (/^https?:\/\//i.test(value)) return resolveImagePath(value);
            return resolveImagePath(`${__cdn}${value.replace(/^\/+/, "")}`);
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
            if (!this.renameCard.id) {
                return this.loadRenameCard();
            }
            if (!this.canBuyInfo.canBuy) {
                return this.$alert(this.getUnavailableMessage(), "暂不能购买", {
                    confirmButtonText: "知道了",
                    type: "warning",
                });
            }
            this.$confirm(`确认购买「${this.renameCard.title || "改名卡"}」？`, "确认购买", {
                confirmButtonText: "确认购买",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.isBuying = true;
                    return this.$store
                        .dispatch("mallNew/buyGoods", {
                            id: this.renameCardId,
                            count: 1,
                            addressId: 0,
                            remark: "改名卡直接购买",
                        })
                        .then(() => {
                            this.$store.commit("mallNew/toState", { pay_status: false });
                            return Promise.all([this.checkPermission(), this.loadRenameCard()]);
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
        this.checkPermission();
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
