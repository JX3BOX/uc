<template>
    <div :class="theme" v-loading="loading">
        <CommonHeader></CommonHeader>
        <div class="p-event-blindbox" :class="{ 'is-unavailable': !activityReady }">
            <!-- 模糊背景 -->
            <div class="m-video" v-if="isVideo">
                <video class="u-video" autoplay muted loop :poster="`${themeImg}bg.jpg`" preload="metadata">
                    <source :src="`https://cdn.jx3box.com/design/event/lottery/${theme}/bg.mp4`" type="video/mp4" />
                </video>
            </div>

            <el-image :src="`${themeImg}bg.jpg`" class="m-bg" fit="cover" v-else />
            <!-- 内容 -->
            <div class="p-event-content">
                <div class="m-content">
                    <!-- 左侧 -->
                    <div class="m-left">
                        <div class="logo">
                            <img :src="`${themeImg}logo.svg?123`" :alt="$t('vip.lottery.blindBox')" />
                            <el-tooltip effect="light" placement="bottom-start" popper-class="m-blindbox-info-popover">
                                <template #content>
                                    <div class="m-blindbox-info m-blindbox-rules">
                                        <p v-for="(line, index) in infoLines" :key="index" :class="{ 'is-heading': index === 0 && /[：:]$/.test(line) }">
                                            {{ line }}
                                        </p>
                                    </div>
                                </template>
                                <img class="u-info" :src="`${__imgRoot}desc.svg`" :alt="$t('vip.event.eventDetails')" />
                            </el-tooltip>
                        </div>
                        <!-- 抽奖盒子 -->
                        <div class="m-box" v-show="activityReady" :class="{ active: allActive }">
                            <div
                                :class="['u-box', `u-box-${index + 1}`, { active: number === active }]"
                                v-for="(number, index) in boxList"
                                :key="index"
                                @click="change(number)"
                            >
                                <!-- 围棋五黑五白，其他正常box.svg -->
                                <img
                                    class="u-img"
                                    :src="`${themeImg}${theme === 'weiqi' && index < 5 ? 'boxBlack' : 'box'}.svg?123`"
                                    :alt="$t('vip.lottery.prize')"
                                    :key="replay + 'box' + index"
                                    v-show="showBox(index)"
                                />
                            </div>
                            <div class="m-mark" @click="toLogin" v-if="!isLogin"></div>
                            <div class="u-mark" :class="{ active: mark || !activeList.length }"></div>
                        </div>
                    </div>
                    <!-- 右侧 -->
                    <div class="m-right" v-show="activityReady">
                        <!-- 积分现实 -->
                        <div class="m-point-balance">
                            <span class="u-balance-icon"><img src="https://cdn.jx3box.com/design/event/redeem/bell.png" alt="" /></span>
                            <span class="u-balance-label">{{ $t("vip.common.points") }}</span>
                            <span class="u-balance-value">{{ points }}</span>
                        </div>
                        <!-- 奖品 -->
                        <div class="m-prize box">
                            <div class="m-title">
                                <div class="m-prize-heading">
                                    <span class="u-prize-title">
                                        <Present class="u-prize-icon" aria-hidden="true" />
                                        <span>{{ $t("vip.lottery.prizeOverview") }}</span>
                                    </span>
                                    <button type="button" class="u-preview" @click="preview = true">{{ $t("vip.lottery.quickView") }}</button>
                                </div>
                                <el-dialog
                                    :title="$t('vip.lottery.quickViewTitle')"
                                    v-model="preview"
                                    width="920px"
                                    align-center
                                    :append-to-body="true"
                                    class="m-preview-dialog"
                                >
                                    <div class="m-preview">
                                        <a
                                            :href="aLink(item)"
                                            v-for="(item, index) in previewCards"
                                            :key="index"
                                            target="_blank"
                                            :data-index="index"
                                            class="m-preview-item"
                                        >
                                            <div class="u-preview-image">
                                                <img :src="item.img" :alt="item.name" loading="lazy" />
                                            </div>
                                            <div class="u-preview-content">
                                                <div class="u-prize-name" :title="item.name">{{ item.name }}</div>
                                                <div class="u-prize-count" v-if="!item.unlimited">
                                                    <span>{{ $t("vip.lottery.remaining") }}</span>
                                                    <span><b>{{ item.remaining }}</b><span class="u-total"> / {{ item.total }}</span></span>
                                                </div>
                                                <div class="u-prize-count" v-else>{{ $t("vip.lottery.unlimited") }}</div>
                                                <el-progress
                                                    v-if="!item.unlimited"
                                                    :percentage="item.percentage"
                                                    :show-text="false"
                                                    :stroke-width="4"
                                                />
                                            </div>
                                        </a>
                                    </div>
                                </el-dialog>
                                <el-tooltip effect="light" placement="right-start">
                                    <span class="u-odds" v-show="odds">+ {{ $t("vip.lottery.oddsFormula") }}</span>
                                    <template #content>
                                        <div class="m-blindbox-info">
                                            {{ odds }}
                                        </div>
                                    </template>
                                </el-tooltip>
                            </div>
                            <!-- 展示奖品 -->
                            <div class="m-scroll">
                                <div class="m-scroll-box" ref="scroll">
                                    <a
                                        :href="aLink(item)"
                                        v-for="(item, index) in prizeList"
                                        :key="index"
                                        target="_blank"
                                        :data-index="index"
                                        class="u-item"
                                    >
                                        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                                            <div class="u-prize">
                                                <div class="u-cover"><img :src="item.img" :alt="item.name" /></div>
                                                <div class="u-count" v-if="item.prize_count">
                                                    <span><small>{{ $t("vip.lottery.totalLabel") }}</small><b>{{ item.prize_count }}</b></span>
                                                    <span><small>{{ $t("vip.lottery.drawnLabel") }}</small><b>{{ item.be_won_count || 0 }}</b></span>
                                                </div>
                                            </div>
                                        </el-tooltip>
                                    </a>
                                    <a
                                        :href="aLink(item)"
                                        v-for="(item, index) in prizeList"
                                        :key="'v' + index"
                                        target="_blank"
                                        :data-index="index"
                                        class="u-item"
                                    >
                                        <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                                            <div class="u-prize">
                                                <div class="u-cover"><img :src="item.img" :alt="item.name" /></div>
                                                <div class="u-count" v-if="item.prize_count">
                                                    <span><small>{{ $t("vip.lottery.totalLabel") }}</small><b>{{ item.prize_count }}</b></span>
                                                    <span><small>{{ $t("vip.lottery.drawnLabel") }}</small><b>{{ item.be_won_count || 0 }}</b></span>
                                                </div>
                                            </div>
                                        </el-tooltip>
                                    </a>
                                </div>
                            </div>
                            <div class="u-git-tips" v-if="gift_off">~ * {{ gift_off }} * ~</div>
                        </div>
                        <!-- 抽奖按钮 -->
                        <div class="m-lottery" v-if="draw.length">
                            <div class="m-mark" @click="toLogin" v-if="!isLogin"></div>
                            <button
                                v-if="theme === 'hacker'"
                                type="button"
                                class="u-img refresh u-refresh-match"
                                :aria-label="$t('vip.lottery.refreshBlindBox')"
                                @click="refreshBox"
                            >
                                <span class="u-refresh-slip">
                                    <span class="u-slip-symbol" aria-hidden="true">☯</span>
                                    <span class="u-slip-label" :class="{ 'is-chinese': $i18n.locale.startsWith('zh') }">{{ $t("vip.lottery.refreshBlindBox") }}</span>
                                </span>
                            </button>
                            <img
                                :src="`${themeImg}refresh.svg`"
                                class="u-img refresh"
                                @click="refreshBox"
                                :alt="$t('vip.lottery.refreshBlindBox')"
                                v-if="theme !== 'weiqi' && theme !== 'hacker'"
                            />
                            <div class="u-img refresh" @click="refreshBox" v-if="theme === 'weiqi'"></div>
                            <div
                                class="m-random u-img"
                                v-if="singleDrawCost !== null"
                                :class="{ disabled: !activeList.length || points < singleDrawCost || isDrawing }"
                                @click="openBox"
                            >
                                <span class="u-price u-random-price">
                                    <img src="https://cdn.jx3box.com/design/event/redeem/bell.png" alt="" />
                                    <span>× {{ singleDrawCost }}</span>
                                </span>
                            </div>
                            <div
                                class="m-open u-img"
                                v-if="tenDrawCost !== null"
                                :class="{ disabled: points < tenDrawCost || isDrawing }"
                                @click="openBox('all')"
                            >
                                <span class="u-price u-discount u-batch-price">
                                    <img src="https://cdn.jx3box.com/design/event/redeem/bell.png" alt="" />
                                    <span>× {{ tenDrawCost }}</span>
                                </span>
                                <span class="u-price u-batch-price u-original-price">
                                    <img src="https://cdn.jx3box.com/design/event/redeem/bell.png" alt="" />
                                    <del>× {{ singleDrawCost * 10 }}</del>
                                </span>
                            </div>
                            <!-- 中奖记录 -->
                            <button type="button" class="u-history-entry" @click="isLogin ? openHistory() : toLogin()">
                                <img :src="`${__imgRoot}history.png`" :alt="$t('vip.lottery.history')" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <section v-if="!activityReady" class="m-pc-activity-notice" role="status">
                <div class="u-notice-star" aria-hidden="true">✦</div>
                <h2>{{ activityState === 'ended' ? '本期活动已结束' : '活动暂未开始' }}</h2>
                <p>{{ activityState === 'ended' ? '感谢参与，敬请期待下期活动' : '活动筹备中，请稍后再来' }}</p>
            </section>
            <el-dialog
                v-model="history"
                :title="$t('vip.lottery.history')"
                width="720px"
                class="m-lottery-history-dialog"
                modal-class="m-lottery-history-overlay"
                align-center
                append-to-body
            >
                <History :id="ID" :show="history" @update="showPrizes" />
            </el-dialog>
            <el-dialog
                v-model="hasPrize"
                :title="$t('vip.lottery.resultTitle')"
                :width="myPrizes.length > 1 ? '760px' : '360px'"
                class="m-lottery-result"
                :class="{ 'is-single': myPrizes.length <= 1 }"
                align-center
                append-to-body
                :close-on-click-modal="false"
                @close="closePrize"
            >
                <div class="m-result-grid">
                    <div class="u-result-card" v-for="(item, i) in myPrizes" :key="i" :class="{ 'is-thanks': item.prize_type === 'thanks' }">
                        <template v-if="item.prize_type === 'vip_asset'">
                            <img class="u-result-image" :src="item.vip_asset_type === 'point' ? 'https://cdn.jx3box.com/design/event/redeem/bell.png' : (assetImg[item.vip_asset_type] || `${__imgRoot}points.png`)" alt="" />
                            <span class="u-result-name">{{ item.vip_asset_once_give + assetLabels[item.vip_asset_type] }}</span>
                        </template>
                        <template v-else-if="item.prize_type === 'thanks'">
                            <img class="u-result-image" :src="`${__imgRoot}thanks.png?123`" alt="" />
                            <span class="u-result-name">{{ $t("vip.lottery.thanks") }}</span>
                        </template>
                        <template v-else-if="item.prize_type === 'mall_goods'">
                            <img class="u-result-image" :src="normalizeMallImage(item.goods.goods_images[0])" :alt="item.goods.title" />
                            <span class="u-result-name">{{ item.goods.title }}</span>
                            <a :href="address" target="_blank" rel="noopener" class="u-result-address" v-if="!item.goods.is_virtual">
                                {{ $t("vip.lottery.fillAddress") }}
                            </a>
                        </template>
                    </div>
                </div>
                <template #footer>
                    <button type="button" class="u-result-confirm" :disabled="prizesInterval !== null" @click="hasPrize = false">
                        {{ $t("vip.common.gotIt") }}
                    </button>
                </template>
            </el-dialog>
        </div>
        <div class="mark" v-if="visible" @click="visible = false">
            <div class="m-box">
                <bindWechat @close="visible = false" />
            </div>
        </div>
    </div>
</template>

<script>
const COMPLETE_STATUS = [2, 3];
import bindWechat from "./bindWechat.vue";
import History from "./history.vue";
import { Present } from "@element-plus/icons-vue";
import User from "@jx3box/jx3box-common/js/user";
import { getBreadcrumb, getConfig } from "@/service/vip/cms";
import { getBlindBox, goodLucky, getMyLucky, getLuckyConfig, getMyInfo } from "@/service/vip/lottery";
import { cloneDeep, throttle, zip } from "lodash";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { normalizeMallImage } from "@/utils/mallImage";
import { __Root, __cdn } from "@/utils/config";
import "@/assets/css/vip/lottery/hacker.less";
import "@/assets/css/vip/lottery/dragon.less";
import "@/assets/css/vip/lottery/normal.less";
import "@/assets/css/vip/lottery/weiqi.less";
export default {
    name: "Index",
    data: function () {
        return {
            theme: "",
            raw: {},
            draw: [],
            activityState: "pending",
            activityStart: null,
            activityEnd: null,
            prizeList: [],
            previewList: [],
            points: 0,
            index: 0,

            active: "",
            allActive: false,
            boxList: new Array(10).fill(1).map((item, index) => index + 1),
            activeList: [],
            replay: 0,
            historyList: [],
            mark: false,
            history: false,
            close: false,

            hasPrize: false,
            myPrizes: [],

            scrollInterval: null,
            prizesInterval: null,

            isDrawing: false,

            info: "",
            odds: "",
            blindboxID: "",
            event_status: true,
            gift_off: false,

            visible: false,
            loading: false,
            user: {},
            preview: false,
        };
    },
    components: {
        Present,
        History,
        bindWechat,
    },
    computed: {
        singleDrawCost() {
            return this.drawCost(1);
        },
        tenDrawCost() {
            return this.drawCost(10);
        },
        previewCards() {
            return this.previewList.map((item) => {
                const total = Number.isFinite(Number(item.prize_count)) ? Math.max(0, Number(item.prize_count)) : 0;
                const drawn = Number.isFinite(Number(item.be_won_count)) ? Math.max(0, Number(item.be_won_count)) : 0;
                const remaining = Math.max(0, total - drawn);
                return { ...item, total, remaining, percentage: total > 0 ? Math.round((remaining / total) * 100) : 0 };
            });
        },
        activityReady() {
            return this.event_status && this.activityState === "ready";
        },
        data: function () {
            let _data = {};
            if (Array.isArray(this.raw)) {
                this.raw.forEach((item) => {
                    if (!_data[item.subtype]) _data[item.subtype] = [];
                    _data[item.subtype].push(item);
                });
            }
            return _data;
        },
        isLogin() {
            return User.isLogin();
        },
        infoLines() {
            return (this.info || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
        },
        isBindWechat() {
            return !!this.user?.wechat_mp_openid;
        },
        __imgRoot() {
            return __cdn + "design/event/lottery/";
        },
        themeImg() {
            return this.theme && this.theme !== "normal" ? this.__imgRoot + this.theme + "/" : this.__imgRoot;
        },
        address() {
            return __Root + "dashboard/address";
        },
        ID() {
            return this.$route.query.id || this.blindboxID || 0;
        },
        assetImg() {
            return {
                point: `${this.__imgRoot}points.png`,
                boxcoin: `${this.__imgRoot}boxcoin.png`,
            };
        },
        assetLabels() {
            return {
                boxcoin: this.$t("vip.lottery.boxcoinRemastered"),
                boxcoin_origin: this.$t("vip.lottery.boxcoinOrigin"),
                point: this.$t("vip.common.points"),
            };
        },
        //判断是否需要动画
        isVideo() {
            const data = {
                hacker: "hacker",
                weiqi: "weiqi",
            };
            return data[this.theme];
        },
    },
    watch: {
        isLogin: {
            immediate: true,
            handler: function (val) {
                val && this.myPoints();
            },
        },
        ID: {
            immediate: true,
            handler: function (id) {
                id && this.load();
            },
        },
        theme: {
            immediate: true,
            handler: function (val) {
                if (val == "hacker") {
                    document.body.style.backgroundColor = "#000";
                }
            },
        },
    },
    mounted() {
        this.init();
        this.loadUser();
    },
    methods: {
        drawCost(count) {
            const option = this.draw.find(([times]) => Number(times) === count);
            if (!option || option[1] === null || option[1] === undefined || option[1] === "") return null;
            const cost = Number(option[1]);
            return Number.isFinite(cost) && cost >= 0 ? cost : null;
        },
        normalizeMallImage,
        loadUser() {
            if (this.isLogin) {
                getMyInfo().then((res) => {
                    this.user = res.data.data;
                });
            }
        },
        // 初始化，获取活动ID,并获取活动详情
        init() {
            getLuckyConfig().then((res) => {
                const status = !!~~res.data?.data?.val || 0;
                if (status) {
                    if (User.isTeammate()) {
                        this.LoadId();
                    } else {
                        this.event_status = false;
                    }
                } else {
                    this.LoadId();
                }
            }).catch(() => { this.activityState = "pending"; });
        },
        LoadId() {
            getConfig({ key: "lottery_ID" }).then((res) => {
                this.blindboxID = res.val;
                const promises = [
                    getBreadcrumb("lottery_info"),
                    getBreadcrumb(`lottery_odds_${this.ID}`),
                    getBreadcrumb(`lottery_gift_status_${this.ID}`),
                ];

                Promise.all(promises)
                    .then((res) => {
                        this.info = res[0];
                        this.odds = res[1];
                        this.gift_off = res[2];
                    })
                    .catch(() => {})
                    .finally(() => {
                        this.loading = false;
                    });
            }).catch(() => {
                this.activityState = "pending";
                this.loading = false;
            });
        },
        load() {
            this.activityState = "pending";
            return getBlindBox(this.ID, { mute: true })
                .then((res) => {
                    const data = res.data.data;

                    this.draw = zip(data.allow_once_try_count, data.allow_once_try_count_cost_points);
                    this.previewList = this.setPrizeList(data);
                    this.prizeList = this.setPrizeList(data).reverse();

                    const userLevelLimit = data.user_level_limit;
                    const userLevel = User.getLevel(this.user.experience);

                    if (userLevelLimit > userLevel) {
                        this.$alert(this.$t("vip.lottery.levelTooLow"), this.$t("vip.lottery.activityUnavailable"), {
                            type: "error",
                        });
                    }
                    this.theme = data.skin || "normal";
                    this.activityStart = data.start_time;
                    this.activityEnd = data.end_time;
                    this.activityState = "ready";
                    if (this.draw.length < 2) this.activityState = "pending";
                    if (this.checkActivity()) {
                        this.$nextTick(() => this.scroll(this.prizeList.length));
                        this.refreshBox();
                    }
                })
                .catch((e) => {
                    this.activityState = this.activityError(e) || "pending";
                    this.draw = [];
                    this.previewList = [];
                    this.prizeList = [];
                });
        },
        activityError(error) {
            const data = error?.response?.data || error?.data || {};
            if (Number(data.code) === 61000) return "pending";
            if (Number(data.code) === 61001 && /抽奖活动/.test(data.msg || data.message || "")) {
                return /未上线/.test(data.msg || data.message) ? "pending" : "ended";
            }
            return "";
        },
        checkActivity() {
            const parse = value => value ? new Date(String(value).replace(" ", "T")).getTime() : NaN;
            if (parse(this.activityStart) > Date.now()) this.activityState = "pending";
            else if (parse(this.activityEnd) < Date.now()) this.activityState = "ended";
            return this.activityReady;
        },
        setPrizeList(data) {
            return data.prize.map((item) => {
                if (item.prize_type != "mall_goods" && this.assetImg[item.vip_asset_type])
                    return { img: this.assetImg[item.vip_asset_type], name: this.$t("vip.common.points"), unlimited: true };
                return {
                    id: item.mall_goods.id,
                    img: resolveImagePath(item.mall_goods.goods_images[0]),
                    name: item.mall_goods.title,
                    be_won_count: item.be_won_count,
                    prize_count: item.prize_count,
                };
            });
        },
        // 登录
        toLogin() {
            this.$confirm(this.$t("vip.lottery.loginPrompt"), this.$t("vip.common.prompt"), {
                confirmButtonText: this.$t("vip.common.confirm"),
                cancelButtonText: this.$t("vip.common.cancel"),
                type: "warning",
            }).then(() => {
                User.toLogin();
            });
        },
        // 显示抽奖盒子
        showBox(index) {
            return this.activeList.includes(index + 1);
        },
        // 返回奖品链接
        aLink({ id }) {
            return id ? __Root + "vip/mall/" + id : "";
        },
        // 获取积分
        myPoints() {
            User.getAsset().then((res) => {
                this.points = res?.points || 0;
            });
        },
        // 滚动
        scroll(count) {
            if (!this.$refs.scroll) return;
            setTimeout(() => {
                const track = this.$refs.scroll;
                if (!track || !count || !track.children[count]) return;
                const distance = track.children[count].offsetLeft - track.children[0].offsetLeft;
                const rule = `
            @keyframes scroll_prize {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-${distance}px);
                }
            }`;
                const style = document.createElement("style");
                style.setAttribute("type", "text/css");
                document.head.appendChild(style);
                style.sheet.insertRule(rule);
                track.style.animation = `scroll_prize ${distance / 50}s linear infinite`;
            }, 1500);
        },
        // 刷新box
        refreshBox() {
            this.allActive = false;
            this.activeList = cloneDeep(this.boxList);
            this.replay++;
        },
        // 打开盒子
        openBox: throttle(function (key) {
            if (!this.checkActivity()) return;
            const cost = key === "all" ? this.tenDrawCost : this.singleDrawCost;
            if (cost === null || this.points < cost || this.isDrawing) return;
            if (!this.isBindWechat) {
                this.visible = true;
                return;
            }

            if (key === "all") {
                let time = 0;
                if (this.activeList.length < 10) {
                    this.activeList = [];
                    this.refreshBox();
                    time = 2000;
                }
                setTimeout(() => {
                    this.openAllBox();
                }, time);
            } else {
                const number = this.activeList[Math.floor(Math.random() * this.activeList.length)];
                this.change(number);
            }
        }, 3000),
        openAllBox() {
            this.allActive = true;
            setTimeout(() => {
                this.activeList = [];
                this.allActive = false;
            }, 1600);
            this.hasLucky();
        },
        // 选择盒子抽奖
        change(number) {
            if (!this.checkActivity()) return;
            if (this.singleDrawCost === null || this.points < this.singleDrawCost || this.mark || this.isDrawing) return;
            this.active = number;
            this.mark = true;
            setTimeout(() => {
                this.activeList = this.activeList.filter((item) => item !== number);
                this.mark = false;
                this.active = "";
            }, 1600);
            this.hasLucky();
        },
        // 抽奖
        hasLucky() {
            if (!this.checkActivity()) return;
            let batch = 1;
            if (this.allActive) batch = 10;
            const cost = this.drawCost(batch);
            if (cost === null || this.points < cost || this.isDrawing) return;
            this.isDrawing = true;
            goodLucky(this.ID, batch, { mute: true }).then((res) => {
                const _id = res.data?.data.id;
                this.showPrizes(_id, true);
                this.myPoints();
            }).catch((error) => {
                this.isDrawing = false;
                this.mark = false;
                this.allActive = false;
                const state = this.activityError(error);
                if (state) this.activityState = state;
                else this.$message.error("抽奖失败，请稍后重试");
            });
        },
        // 查询中奖
        showPrizes(id, isDraw) {
            if (!id) return;
            let count = 0;
            const getLucky = () => {
                getMyLucky(id).then((res) => {
                    if (count > 5) {
                        clearInterval(this.prizesInterval);
                        this.prizesInterval = null;
                        return this.$alert(this.$t("vip.lottery.drawErrorMessage"), this.$t("vip.lottery.drawErrorTitle"), {
                            type: "error",
                        });
                    }
                    if (COMPLETE_STATUS.indexOf(res.data?.data.status) !== -1) {
                        this.myPrizes =
                            (res.data?.data.prizes &&
                                res.data?.data.prizes.map((item) => {
                                    if (item.goods.goods_images)
                                        item.goods.goods_images[0] = resolveImagePath(item.goods.goods_images[0]);
                                    return item;
                                })) ||
                            [];

                        // 如果是抽奖就随机插入谢谢惠顾
                        let isOne = true;
                        if (isDraw && isOne) {
                            const prizeLength = res.data?.data?.prizes?.length || 0;
                            const thanksLength = res.data?.data.chance_count - prizeLength;
                            const thanksPrizes = new Array(thanksLength).fill({ prize_type: "thanks" });
                            this.myPrizes = this.myPrizes.concat(thanksPrizes).sort(() => 0.5 - Math.random());
                            isOne = false;
                        }
                        this.hasPrize = true;
                        clearInterval(this.prizesInterval);
                        this.prizesInterval = null;
                    } else {
                        count++;
                    }
                });
            };
            if (!isDraw) {
                getLucky();
            } else {
                this.prizesInterval = setInterval(getLucky, 1000);
            }
        },
        // 关闭奖品弹窗
        closePrize() {
            this.hasPrize = false;
            this.isDrawing = false;
            if (!this.history) {
                getBlindBox(this.ID).then((res) => {
                    const data = res.data.data;
                    this.prizeList = this.setPrizeList(data);
                    this.scroll(this.prizeList.length);
                });
            }
            if (!this.activeList.length) {
                this.refreshBox();
            }
            this.myPrizes = [];
        },
        openHistory() {
            this.history = true;
        },
        closeHistory() {
            this.history = false;
        },
    },
    beforeUnmount() {
        clearInterval(this.scrollInterval);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/lottery/index.less";
</style>
