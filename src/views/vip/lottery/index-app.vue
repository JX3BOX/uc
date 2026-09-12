<template>
    <div class="p-app-lottery" v-loading="loading">
        <!-- 头部 -->
        <header class="m-header">
            <div class="u-back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="m-title">
                <img class="u-title-img" :src="`${__appImgRoot}title.png`" alt="签到赢大奖" />
                <p>* 每天登录APP签到，兑换刮奖次数~</p>
            </div>
        </header>

        <!-- 状态卡 -->
        <section class="m-status-card">
            <div class="m-count">
                <img class="u-icon" :src="`${__appImgRoot}cishu.jpg`" alt="刮奖次数" />
                <div class="u-text">
                    <span class="u-label">当前可刮奖</span>
                    <span class="u-num">{{ remainingCount }}</span>
                    <span class="u-unit">次</span>
                </div>
            </div>
            <div class="m-actions">
                <button
                    class="u-btn"
                    :class="isSignedIn ? 'is-signed' : 'is-unsigned'"
                    @click="handleSign"
                    :disabled="isLogin"
                >
                    {{ isSignedIn ? "今日已签到" : "今日未签到" }}
                </button>
                <button class="u-btn u-btn-primary" @click="openExchange">积分换次数</button>
            </div>
        </section>

        <!-- 本期奖池 -->
        <section class="m-prize-pool">
            <div class="m-section-title">
                <span>本期奖池</span>
                <span class="u-more" @click="showDetail = !showDetail">
                    <i class="el-icon-arrow-down" :class="{ 'is-up': showDetail }"></i>
                    奖池详情
                </span>
            </div>

            <!-- 奖池缩略（走马灯） -->
            <div class="m-prize-list" v-if="!showDetail">
                <div class="m-prize-track" :class="{ 'is-paused': !!activePrize }">
                    <template v-for="(item, index) in previewList" :key="'a-' + index">
                        <div
                            class="m-prize-item"
                            :class="{ 'is-top': isTopClass(index) }"
                            @click="selectPrize(item, index)"
                        >
                            <div class="u-img-wrap">
                                <img :src="item.img" :alt="item.name" />
                            </div>
                            <span class="u-name">{{ item.name }}</span>
                            <div class="u-stars">
                                <img v-for="n in item.stars || 1" :key="n" :src="starIcon(index)" class="u-star-icon" />
                            </div>
                        </div>
                    </template>
                    <template v-for="(item, index) in previewList" :key="'b-' + index">
                        <div
                            class="m-prize-item"
                            :class="{ 'is-top': isTopClass(index) }"
                            aria-hidden="true"
                            @click="selectPrize(item, index)"
                        >
                            <div class="u-img-wrap">
                                <img :src="item.img" :alt="item.name" />
                            </div>
                            <span class="u-name">{{ item.name }}</span>
                            <div class="u-stars">
                                <img v-for="n in item.stars || 1" :key="n" :src="starIcon(index)" class="u-star-icon" />
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- 奖池详情列表 -->
            <div class="m-prize-detail" v-if="showDetail">
                <PrizeDetailItem
                    v-for="(item, index) in previewList"
                    :key="index"
                    :item="item"
                    :is-active="index === 0"
                />
            </div>

            <!-- 奖品详情弹窗 -->
            <div class="m-overlay" v-if="activePrize" @click.self="closePrizeDetail">
                <div class="m-prize-dialog">
                    <div class="u-img-wrap"><img :src="activePrize.img" :alt="activePrize.name" /></div>
                    <h3>{{ activePrize.name }}</h3>
                    <p class="u-rate">中奖率：{{ activePrize.rate || "0.0" }}%</p>
                    <p class="u-desc">{{ activePrize.desc || "奖品介绍" }}</p>
                    <button class="u-confirm-btn" @click="closePrizeDetail">知道了</button>
                </div>
            </div>
        </section>

        <!-- 规则提示 -->
        <div class="m-rules-bar">
            <span class="u-rule" @click="showRules = true">
                <i class="u-icon"> <img svg-inline src="@/assets/img/vip/icon/warning.svg" /> </i>规则说明</span
            >
            <span class="u-tip">请选择一张刮刮卡</span>
            <span class="u-refresh" @click="refreshCards">
                换一批
                <i class="u-icon"> <img svg-inline src="@/assets/img/vip/icon/reset.svg" /> </i
            ></span>
        </div>

        <!-- 刮卡区 -->
        <section class="m-card-grid" :class="{ 'is-refreshing': isRefreshing }">
            <div class="m-refresh-mask" v-if="isRefreshing">
                <i class="el-icon-loading"></i>
            </div>
            <div
                class="m-scratch-card"
                v-for="(card, index) in cardList"
                :key="index"
                :class="{ 'is-scratched': card.scratched }"
                @click="openSingleScratch(card, index)"
                :style="{ backgroundImage: `url(${__appImgRoot}card-0.jpg)` }"
            >
                <div class="u-card-inner">
                    <span class="u-no">NO.{{ card.no }}</span>
                </div>
                <div class="u-reveal" v-if="card.scratched">
                    <img :src="card.prize.img" />
                    <span>{{ card.prize.name }}</span>
                </div>
            </div>
        </section>

        <!-- 底部操作 -->
        <footer class="m-footer-bar">
            <button class="u-action" :disabled="!canDrawNine || isDrawing" @click="openBatchScratch(9, true)">
                连刮九次
            </button>
            <button class="u-action u-action-primary" :disabled="remainingCount < 1 || isDrawing" @click="scratchAll">
                全部刮完(剩{{ remainingCount }}次)
            </button>
            <button class="u-action u-action-gold" @click="goMyPrizes">我的奖品</button>
        </footer>

        <!-- 单点刮卡弹层 -->
        <div class="m-overlay" v-if="showSingleScratch" @click.self="closeSingleScratch">
            <div class="m-scratch-dialog">
                <ScratchSurface
                    class="m-scratch-stage"
                    :cover="`${__appImgRoot}card-0.jpg`"
                    @complete="scratchFinished = true"
                >
                    <div class="u-prize-reveal" data-scratch-card>
                        <div class="u-prize-card" v-if="currentPrize">
                            <img :src="currentPrize.img" />
                            <span>{{ currentPrize.name }}</span>
                        </div>
                        <div class="u-prize-card" v-else role="status">
                            <i v-if="!drawError" class="u-prize-spinner"></i>
                            <span>{{ drawError ? "结果暂未获取" : "奖品揭晓中…" }}</span>
                        </div>
                    </div>
                </ScratchSurface>
                <p class="u-scratch-tip" v-if="!scratchFinished">用手刮开看看吧！</p>
                <button class="u-confirm-btn" v-else :disabled="!currentPrize" @click="claimSingle">
                    {{ currentPrize ? "拿下!" : "奖品揭晓中…" }}
                </button>
                <div v-if="drawError" class="m-draw-error" role="alert">
                    <p>{{ drawError }}</p>
                    <button v-if="pendingRecord" class="u-confirm-btn" :disabled="retrying" @click="retryDrawResult">
                        {{ retrying ? "查询中…" : "重新查询结果" }}
                    </button>
                    <button class="u-confirm-btn" :disabled="retrying" @click="dismissDrawError">稍后查看奖品</button>
                </div>
            </div>
        </div>

        <!-- 连刮/全部刮开弹层 -->
        <div class="m-overlay" v-if="showBatchScratch" @click.self="closeBatchScratch">
            <div class="m-batch-dialog">
                <ScratchSurface
                    :key="batchPage"
                    class="m-batch-grid"
                    :cover="`${__appImgRoot}card-mini.jpg`"
                    @complete="batchRevealed = true"
                >
                    <div class="m-batch-card" v-for="(item, index) in batchPagePrizes" :key="index" data-scratch-card>
                        <div class="u-result">
                            <template v-if="item">
                                <img :src="item.img" />
                                <span>{{ item.name }}</span>
                            </template>
                            <template v-else>
                                <i v-if="!drawError" class="u-prize-spinner"></i>
                                <span role="status">{{ drawError ? "结果暂未获取" : "奖品揭晓中…" }}</span>
                            </template>
                        </div>
                    </div>
                </ScratchSurface>
                <p class="u-batch-tip" v-if="!batchRevealed">用手滑动刮开卡片</p>
                <button class="u-confirm-btn" v-if="batchRevealed" :disabled="!batchReady" @click="claimBatch">
                    {{ !batchReady ? "奖品揭晓中…" : hasNextBatchPage ? "继续刮下一组" : "拿下！" }}
                </button>
                <div v-if="drawError" class="m-draw-error" role="alert">
                    <p>{{ drawError }}</p>
                    <button v-if="pendingRecord" class="u-confirm-btn" :disabled="retrying" @click="retryDrawResult">
                        {{ retrying ? "查询中…" : "重新查询结果" }}
                    </button>
                    <button class="u-confirm-btn" :disabled="retrying" @click="dismissDrawError">稍后查看奖品</button>
                </div>
            </div>
        </div>

        <!-- 结果展示 -->
        <div class="m-overlay" v-if="showResult" @click.self="closeResult">
            <div class="m-result-dialog">
                <div class="m-result-grid">
                    <div class="m-result-card" v-for="(item, index) in resultPrizes" :key="index">
                        <img :src="item.img" />
                        <span>{{ item.name }}</span>
                    </div>
                </div>
                <button class="u-confirm-btn" @click="closeResult">拿下！</button>
            </div>
        </div>

        <!-- 积分兑换 Action Sheet -->
        <div class="m-overlay" v-if="showExchange" @click.self="showExchange = false">
            <div class="m-action-sheet">
                <h3>魔盒积分兑换刮奖次数</h3>
                <p>你拥有 {{ points }} 魔盒积分，可兑换 {{ exchangeableCount }} 次刮奖次数。</p>

                <div class="m-exchange-options">
                    <button class="u-option u-option-primary" @click="exchange(1)">
                        兑换 1 次({{ costPerTime }} 积分)
                    </button>
                    <button class="u-option u-option-primary" @click="exchange(9)">
                        兑换 9 次({{ costPerTime * 9 }} 积分)
                    </button>
                    <button class="u-option" @click="showExchange = false">暂不兑换</button>
                </div>
            </div>
        </div>

        <!-- 规则说明 -->
        <div class="m-overlay" v-if="showRules" @click.self="showRules = false">
            <div class="m-rules-dialog">
                <h3>规则说明</h3>
                <div class="u-rules-content" v-html="info || '暂无规则说明'"></div>
                <button class="u-confirm-btn" @click="showRules = false">我已知晓</button>
            </div>
        </div>

        <!-- 我的奖品 -->
        <div class="m-page m-page-prizes" v-if="page === 'prizes'" v-loading="myPrizesLoading && !myPrizeList.length">
            <header class="m-header">
                <div class="u-back" @click="page = 'home'">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="m-title">
                    <img :src="`${__appImgRoot}title.png`" class="u-title-img" />
                    <p>* 每天登录APP签到，兑换刮奖次数~</p>
                </div>
            </header>
            <div class="m-prize-records">
                <h3 class="m-section-title-2">我的奖品</h3>
                <div class="m-prize-detail" @scroll="onRecordsScroll">
                    <PrizeDetailItem
                        v-for="(item, index) in myPrizeList"
                        :key="index"
                        :item="{ ...item, rate: item.rate || '0', desc: `获得时间：${item.time || ''}` }"
                        :is-active="activeRecordIndex === index"
                        @click="activeRecordIndex = activeRecordIndex === index ? null : index"
                    />
                    <div class="u-records-tip" v-if="myPrizesLoading">加载中...</div>
                    <div class="u-records-tip" v-else-if="myPrizeList.length && !myPrizeHasMore">没有更多了</div>
                </div>
            </div>
        </div>

        <!-- 未开始/结束 -->
        <div class="mark" v-if="!event_status">
            <div class="m-box"><img :src="`${__imgRoot}null.png`" alt="活动未开放" /></div>
        </div>
        <!-- 绑定微信 -->
        <div class="mark" v-if="visible" @click="visible = false">
            <div class="m-box">
                <bindWechat @close="visible = false" />
            </div>
        </div>
    </div>
</template>

<script>
const COMPLETE_STATUS = [2, 3];
// 刮刮卡网格的卡片数量
const CARD_SIZE = 4;
// 设计稿中的固定展示卡号
const CARD_NO_MAX = 999999999;
import ScratchSurface from "./ScratchSurface.vue";
import dayjs from "dayjs";
import { userSignIn } from "@jx3box/jx3box-ui/service/author";
import bindWechat from "./bindWechat.vue";
import PrizeDetailItem from "./PrizeDetailItem.vue";
import User from "@jx3box/jx3box-common/js/user";
import { getBreadcrumb, getConfig } from "@/service/vip/cms";
import { getBlindBox, goodLucky, getMyLucky, getLuckyConfig, getMyInfo, getMyHistory } from "@/service/vip/lottery";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { normalizeMallImage } from "@/utils/mallImage";
import { initAppEnv } from "@/utils/appEnv";
import { __cdn } from "@/utils/config";

export default {
    name: "AppIndex",
    data() {
        return {
            theme: "app",
            raw: {},
            draw: [],
            previewList: [],
            points: 0,

            remainingCount: 0,
            isSignedIn: false,
            loading: false,
            user: {},

            showDetail: false,
            showExchange: false,
            showRules: false,
            showSingleScratch: false,
            showBatchScratch: false,
            showResult: false,
            page: "home",

            activePrize: null,
            selectedIndex: null,

            activeRecordIndex: null,

            myPrizePage: 1,
            myPrizeHasMore: true,
            myPrizesLoading: false,

            cardList: [],
            activeCardIndex: null,
            currentPrize: null,
            drawError: "",
            pendingRecord: null,
            retrying: false,
            scratchFinished: false,
            isRefreshing: false,

            batchPage: 0,
            batchPrizes: [],
            batchRevealed: false,
            // 分批抽取：每批次数列表、总次数、已完成批次
            batchRounds: [],
            batchTotal: 0,
            batchDoneRounds: 0,
            resultPrizes: [],

            myPrizeList: [],

            info: "",
            odds: "",
            blindboxID: "",
            event_status: true,
            visible: false,
            isDrawing: false,
        };
    },
    components: { bindWechat, ScratchSurface, PrizeDetailItem },
    computed: {
        isLogin() {
            return User.isLogin();
        },
        isBindWechat() {
            return !!this.user?.wechat_mp_openid;
        },
        __imgRoot() {
            return __cdn + "design/event/lottery/";
        },
        __appImgRoot() {
            return __cdn + "design/event/lottery/app/";
        },
        ID() {
            return this.$route.query.id || this.blindboxID || 0;
        },
        costPerTime() {
            return this.draw[0] ? this.draw[0][1] : 0;
        },
        exchangeableCount() {
            return this.costPerTime ? Math.max(0, Math.floor(this.points / this.costPerTime) - this.remainingCount) : 0;
        },
        nineDrawCost() {
            return this.drawCost(9);
        },
        canDrawNine() {
            return this.isLogin && this.nineDrawCost > 0 && this.points >= this.nineDrawCost;
        },
        // 单次可抽取的最大次数（来自后台 allow_once_try_count 配置）
        maxDrawCount() {
            const counts = (this.draw || []).map((item) => ~~item[0]).filter((n) => n > 0);
            return counts.length ? Math.max(...counts) : 9;
        },
        // 当前页独立开放刮奖，不等待后续页面的请求。
        batchReady() {
            return this.batchReadyCards.every(Boolean);
        },
        batchPageHasResult() {
            return this.batchPrizes.slice(this.batchPage * 9, (this.batchPage + 1) * 9).some(Boolean);
        },
        batchReadyCards() {
            return Array.from({ length: 9 }, (_, index) => {
                const offset = this.batchPage * 9 + index;
                return offset >= this.batchPrizes.length || !!this.batchPrizes[offset];
            });
        },
        batchPagePrizes() {
            const items = this.batchPrizes.slice(this.batchPage * 9, (this.batchPage + 1) * 9);
            return items.concat(Array.from({ length: 9 - items.length }, () => this.thanksPrize()));
        },
        hasNextBatchPage() {
            return (this.batchPage + 1) * 9 < this.batchPrizes.length;
        },
        hasOverlay() {
            return !!(
                this.showSingleScratch ||
                this.showBatchScratch ||
                this.showResult ||
                this.showExchange ||
                this.showRules ||
                this.activePrize
            );
        },
    },
    watch: {
        isLogin: {
            immediate: true,
            handler(val) {
                this.isSignedIn = val;
                if (val) this.myPoints();
                else this.remainingCount = 0;
            },
        },
        ID: {
            immediate: true,
            handler(id) {
                id && this.load();
            },
        },
        // 弹窗打开时锁定背景滚动
        hasOverlay(val) {
            document.body.style.overflow = val ? "hidden" : "";
        },
    },
    created() {
        // 本视图不挂载 CommonHeader，需自行落地 App 传入的 __env / __token
        initAppEnv();
    },
    mounted() {
        this.init();
        this.loadUser();
        this.syncDailySignIn();
        this.buildCards();
    },
    methods: {
        normalizeMallImage,
        drawCost(times) {
            const option = this.draw.find(([count]) => Number(count) === times);
            return option ? Number(option[1]) : this.costPerTime * times;
        },
        loadUser() {
            if (this.isLogin) {
                getMyInfo().then((res) => {
                    this.user = res.data.data;
                });
            }
        },
        init() {
            this.loading = true;
            getLuckyConfig().then((res) => {
                const status = !!~~res.data?.data?.val || 0;
                if (status) {
                    if (User.isTeammate()) {
                        this.LoadId();
                    } else {
                        this.event_status = false;
                        this.loading = false;
                    }
                } else {
                    this.LoadId();
                }
            });
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
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            });
        },
        load() {
            getBlindBox(this.ID)
                .then((res) => {
                    const data = res.data.data;
                    this.draw = data.allow_once_try_count.map((count, i) => [
                        count,
                        data.allow_once_try_count_cost_points[i],
                    ]);
                    this.previewList = this.setPrizeList(data);
                    // 可刮次数仅由本次页面的积分兑换产生，不恢复历史缓存或活动总额度。
                    const userLevelLimit = data.user_level_limit;
                    const userLevel = User.getLevel(this.user.experience);
                    if (userLevelLimit > userLevel) {
                        this.$alert("您的等级不足，无法参与活动", "活动不可用", { type: "error" });
                    }
                })
                .catch(() => {
                    this.$alert("活动未开始或已结束", { type: "error" });
                });
        },
        setPrizeList(data) {
            return data.prize.map((item, index) => {
                const stars = Math.max(1, 5 - index);
                if (item.prize_type != "mall_goods") {
                    return {
                        img: `${this.__appImgRoot}jifen.jpg`,
                        name: item.vip_asset_once_give + (this.assetLabel(item.vip_asset_type) || "积分"),
                        stars: Math.max(1, stars),
                        rate: item.probability,
                        desc: "魔盒积分奖励",
                        raw: item,
                    };
                }
                return {
                    id: item.mall_goods.id,
                    img: resolveImagePath(item.mall_goods.goods_images[0]),
                    name: item.mall_goods.title,
                    stars: Math.max(1, stars),
                    rate: item.probability,
                    desc: item.mall_goods.title,
                    raw: item,
                };
            });
        },
        assetLabel(type) {
            const map = { boxcoin: "通宝", boxcoin_origin: "怀旧通宝", point: "积分" };
            return map[type] || "积分";
        },
        starIcon(index) {
            // 设计图：首位大奖使用黄色星 star2，其余使用紫色星 star1
            return `${this.__appImgRoot}${index === 0 ? "star2" : "star1"}.svg`;
        },
        isTopClass(index) {
            // 默认无 is-top，仅点击选中的奖品高亮
            return this.selectedIndex !== null && index === this.selectedIndex;
        },
        selectPrize(item, index) {
            this.activePrize = item;
            this.selectedIndex = index;
        },
        closePrizeDetail() {
            this.activePrize = null;
            this.selectedIndex = null;
        },
        myPoints() {
            User.getAsset().then((res) => {
                this.points = res?.points || 0;
            });
        },
        async syncDailySignIn() {
            if (!this.isLogin) return;
            // 与公共头部共享每日登录签到记录，不额外赠送抽奖次数。
            let lastLogin;
            try {
                lastLogin = JSON.parse(localStorage.getItem("user_last_login") || "null");
            } catch (e) {
                /* 缓存不可读时由服务端判断是否已签到 */
            }
            if (lastLogin && dayjs(lastLogin).isSame(dayjs(), "day")) return;
            try {
                await userSignIn();
                try {
                    localStorage.setItem("user_last_login", JSON.stringify(dayjs()));
                } catch (e) {
                    /* 不影响签到结果 */
                }
                this.myPoints();
            } catch (e) {
                /* 已登录状态不依赖签到奖励接口是否成功 */
            }
        },
        buildCards() {
            this.cardList = new Array(CARD_SIZE).fill(0).map(() => ({
                no: String(CARD_NO_MAX),
                scratched: false,
                prize: null,
            }));
        },
        refreshCards() {
            if (this.isRefreshing) return;
            this.isRefreshing = true;
            this.buildCards();
            setTimeout(() => {
                this.isRefreshing = false;
            }, 800);
        },
        handleSign() {
            if (!this.isLogin) return this.toLogin();
        },
        openExchange() {
            if (!this.isLogin) return this.toLogin();
            this.showExchange = true;
        },
        exchange(times) {
            if (times > this.exchangeableCount) {
                return this.$message.error("魔盒积分不足");
            }
            if (!this.isLogin) return this.toLogin();
            if (!Number.isInteger(times) || times <= 0 || this.costPerTime <= 0 || this.isDrawing) return;
            // 仅预留本次页面的积分额度，实际扣积分沿用抽奖接口。
            this.remainingCount += times;

            this.showExchange = false;
            this.$message.success(`兑换成功，获得 ${times} 次刮奖机会`);
        },
        toLogin() {
            this.$confirm("请先登录后再操作", "提示", {
                confirmButtonText: "去登录",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                User.toLogin();
            });
        },
        goBack() {
            this.$router.back();
        },
        goMyPrizes() {
            if (!this.isLogin) return this.toLogin();
            this.myPrizeList = [];
            this.myPrizePage = 1;
            this.myPrizeHasMore = true;
            this.myPrizesLoading = false;
            this.page = "prizes";
            this.loadMyPrizes(1);
        },
        loadMyPrizes(index = 1) {
            if (this.myPrizesLoading) return;
            this.myPrizesLoading = true;
            getMyHistory({ index, pageSize: 20 })
                .then((res) => {
                    const data = res.data?.data || {};
                    const list = data.list || [];
                    const items = list.map((item) => {
                        const prize = item.prizes?.[0];
                        let name = "谢谢惠顾";
                        let img = `${this.__imgRoot}thanks.png`;
                        if (prize) {
                            if (prize.prize_type === "mall_goods") {
                                name = prize.goods.title;
                                img = normalizeMallImage(prize.goods.goods_images[0]);
                            } else if (prize.prize_type === "vip_asset") {
                                name = prize.vip_asset_once_give + this.assetLabel(prize.vip_asset_type);
                                img = `${this.__imgRoot}points.png`;
                            }
                        }
                        return {
                            name,
                            img,
                            stars: prize?.stars || 1,
                            time: item.created_at ? item.created_at.replace("T", " ").slice(0, 16) : "",
                        };
                    });
                    if (index === 1) {
                        this.myPrizeList = items;
                    } else {
                        this.myPrizeList = this.myPrizeList.concat(items);
                    }
                    this.myPrizePage = index;
                    // 返回条数满一页则认为还有更多（不依赖 total 字段，接口 total 位置不稳定）
                    this.myPrizeHasMore = list.length >= 20;
                    this.myPrizesLoading = false;
                })
                .catch(() => {
                    this.myPrizesLoading = false;
                });
        },
        onRecordsScroll(e) {
            const el = e.target;
            if (!el) return;
            // 距底部 60px 内触发下一页
            if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) {
                if (!this.myPrizesLoading && this.myPrizeHasMore) {
                    this.loadMyPrizes(this.myPrizePage + 1);
                }
            }
        },

        openSingleScratch(card, index) {
            if (card && card.scratched) return;
            if (!this.isLogin) return this.toLogin();
            if (!this.isBindWechat) {
                this.visible = true;
                return;
            }
            // 上次流程异常中断时重置
            if (this.isDrawing && !this.showSingleScratch && !this.showBatchScratch) {
                this.isDrawing = false;
            }
            if (this.isDrawing) return;
            if (this.remainingCount < 1) {
                return this.$message.warning("刮奖次数不足，可签到或使用积分兑换次数");
            }
            this.activeCardIndex = index !== undefined ? index : null;
            this.scratchFinished = false;
            this.currentPrize = null;
            this.drawError = "";
            this.pendingRecord = null;
            this.showSingleScratch = true;
            this.isDrawing = true;
            return goodLucky(this.ID, 1)
                .then(async (res) => {
                    this.remainingCount = Math.max(0, this.remainingCount - 1);
                    this.points = Math.max(0, this.points - this.drawCost(1));
                    this.pendingRecord = { id: res.data?.data.id, times: 1, index: null };
                    const prizes = await this.fetchPrize(this.pendingRecord.id);
                    if (this.disposed) return;
                    this.currentPrize = prizes[0] || this.thanksPrize();
                    this.pendingRecord = null;
                })
                .catch(() => {
                    this.setDrawError();
                });
        },
        async fetchPrize(id) {
            if (!id) throw new Error("缺少抽奖记录 ID");
            for (let count = 0; count < 10; count++) {
                if (this.disposed) throw new Error("页面已关闭");
                const res = await getMyLucky(id);
                if (COMPLETE_STATUS.includes(res.data?.data.status)) {
                    return (res.data?.data.prizes || []).map((item) => this.formatPrize(item));
                }
                await new Promise((resolve) => setTimeout(resolve, 800));
            }
            throw new Error("抽奖结果查询超时");
        },
        formatPrize(item) {
            if (!item) return this.thanksPrize();
            if (item.prize_type === "mall_goods") {
                return {
                    img: normalizeMallImage(item.goods.goods_images[0]),
                    name: item.goods.title,
                    raw: item,
                };
            }
            if (item.prize_type === "vip_asset") {
                return {
                    img: `${this.__appImgRoot}jifen.jpg`,
                    name: item.vip_asset_once_give + this.assetLabel(item.vip_asset_type),
                    raw: item,
                };
            }
            return this.thanksPrize();
        },
        thanksPrize() {
            return { img: `${this.__appImgRoot}miss.jpg`, name: "谢谢惠顾" };
        },
        claimSingle() {
            if (!this.scratchFinished || !this.currentPrize) return;
            this.showSingleScratch = false;
            this.isDrawing = false;
            // 点击「拿下」后，列表卡片才显示奖品
            if (this.activeCardIndex !== null && this.cardList[this.activeCardIndex]) {
                this.cardList[this.activeCardIndex].scratched = true;
                this.cardList[this.activeCardIndex].prize = this.currentPrize;
            }
            this.activeCardIndex = null;
        },
        closeSingleScratch() {
            if (this.scratchFinished) this.claimSingle();
        },

        // 批量刮卡（times 支持数字或分批次数数组）
        openBatchScratch(times, usePoints = false) {
            if (!this.isLogin) return this.toLogin();
            if (!this.isBindWechat) {
                this.visible = true;
                return;
            }
            // 上次流程异常中断时重置
            if (this.isDrawing && !this.showSingleScratch && !this.showBatchScratch) {
                this.isDrawing = false;
            }
            if (this.isDrawing) return;
            const rounds = (Array.isArray(times) ? times : [times]).map((n) => ~~n).filter((n) => n > 0);
            const total = rounds.reduce((sum, n) => sum + n, 0);
            if (!total) return;
            if (usePoints && !this.canDrawNine) return this.$message.warning("魔盒积分不足");
            if (!usePoints && this.remainingCount < total) {
                return this.$message.warning("刮奖次数不足，可签到或使用积分兑换次数");
            }
            this.isDrawing = true;
            this.batchRevealed = false;
            this.drawError = "";
            this.pendingRecord = null;
            this.batchPage = 0;
            this.batchRounds = rounds;
            this.batchTotal = total;
            this.batchDoneRounds = 0;
            this.batchPrizes = new Array(total).fill(null);
            this.showBatchScratch = true;
            this.runBatchRounds(rounds);
        },
        // 每批成功即扣除次数，查询失败不伪造未中奖结果，也不继续消耗积分。
        async runBatchRounds(rounds, startIndex = 0) {
            try {
                for (let i = startIndex; i < rounds.length; i++) {
                    if (this.disposed) return;
                    const res = await goodLucky(this.ID, rounds[i]);
                    this.remainingCount = Math.max(0, this.remainingCount - rounds[i]);
                    this.points = Math.max(0, this.points - this.drawCost(rounds[i]));
                    this.pendingRecord = { id: res.data?.data.id, times: rounds[i], index: i };
                    const prizes = await this.fetchPrize(this.pendingRecord.id);
                    if (this.disposed) return;
                    this.writeBatchRound(i, rounds[i], prizes);
                    this.pendingRecord = null;
                }
            } catch (e) {
                this.setDrawError();
            }
        },
        setDrawError() {
            if (this.disposed) return;
            this.drawError = this.pendingRecord?.id
                ? "结果暂未获取，请重新查询；不会重复抽奖或扣积分。"
                : "抽奖提交状态未确认，请稍后在我的奖品中核对结果。";
            if (!this.pendingRecord?.id) this.pendingRecord = null;
        },
        async retryDrawResult() {
            if (this.retrying || !this.pendingRecord?.id) return;
            const record = this.pendingRecord;
            this.retrying = true;
            try {
                const prizes = await this.fetchPrize(record.id);
                if (this.disposed) return;
                this.drawError = "";
                this.pendingRecord = null;
                if (record.index === null) {
                    this.currentPrize = prizes[0] || this.thanksPrize();
                } else {
                    this.writeBatchRound(record.index, record.times, prizes);
                    // 只查询失败的原记录；成功后再继续尚未提交的后续批次。
                    await this.runBatchRounds(this.batchRounds, record.index + 1);
                }
            } catch (e) {
                this.setDrawError();
            } finally {
                this.retrying = false;
            }
        },
        dismissDrawError() {
            if (!this.drawError || this.retrying) return;
            this.showSingleScratch = false;
            this.showBatchScratch = false;
            this.isDrawing = false;
            this.pendingRecord = null;
            this.drawError = "";
        },
        writeBatchRound(index, times, prizes) {
            const offset = this.batchRounds.slice(0, index).reduce((sum, n) => sum + n, 0);
            const list = (prizes || [])
                .concat(new Array(Math.max(0, times - (prizes || []).length)).fill(null))
                .slice(0, times);
            list.forEach((item, k) => {
                this.batchPrizes[offset + k] = item || this.thanksPrize();
            });
            this.batchDoneRounds = Math.max(this.batchDoneRounds, index + 1);
        },
        claimBatch() {
            if (!this.batchReady || !this.batchRevealed) return;
            if (this.hasNextBatchPage) {
                this.batchPage++;
                this.batchRevealed = false;
                return;
            }
            this.showBatchScratch = false;
            this.isDrawing = false;
            this.refreshCards();
        },
        closeBatchScratch() {
            if (this.batchRevealed) this.claimBatch();
        },
        // 每组最多九次，首组返回即可刮卡，后续组按顺序在后台继续。
        scratchAll() {
            const total = Math.max(0, ~~this.remainingCount);
            const rounds = [];
            for (let left = total; left > 0; left -= 9) {
                rounds.push(Math.min(9, left));
            }
            if (rounds.length) this.openBatchScratch(rounds);
        },

        // 结果
        closeResult() {
            this.showResult = false;
            this.resultPrizes = [];
        },
    },
    beforeUnmount() {
        this.disposed = true;
        document.body.style.overflow = "";
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/lottery/index-app.less";
</style>
