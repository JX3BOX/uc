<template>
    <div class="p-app-lottery" v-loading="loading">
        <!-- 头部 -->
        <header class="m-header">
            <div class="u-back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
            </div>
            <div class="m-title">
                <img class="u-title-img" :src="`${__appImgRoot}title.png`" alt="签到赢大奖" />
                <p>* 每天登录APP签到，即可领刮奖次数~</p>
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
                    :disabled="isSignedIn"
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
                    {{ showDetail ? "收起" : "奖池详情" }}
                    <i class="el-icon-arrow-down" :class="{ 'is-up': showDetail }"></i>
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
                <div class="m-detail-item" v-for="(item, index) in previewList" :key="index">
                    <div class="u-img-wrap"><img :src="item.img" :alt="item.name" /></div>
                    <div class="u-info">
                        <div class="u-row">
                            <span class="u-name">{{ item.name }}</span>
                            <div class="u-stars">
                                <img v-for="n in item.stars || 1" :key="n" :src="starIcon(index)" class="u-star-icon" />
                            </div>
                        </div>
                        <p class="u-rate">中奖率：{{ item.rate || "0.0" }}%</p>
                        <p class="u-desc">{{ item.desc || "奖品介绍" }}</p>
                    </div>
                </div>
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
            <span class="u-rule" @click="showRules = true">规则说明</span>
            <span class="u-tip">请选择一张刮刮卡</span>
            <span class="u-refresh" @click="refreshCards"><i class="el-icon-refresh"></i> 换一批</span>
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
            <button class="u-action" :disabled="remainingCount < 9 || isDrawing" @click="openBatchScratch(9)">
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
                <div
                    ref="scratchStage"
                    class="m-scratch-stage"
                    @touchstart.prevent="onScratchStart"
                    @touchmove.prevent="onScratchMove"
                    @touchend="onScratchEnd"
                    @mousedown.prevent="onScratchStart"
                    @mousemove.prevent="onScratchMove"
                    @mouseup="onScratchEnd"
                    @mouseleave="onScratchEnd"
                >
                    <div
                        class="u-cover"
                        :class="{ 'is-hidden': scratchReady }"
                        :style="{ backgroundImage: `url(${__appImgRoot}card-mini.jpg)` }"
                    ></div>
                    <canvas
                        ref="scratchCanvas"
                        class="u-scratch-canvas"
                        :class="{ 'is-done': scratchFinished }"
                    ></canvas>
                    <div class="u-prize-reveal" v-if="currentPrize">
                        <div class="u-prize-card">
                            <img :src="currentPrize.img" />
                            <span>{{ currentPrize.name }}</span>
                        </div>
                    </div>
                </div>
                <p class="u-scratch-tip" v-if="!scratchFinished">用手刮开看看吧！</p>
                <button class="u-confirm-btn" v-else @click="claimSingle">拿下!</button>
            </div>
        </div>

        <!-- 连刮/全部刮开弹层 -->
        <div class="m-overlay" v-if="showBatchScratch" @click.self="closeBatchScratch">
            <div class="m-batch-dialog">
                <p class="u-batch-tip" v-if="!batchRevealed">点击任意位置刮开</p>
                <div class="m-batch-grid" :class="{ 'is-revealed': batchRevealed }" @click="revealBatch">
                    <div class="m-batch-card" v-for="(item, index) in batchPrizes" :key="index">
                        <div
                            class="u-cover"
                            v-if="!batchRevealed"
                            :style="{ backgroundImage: `url(${__appImgRoot}card-mini.jpg)` }"
                        ></div>
                        <div class="u-result" v-else>
                            <img :src="item.img" />
                            <span>{{ item.name }}</span>
                        </div>
                    </div>
                </div>
                <button class="u-confirm-btn" v-if="batchRevealed" @click="claimBatch">拿下！</button>
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
        <div
            class="m-page m-page-prizes"
            v-if="page === 'prizes'"
            v-loading="myPrizesLoading && !myPrizeList.length"
        >
            <header class="m-header">
                <div class="u-back" @click="page = 'home'">
                    <i class="el-icon-arrow-left"></i>
                </div>
                <div class="m-title">
                    <img :src="`${__appImgRoot}title.png`" class="u-title-img" />
                    <p>* 每天登录APP签到，即可领刮奖次数~</p>
                </div>
            </header>
            <div class="m-prize-records">
                <h3 class="m-section-title-2">我的奖品</h3>
                <div class="m-record-list" @scroll="onRecordsScroll">
                    <div
                        class="m-record-item"
                        :class="{ 'is-top': activeRecordIndex === index }"
                        v-for="(item, index) in myPrizeList"
                        :key="index"
                        @click="activeRecordIndex = activeRecordIndex === index ? null : index"
                    >
                        <div class="u-img-wrap"><img :src="item.img" /></div>
                        <div class="u-info">
                            <div class="u-row">
                                <span class="u-name">{{ item.name }}</span>
                                <div class="u-stars">
                                    <img
                                        v-for="n in item.stars || 1"
                                        :key="n"
                                        :src="`${__appImgRoot}star${activeRecordIndex === index ? 2 : 1}.svg`"
                                        class="u-star-icon"
                                    />
                                </div>
                            </div>
                            <p class="u-time">获得时间：{{ item.time }}</p>
                        </div>
                    </div>
                    <div class="u-records-tip" v-if="myPrizesLoading">加载中...</div>
                    <div class="u-records-tip" v-else-if="myPrizeList.length && !myPrizeHasMore">
                        没有更多了
                    </div>
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
import bindWechat from "./bindWechat.vue";
import User from "@jx3box/jx3box-common/js/user";
import { getBreadcrumb, getConfig } from "@/service/vip/cms";
import { getBlindBox, goodLucky, getMyLucky, getLuckyConfig, getMyInfo, getMyHistory } from "@/service/vip/lottery";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { normalizeMallImage } from "@/utils/mallImage";
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
            scratchFinished: false,
            scratchReady: false,
            lastScratchPos: null,
            touchScratching: false,
            scratchCtx: null,
            isScratching: false,
            scratchThreshold: 45,
            isRefreshing: false,

            batchPrizes: [],
            batchRevealed: false,
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
    components: { bindWechat },
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
            return this.costPerTime ? Math.floor(this.points / this.costPerTime) : 0;
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
                val && this.myPoints();
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
    mounted() {
        this.init();
        this.loadUser();
        this.buildCards();
    },
    methods: {
        normalizeMallImage,
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
                    this.remainingCount = data.max_try_count - data.has_try_count || 0;
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
        buildCards() {
            this.cardList = new Array(6).fill(0).map((_, i) => ({
                no: String(9999999999 - i),
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
            if (this.isSignedIn) return;
            // TODO: 接入签到接口
            this.isSignedIn = true;
            this.remainingCount += 1;
            this.$message.success("签到成功，获得 1 次刮奖机会");
        },
        openExchange() {
            if (!this.isLogin) return this.toLogin();
            this.showExchange = true;
        },
        exchange(times) {
            const cost = this.costPerTime * times;
            if (this.points < cost) {
                return this.$message.error("魔盒积分不足");
            }
            // TODO: 接入积分兑换次数接口
            this.points -= cost;
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
            this.scratchReady = false;
            this.currentPrize = null;
            this.showSingleScratch = true;
            this.isDrawing = true;
            goodLucky(this.ID, 1).then((res) => {
                const _id = res.data?.data.id;
                this.fetchPrize(_id, (prizes) => {
                    this.currentPrize = prizes[0] || this.thanksPrize();
                    this.$nextTick(() => {
                        this.initScratchCanvas();
                    });
                });
            });
        },
        fetchPrize(id, cb) {
            if (!id) return;
            let count = 0;
            const timer = setInterval(() => {
                getMyLucky(id).then((res) => {
                    if (count > 8) {
                        clearInterval(timer);
                        cb && cb([this.thanksPrize()]);
                        return;
                    }
                    if (COMPLETE_STATUS.indexOf(res.data?.data.status) !== -1) {
                        clearInterval(timer);
                        const prizes = (res.data?.data.prizes || []).map((item) => this.formatPrize(item));
                        cb && cb(prizes);
                    }
                    count++;
                });
            }, 800);
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
        initScratchCanvas() {
            const canvas = this.$refs.scratchCanvas;
            if (!canvas) return;
            let rect = canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) {
                rect = { width: 280, height: 340 };
            }
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const ctx = canvas.getContext("2d");
            // 统一使用物理像素坐标，不做 dpr scale，避免坐标系错乱

            // 第一时间填充纯色刮层，立即可刮（起始位置即手指按下位置）
            ctx.fillStyle = "#9c8af0";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "destination-out";
            this.scratchCtx = ctx;

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = `${this.__appImgRoot}card-mini.jpg`;
            img.onload = () => {
                // 保存当前刮痕（纯色未刮区 alpha=1，已刮区 alpha=0）作为 mask
                const temp = document.createElement("canvas");
                temp.width = canvas.width;
                temp.height = canvas.height;
                const tctx = temp.getContext("2d");
                tctx.drawImage(canvas, 0, 0);

                // 清空主 canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // 普通模式绘制完整图片（物理尺寸铺满）
                ctx.globalCompositeOperation = "source-over";
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // destination-in：按刮痕 alpha 裁出（已刮区域透明，露出奖品）
                ctx.globalCompositeOperation = "destination-in";
                ctx.drawImage(temp, 0, 0);

                // 恢复刮卡擦除模式
                ctx.globalCompositeOperation = "destination-out";
                this.scratchCtx = ctx;
                this.scratchReady = true;
            };
            img.onerror = () => {
                // 加载失败填充纯色刮层，仍可正常刮卡
                ctx.fillStyle = "#9c8af0";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "destination-out";
                this.scratchCtx = ctx;
                this.scratchReady = true;
            };
        },
        getScratchPos(e) {
            const canvas = this.$refs.scratchCanvas;
            const el = canvas || this.$refs.scratchStage;
            if (!el) return { x: 0, y: 0 };
            const rect = el.getBoundingClientRect();
            // 动态比例：canvas 物理像素 / CSS 渲染像素。
            // 不依赖固定 dpr，对页面 zoom / 非整数 dpr / transform 一律精确。
            const scaleX = canvas && rect.width ? canvas.width / rect.width : 1;
            const scaleY = canvas && rect.height ? canvas.height / rect.height : 1;
            // 统一使用 clientX/clientY（触摸/鼠标都有一致的视口坐标）
            const touch = e.touches && e.touches.length ? e.touches[0] : null;
            const cx = touch ? touch.clientX : e.clientX;
            const cy = touch ? touch.clientY : e.clientY;
            return {
                x: (cx - rect.left) * scaleX,
                y: (cy - rect.top) * scaleY,
            };
        },
        onScratchStart(e) {
            if (this.scratchFinished) return;
            // 触摸后浏览器会补发模拟 mousedown，忽略它避免起点被重画到错误位置
            if (e.type === "mousedown" && this.touchScratching) return;
            if (e.type === "touchstart") this.touchScratching = true;
            const pos = this.getScratchPos(e);
            this.lastScratchPos = pos;
            this.isScratching = true;
            if (!this.scratchCtx) return;
            this.scratch(this.scratchCtx, pos.x, pos.y, pos.x, pos.y);
        },
        onScratchMove(e) {
            if (!this.isScratching || !this.scratchCtx || this.scratchFinished) return;
            const pos = this.getScratchPos(e);
            const last = this.lastScratchPos || pos;
            this.scratch(this.scratchCtx, last.x, last.y, pos.x, pos.y);
            this.lastScratchPos = pos;
        },
        onScratchEnd(e) {
            if (e.type === "touchend") this.touchScratching = false;
            if (!this.isScratching) return;
            this.isScratching = false;
            this.lastScratchPos = null;
            this.checkScratchProgress();
        },
        scratch(ctx, x0, y0, x1, y1) {
            const canvas = this.$refs.scratchCanvas;
            const rect = canvas ? canvas.getBoundingClientRect() : null;
            const scale = canvas && rect && rect.width ? canvas.width / rect.width : 1;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 48 * scale;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        },
        checkScratchProgress() {
            const canvas = this.$refs.scratchCanvas;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparent = 0;
            for (let i = 3; i < pixels.length; i += 4 * 10) {
                if (pixels[i] === 0) transparent++;
            }
            const total = pixels.length / 4 / 10;
            const percent = (transparent / total) * 100;
            if (percent > this.scratchThreshold) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                this.scratchFinished = true;
            }
        },
        claimSingle() {
            this.showSingleScratch = false;
            this.remainingCount = Math.max(0, this.remainingCount - 1);
            this.isDrawing = false;
            // 点击「拿下」后，列表卡片才显示奖品
            if (this.activeCardIndex !== null && this.cardList[this.activeCardIndex]) {
                this.cardList[this.activeCardIndex].scratched = true;
                this.cardList[this.activeCardIndex].prize = this.currentPrize;
            }
            this.activeCardIndex = null;
        },
        closeSingleScratch() {
            if (this.isDrawing && !this.scratchFinished) return;
            this.showSingleScratch = false;
            this.isDrawing = false;
        },

        // 批量刮卡
        openBatchScratch(times) {
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
            if (this.remainingCount < times) {
                return this.$message.warning("刮奖次数不足，可签到或使用积分兑换次数");
            }
            this.isDrawing = true;
            this.batchRevealed = false;
            this.batchPrizes = new Array(times).fill(null);
            this.showBatchScratch = true;
            goodLucky(this.ID, times).then((res) => {
                const _id = res.data?.data.id;
                this.fetchPrize(_id, (prizes) => {
                    this.batchPrizes = prizes
                        .concat(new Array(Math.max(0, times - prizes.length)).fill(null))
                        .slice(0, times);
                });
            });
        },
        revealBatch() {
            if (this.batchRevealed) return;
            this.batchRevealed = true;
        },
        claimBatch() {
            this.showBatchScratch = false;
            this.resultPrizes = this.batchPrizes.filter(Boolean);
            this.showResult = true;
            this.remainingCount = Math.max(0, this.remainingCount - this.batchPrizes.length);
            this.isDrawing = false;
            this.refreshCards();
        },
        closeBatchScratch() {
            if (this.isDrawing && !this.batchRevealed) return;
            this.showBatchScratch = false;
            this.isDrawing = false;
        },
        scratchAll() {
            this.openBatchScratch(Math.min(this.remainingCount, 9));
        },

        // 结果
        closeResult() {
            this.showResult = false;
            this.resultPrizes = [];
        },
    },
    beforeUnmount() {
        clearInterval(this.prizesInterval);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/lottery/index-app.less";
</style>
