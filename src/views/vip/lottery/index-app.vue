<template>
    <div class="p-app-lottery" v-loading="loading">
        <!-- 头部 -->
        <header class="m-header">
            <span class="u-edition">
                <img class="u-edition-star" :src="`${__appImgRoot}star1.svg`" alt="" aria-hidden="true" />
                {{ editionLabel }}
            </span>
            <!-- <div class="u-back" @click="goBack">
                <i class="el-icon-arrow-left"></i>
            </div> -->
            <div class="m-title">
                <img class="u-title-img" :src="`${__appImgRoot}title.png`" alt="签到赢大奖" />
                <p>* 每天登录APP签到，兑换刮奖次数~</p>
            </div>
        </header>

        <!-- 状态卡 -->
        <section class="m-status-card">
            <div class="m-count">
                <img class="u-icon" :src="`${__appImgRoot}cishu.jpg`" alt="用户积分" />
                <div class="u-text">
                    <span class="u-label">当前积分</span>
                    <span class="u-num">{{ points }}</span>
                </div>
            </div>
            <div class="m-actions">
                <button
                    class="u-btn"
                    :class="showSignedIn ? 'is-signed' : 'is-unsigned'"
                    @click="!mockUnsigned && handleSign()"
                    :disabled="!mockUnsigned && isLogin"
                >
                    <span>{{ showSignedIn ? "今日已签到" : "今日未签到" }}</span>
                    <span v-if="!showSignedIn" class="u-sign-sparkles" aria-hidden="true">
                        <span v-for="n in 3" :key="n" class="u-sign-star">✦</span>
                    </span>
                </button>
            </div>
        </section>

        <!-- 本期奖池 -->
        <section class="m-prize-pool" v-show="canParticipate">
            <div class="m-section-title">
                <span>本期奖池</span>
                <span class="u-more" @click="showDetail = true">
                    <i class="el-icon-arrow-right"></i>
                    奖池详情
                </span>
            </div>

            <!-- 奖池缩略（走马灯） -->
            <div
                class="m-prize-list"
                @pointerdown="startPrizeDrag"
                @pointermove="movePrizeDrag"
                @pointerup="endPrizeDrag"
                @pointercancel="endPrizeDrag"
                @lostpointercapture="endPrizeDrag"
                @wheel="scrollPrizesByWheel"
                @dragstart.prevent
                @click.capture="guardPrizeClick"
            >
                <div ref="prizeTrack" class="m-prize-track" :style="{ transform: `translateX(${-prizeOffset}px)` }">
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

            <!-- 奖池详情抽屉 -->
            <Transition name="prize-records">
                <div class="m-overlay m-records-overlay" v-if="showDetail" @click.self="showDetail = false" @keydown.esc="showDetail = false">
                    <div class="m-prize-records" role="dialog" aria-modal="true" aria-label="奖池详情">
                        <div class="m-records-heading">
                            <h3 class="m-section-title-2">奖池详情</h3>
                            <button class="u-close-records" type="button" aria-label="关闭奖池详情" @click="showDetail = false">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                            </button>
                        </div>
                        <div class="m-prize-detail m-pool-detail">
                            <PrizeDetailItem
                                v-for="(item, index) in previewList"
                                :key="index"
                                :item="item"
                                :is-active="index === 0"
                                hide-duplicate-description
                                @click="selectPrize(item, index)"
                            />
                        </div>
                    </div>
                </div>
            </Transition>

            <!-- 奖品详情弹窗 -->
            <Transition name="prize-detail">
                <div class="m-overlay" v-if="activePrize" @click.self="closePrizeDetail">
                    <div class="m-prize-dialog">
                        <div class="u-img-wrap"><img :src="activePrize.img" :alt="activePrize.name" /></div>
                        <h3>{{ activePrize.name }}</h3>
                        <p class="u-rate">中奖率：{{ activePrize.rate || "0.0" }}%</p>
                        <p class="u-desc">{{ activePrize.desc || "奖品介绍" }}</p>
                        <button class="u-confirm-btn" @click="closePrizeDetail">知道了</button>
                    </div>
                </div>
            </Transition>
        </section>

        <section v-if="!canParticipate" class="m-activity-notice" role="status">
            <div class="u-notice-emblem" aria-hidden="true">
                <img :src="`${__appImgRoot}star1.svg`" alt="" />
                <span>✦</span>
            </div>
            <h3>活动暂未开始</h3>
            <p>活动筹备中，请稍后再来</p>
        </section>

        <!-- 规则提示 -->
        <div class="m-rules-bar" v-if="canParticipate">
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
        <section v-if="canParticipate" class="m-card-grid" :class="{ 'is-refreshing': isRefreshing }">
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
            <button
                class="u-action u-action-primary"
                :disabled="!isLogin || drawableCount < 1 || isDrawing"
                @click="openDrawAll"
            >
                全部刮完<span class="u-count">(可刮{{ displayDrawableCount }}次)</span>
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

        <!-- 全部刮完 Action Sheet -->
        <Transition name="draw-options">
        <div class="m-overlay" v-if="showDrawAll" @click.self="showDrawAll = false">
            <div class="m-action-sheet">
                <h3>积分抽奖</h3>
                <p>您当前有 {{ points }} 积分，可抽取 {{ drawableCount }} 次。</p>

                <div class="m-exchange-options">
                    <button class="u-option u-option-primary" :disabled="!canDrawNine" @click="drawNineTimes">
                        抽取 9 次({{ nineDrawCost }} 积分)
                    </button>
                    <button class="u-option u-option-primary" :disabled="drawableCount < 1" @click="drawAllTimes">
                        全部抽取({{ points }} 积分)
                    </button>
                    <button class="u-option" @click="showDrawAll = false">暂不抽取</button>
                </div>
            </div>
        </div>
        </Transition>

        <!-- 规则说明 -->
        <div class="m-overlay m-rules-overlay" v-if="showRules" @click.self="showRules = false">
            <div class="m-rules-dialog">
                <h3>规则说明</h3>
                <div class="u-rules-content" v-html="info || '暂无规则说明'"></div>
                <button class="u-confirm-btn" @click="showRules = false">我已知晓</button>
            </div>
        </div>

        <!-- 我的奖品 -->
        <Transition name="prize-records">
        <div class="m-overlay m-records-overlay" v-if="page === 'prizes'" @click.self="page = 'home'" @keydown.esc="page = 'home'">
            <div class="m-prize-records" role="dialog" aria-modal="true" aria-label="我的奖品">
                <div class="m-records-heading">
                    <h3 class="m-section-title-2">我的奖品</h3>
                    <button class="u-close-records" type="button" aria-label="关闭我的奖品" @click="page = 'home'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                    </button>
                </div>
                <div class="m-prize-detail" :aria-busy="myPrizesLoading" @scroll="onRecordsScroll">
                    <el-skeleton v-if="myPrizesLoading && !myPrizeList.length" animated :count="5" aria-label="正在加载奖品">
                        <template #template>
                            <div class="m-detail-item m-record-skeleton">
                                <div class="u-img-wrap"><el-skeleton-item variant="image" class="u-skeleton-image" /></div>
                                <div class="u-info">
                                    <el-skeleton-item variant="text" class="u-skeleton-name" />
                                    <el-skeleton-item variant="text" class="u-skeleton-time" />
                                </div>
                            </div>
                        </template>
                    </el-skeleton>
                    <PrizeDetailItem
                        v-for="(item, index) in myPrizeList"
                        :key="index"
                        :item="{ ...item, desc: `获得时间：${item.time || ''}` }"
                        :meta="item.meta"
                        :show-rate="false"
                        :is-active="activeRecordIndex === index"
                        @click="activeRecordIndex = activeRecordIndex === index ? null : index"
                    />
                    <div class="u-records-tip" v-if="myPrizesLoading && myPrizeList.length">加载中...</div>
                    <div class="u-records-tip" v-else-if="myPrizeList.length && !myPrizeHasMore">没有更多了</div>
                    <div class="u-records-tip" v-else-if="!myPrizesLoading && !myPrizeList.length">暂无奖品</div>
                </div>
            </div>
        </div>
        </Transition>

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
            // 点击「全部刮完」后锁定的总次数，抽奖期间不再重算
            lockedDrawTotal: null,
            isSignedIn: false,
            loading: false,
            user: {},

            showDetail: false,
            showExchange: false,
            showDrawAll: false,
            showRules: false,
            showSingleScratch: false,
            showBatchScratch: false,
            showResult: false,
            page: "home",

            prizeOffset: 0,
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
            activityMessage: "",
            activityStart: null,
            activityEnd: null,
            visible: false,
            isDrawing: false,
        };
    },
    components: { bindWechat, ScratchSurface, PrizeDetailItem },
    computed: {
        mockUnsigned() {
            return process.env.NODE_ENV === "development" && this.$route.query.mockSign === "unsigned";
        },
        showSignedIn() {
            return !this.mockUnsigned && this.isSignedIn;
        },
        canParticipate() {
            return this.event_status && !this.activityMessage && this.costPerTime > 0;
        },
        editionLabel() {
            const now = new Date();
            return `${now.getFullYear()}年${now.getMonth() + 1}月辑`;
        },
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
            // 单次抽奖消耗的积分：取次数最小的档位（通常是 1 次档），不依赖档位数组顺序
            const tiers = (this.draw || [])
                .map((item) => [~~item[0], Number(item[1])])
                .filter(([count]) => count > 0)
                .sort((a, b) => a[0] - b[0]);
            return tiers.length ? tiers[0][1] : 0;
        },
        exchangeableCount() {
            return this.costPerTime ? Math.max(0, Math.floor(this.points / this.costPerTime) - this.remainingCount) : 0;
        },
        nineDrawCost() {
            return this.drawCost(9);
        },
        canDrawNine() {
            return this.canParticipate && this.isLogin && this.nineDrawCost > 0 && this.points >= this.nineDrawCost;
        },
        // 当前积分可直接抽取的次数（按「单次抽奖消耗的积分」换算，不按批量档位换算）
        drawableCount() {
            return this.canParticipate ? Math.floor(this.points / this.costPerTime) : 0;
        },
        // 全部刮完的展示次数：已锁定时用锁定值，抽奖过程中不随积分变化
        displayDrawableCount() {
            return this.lockedDrawTotal !== null ? this.lockedDrawTotal : this.drawableCount;
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
                this.showDrawAll ||
                this.showRules ||
                this.showDetail ||
                this.page === "prizes" ||
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
        this.startPrizeAutoScroll();
    },
    methods: {
        prizeLoopWidth() {
            const track = this.$refs.prizeTrack;
            const firstCopy = track?.children[this.previewList.length];
            return firstCopy ? firstCopy.offsetLeft - track.children[0].offsetLeft : 0;
        },
        shiftPrizes(distance) {
            const width = this.prizeLoopWidth();
            if (width) this.prizeOffset = ((this.prizeOffset + distance) % width + width) % width;
        },
        startPrizeAutoScroll() {
            let previous = 0;
            const tick = (now) => {
                const elapsed = previous ? Math.min(now - previous, 50) : 0;
                previous = now;
                if (!this.prizeDrag && !this.hasOverlay && !this.showDetail && now >= (this.prizeResumeAt || 0)) {
                    this.shiftPrizes(this.prizeLoopWidth() * elapsed / 30000);
                }
                this.prizeAnimationFrame = requestAnimationFrame(tick);
            };
            this.prizeAnimationFrame = requestAnimationFrame(tick);
        },
        startPrizeDrag(event) {
            if (!event.isPrimary || event.button !== 0) return;
            this.prizeDrag = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, horizontal: false };
        },
        movePrizeDrag(event) {
            const drag = this.prizeDrag;
            if (!drag || drag.id !== event.pointerId) return;
            const dx = event.clientX - drag.x;
            const dy = event.clientY - drag.y;
            if (!drag.horizontal) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
                if (Math.abs(dy) >= Math.abs(dx)) {
                    this.endPrizeDrag(event);
                    return;
                }
                drag.horizontal = true;
                event.currentTarget.setPointerCapture(event.pointerId);
            }
            this.shiftPrizes(drag.lastX - event.clientX);
            drag.lastX = event.clientX;
        },
        endPrizeDrag(event) {
            // Touch starts with implicit capture on the image/card. Ignore its
            // bubbling capture-loss event when capture moves to the list.
            if (event.type === "lostpointercapture" && event.target !== event.currentTarget) return;
            const drag = this.prizeDrag;
            if (!drag || drag.id !== event.pointerId) return;
            if (drag.horizontal) this.prizeSuppressClickUntil = performance.now() + 350;
            this.prizeDrag = null;
            this.prizeResumeAt = performance.now() + 1000;
        },
        scrollPrizesByWheel(event) {
            const delta = event.shiftKey && !event.deltaX ? event.deltaY : event.deltaX;
            if (!delta || (!event.shiftKey && Math.abs(event.deltaY) > Math.abs(delta))) return;
            event.preventDefault();
            const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? event.currentTarget.clientWidth : 1;
            this.shiftPrizes(delta * unit);
            this.prizeResumeAt = performance.now() + 1000;
        },
        guardPrizeClick(event) {
            if (performance.now() < (this.prizeSuppressClickUntil || 0)) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
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
        async init() {
            this.loading = true;
            try {
                const res = await getLuckyConfig();
                const status = !!~~res.data?.data?.val;
                if (status && !User.isTeammate()) {
                    this.event_status = false;
                    this.activityMessage = "抽奖活动暂未开放";
                    return;
                }
                await this.LoadId();
            } catch {
                this.activityMessage = "活动暂不可用，请稍后刷新重试";
            } finally {
                this.loading = false;
            }
        },
        async LoadId() {
            const res = await getConfig({ key: "lottery_ID" });
            this.blindboxID = res.val;
            if (!this.ID) {
                this.activityMessage = "抽奖活动暂未开放";
                return;
            }
            const results = await Promise.allSettled([
                getBreadcrumb("lottery_info"),
                getBreadcrumb(`lottery_odds_${this.ID}`),
                getBreadcrumb(`lottery_gift_status_${this.ID}`),
            ]);
            if (results[0].status === "fulfilled") this.info = results[0].value;
            if (results[1].status === "fulfilled") this.odds = results[1].value;
        },
        load() {
            this.activityMessage = "活动加载中，请稍候";
            return getBlindBox(this.ID, { mute: true })
                .then((res) => {
                    const data = res.data.data;
                    this.activityStart = data.start_time;
                    this.activityEnd = data.end_time;
                    this.activityMessage = "";
                    this.checkActivityTime();
                    this.draw = data.allow_once_try_count.map((count, i) => [
                        count,
                        data.allow_once_try_count_cost_points[i],
                    ]);
                    this.previewList = this.setPrizeList(data);
                    if (!this.costPerTime && !this.activityMessage) this.activityMessage = "抽奖活动暂未开放";
                    // 可刮次数仅由本次页面的积分兑换产生，不恢复历史缓存或活动总额度。
                    const userLevelLimit = data.user_level_limit;
                    const userLevel = User.getLevel(this.user.experience);
                    if (userLevelLimit > userLevel) {
                        this.$alert("您的等级不足，无法参与活动", "活动不可用", { type: "error" });
                    }
                })
                .catch((error) => {
                    this.draw = [];
                    this.previewList = [];
                    this.activityMessage = this.activityErrorMessage(error) || "活动暂不可用，请稍后刷新重试";
                });
        },
        activityErrorMessage(error) {
            const data = error?.response?.data || error?.data || {};
            if (Number(data.code) === 61000) return "抽奖活动尚未开始，敬请期待";
            if (Number(data.code) === 61001 && /抽奖活动/.test(data.msg || data.message || "")) {
                return /未上线/.test(data.msg || data.message) ? "抽奖活动暂未开放" : "本期抽奖活动已结束";
            }
            return "";
        },
        checkActivityTime() {
            const now = Date.now();
            const parseTime = (value) => value ? new Date(String(value).replace(" ", "T")).getTime() : NaN;
            if (parseTime(this.activityStart) > now) this.activityMessage = "抽奖活动尚未开始，敬请期待";
            else if (parseTime(this.activityEnd) < now) this.activityMessage = "本期抽奖活动已结束";
            return this.canParticipate;
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
        // 抽奖记录状态文案（取值判定沿用 history.vue：2 视为已发放 / 3 未中奖）
        prizeStatusText(status) {
            const map = { 2: "已发放", 3: "未中奖" };
            return map[Number(status)] || "处理中";
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
        // 展开每条记录的全部奖品（一次连刮 = 一条记录含多个奖品），并过滤掉空奖/谢谢惠顾
        mapMyPrizeItems(list) {
            const items = [];
            list.forEach((item) => {
                const time = item.created_at ? item.created_at.replace("T", " ").slice(0, 16) : "";
                const meta = this.prizeStatusText(item.status);
                const prizes = Array.isArray(item.prizes)
                    ? item.prizes
                    : item.prizes
                    ? [item.prizes]
                    : [];
                prizes.forEach((prize) => {
                    let name = "";
                    let img = `${this.__imgRoot}thanks.png`;
                    if (prize.prize_type === "mall_goods") {
                        name = prize.goods?.title || "";
                        img = normalizeMallImage(prize.goods?.goods_images?.[0]);
                    } else if (prize.prize_type === "vip_asset") {
                        name = prize.vip_asset_once_give + this.assetLabel(prize.vip_asset_type);
                        img = `${this.__imgRoot}points.png`;
                    }
                    // 未中奖（谢谢惠顾）不进入我的奖品列表
                    if (!name) return;
                    items.push({
                        name,
                        img,
                        stars: prize?.stars || 1,
                        time,
                        meta,
                    });
                });
            });
            return items;
        },
        async loadMyPrizes(index = 1) {
            if (this.myPrizesLoading) return;
            this.myPrizesLoading = true;
            try {
                let cursor = index;
                let hasMore = false;
                let items = [];
                // 过滤掉空奖后整页可能为空，继续往后取，避免出现空白列表
                for (let attempt = 0; attempt < 5; attempt++) {
                    const res = await getMyHistory({ index: cursor, pageSize: 20 });
                    const data = res.data?.data || {};
                    const list = data.list || [];
                    // 返回条数满一页则认为还有更多（不依赖 total 字段，接口 total 位置不稳定）
                    hasMore = list.length >= 20;
                    items = this.mapMyPrizeItems(list);
                    if (items.length || !hasMore) break;
                    cursor++;
                }
                this.myPrizeList = index === 1 ? items : this.myPrizeList.concat(items);
                this.myPrizePage = cursor;
                this.myPrizeHasMore = hasMore;
            } catch (e) {
                // 静默失败，保留已有列表
            } finally {
                this.myPrizesLoading = false;
            }
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
            if (!this.checkActivityTime()) return;
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
            if (this.points < this.costPerTime) {
                return this.$message.warning("魔盒积分不足");
            }
            this.activeCardIndex = index !== undefined ? index : null;
            this.scratchFinished = false;
            this.currentPrize = null;
            this.drawError = "";
            this.pendingRecord = null;
            this.showSingleScratch = true;
            this.isDrawing = true;
            // 单次抽取沿用 index.vue 的接口：goodLucky(ID, 1)
            return goodLucky(this.ID, 1, { mute: true })
                .then(async (res) => {
                    // 取消积分兑换次数后，直接用服务端积分余额
                    this.myPoints();
                    this.pendingRecord = { id: res.data?.data.id, times: 1, index: null };
                    const prizes = await this.fetchPrize(this.pendingRecord.id);
                    if (this.disposed) return;
                    this.currentPrize = prizes[0] || this.thanksPrize();
                    this.pendingRecord = null;
                })
                .catch((error) => {
                    this.setDrawError(error);
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
            if (!this.checkActivityTime()) return;
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
            const totalCost = rounds.reduce((sum, count) => sum + this.drawCost(count), 0);
            if (usePoints && (totalCost <= 0 || this.points < totalCost)) return this.$message.warning("魔盒积分不足");
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
                    const res = await goodLucky(this.ID, rounds[i], { mute: true });
                    this.remainingCount = Math.max(0, this.remainingCount - rounds[i]);
                    this.pendingRecord = { id: res.data?.data.id, times: rounds[i], index: i };
                    const prizes = await this.fetchPrize(this.pendingRecord.id);
                    if (this.disposed) return;
                    this.writeBatchRound(i, rounds[i], prizes);
                    this.pendingRecord = null;
                    // 每批结束后刷新服务端积分余额（含中奖积分累加），不做本地估算
                    this.myPoints();
                }
                if (this.disposed) return;
                // 本轮次数全部抽取完毕：解除次数锁定，按最新积分重算可全部刮完的次数
                this.lockedDrawTotal = null;
                this.myPoints();
            } catch (e) {
                this.setDrawError(e);
            }
        },
        // 抽奖失败：不留中间态、不重试，直接关闭刮卡流程并刷新当前抽奖页面
        setDrawError(error) {
            if (this.disposed) return;
            const activityMessage = this.activityErrorMessage(error);
            if (activityMessage && !this.pendingRecord?.id) {
                this.activityMessage = activityMessage;
                this.showDrawAll = false;
                this.reloadDrawPage();
                return;
            }
            const hasRecord = !!this.pendingRecord?.id;
            this.reloadDrawPage(
                hasRecord
                    ? "抽奖结果获取失败，页面已刷新；如已扣费请到「我的奖品」查看结果。"
                    : "抽奖失败，页面已刷新；稍后可到「我的奖品」核对结果。"
            );
        },
        // 重置刮卡会话状态，并重新拉取页面数据（积分、用户信息、卡片）
        reloadDrawPage(message) {
            this.showSingleScratch = false;
            this.showBatchScratch = false;
            this.isDrawing = false;
            this.scratchFinished = false;
            this.currentPrize = null;
            this.drawError = "";
            this.pendingRecord = null;
            this.activeCardIndex = null;
            this.activeRecordIndex = null;
            this.batchRounds = [];
            this.batchPrizes = [];
            this.batchRevealed = false;
            this.batchDoneRounds = 0;
            this.batchPage = 0;
            // 本页预留的刮奖次数作废，可刮次数以服务端积分重新计算
            this.remainingCount = 0;
            this.lockedDrawTotal = null;
            this.myPoints();
            this.loadUser();
            this.buildCards();
            if (message) this.$message.error(message);
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
            // 全部批次结束后再同步一次积分余额
            this.myPoints();
            this.refreshCards();
        },
        closeBatchScratch() {
            if (this.batchRevealed) this.claimBatch();
        },
        // 底部「全部刮完」：打开抽取选择弹窗
        openDrawAll() {
            if (!this.checkActivityTime()) return;
            if (this.isDrawing) return;
            if (!this.isLogin) return this.toLogin();
            if (!this.isBindWechat) {
                this.visible = true;
                return;
            }
            if (this.drawableCount < 1) return this.$message.warning("魔盒积分不足");
            this.showDrawAll = true;
        },
        // 弹窗内「抽取 9 次」：提交 9 次并沿用活动档位价
        drawNineTimes() {
            if (this.isDrawing) return;
            if (!this.canDrawNine) return this.$message.warning("魔盒积分不足");
            this.showDrawAll = false;
            this.openBatchScratch(9, true);
        },
        // 弹窗内「全部抽取」：二次确认后，次数按「单次抽奖消耗的积分」换算并按档位分批提交
        async drawAllTimes() {
            if (!this.checkActivityTime()) return;
            if (this.isDrawing) return;
            const total = this.drawableCount;
            if (!total) return this.$message.warning("魔盒积分不足");
            const rounds = this.buildDrawRounds(total);
            if (!rounds.length) return;
            try {
                await this.$confirm(
                    `将消耗全部 ${this.points} 积分，不可撤回。是否继续？`,
                    "确认消耗全部积分",
                    {
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        type: "warning",
                        closeOnClickModal: false,
                    }
                );
            } catch {
                // 取消时保留选择弹窗，可继续选择其他方式
                return;
            }
            if (this.disposed || this.isDrawing) return;
            this.showDrawAll = false;
            // 点击即锁定次数：抽奖过程中即使积分变化，本轮次数与档位组合也不再改变
            this.lockedDrawTotal = total;
            this.openBatchScratch(rounds, true);
        },
        // 按活动档位（如 10 / 5 / 1 次）由大到小贪心拆分总次数，保证每批提交的都是合法档位次数
        buildDrawRounds(total) {
            const tiers = (this.draw || [])
                .map((item) => ~~item[0])
                .filter((n) => n > 0)
                .sort((a, b) => b - a);
            const rounds = [];
            let left = total;
            while (left > 0) {
                // 档位配置理论上必含 1 次档，缺失时兜底为单次，避免死循环
                const tier = tiers.find((n) => n <= left) || 1;
                rounds.push(tier);
                left -= tier;
            }
            return rounds;
        },

        // 结果
        closeResult() {
            this.showResult = false;
            this.resultPrizes = [];
        },
    },
    beforeUnmount() {
        cancelAnimationFrame(this.prizeAnimationFrame);
        this.disposed = true;
        document.body.style.overflow = "";
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/lottery/index-app.less";
</style>
