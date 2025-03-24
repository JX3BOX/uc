<template>
    <div id="app" :class="theme" v-loading="loading">
        <Header></Header>
        <div class="p-event-blindbox">
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
                            <img :src="`${themeImg}logo.svg?123`" alt="魔盒盲盒" />
                            <el-tooltip effect="light" placement="right-start">
                                <img class="u-info" :src="`${__imgRoot}desc.svg`" alt="活动说明" />
                                <div class="m-blindbox-info" slot="content">
                                    {{ info }}
                                </div>
                            </el-tooltip>
                        </div>
                        <!-- 抽奖盒子 -->
                        <div class="m-box" :class="{ active: allActive }">
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
                                    alt="奖品"
                                    :key="replay + 'box' + index"
                                    v-show="showBox(index)"
                                />
                            </div>
                            <div class="m-mark" @click="toLogin" v-if="!isLogin"></div>
                            <div class="u-mark" :class="{ active: mark || !activeList.length }"></div>
                        </div>
                    </div>
                    <!-- 右侧 -->
                    <div class="m-right">
                        <!-- 积分现实 -->
                        <div class="m-point">{{ points }}</div>
                        <!-- 奖品 -->
                        <div class="m-prize box">
                            <div class="m-title">
                                <div style="display: flex">
                                    <img :src="`${__imgRoot}prize.png`" class="u-prize" alt="奖品一览" />
                                    <div class="u-preview" @click="preview = true">速览</div>
                                </div>
                                <el-dialog
                                    title="奖品速览"
                                    :visible.sync="preview"
                                    width="80%"
                                    :before-close="() => (preview = false)"
                                    :append-to-body="true"
                                    custom-class="m-preview-dialog"
                                >
                                    <div class="m-preview">
                                        <a
                                            :href="aLink(item)"
                                            v-for="(item, index) in previewList"
                                            :key="index"
                                            target="_blank"
                                            :data-index="index"
                                            class="m-preview-item"
                                        >
                                            <div class="u-prize">
                                                <img :src="item.img" />
                                                <div class="u-prize-name">{{ item.name }}</div>
                                                <span class="u-prize-count" v-if="item.name !== '积分（积分）'"
                                                    >剩余量 <b>{{ item.prize_count - item.be_won_count }}</b
                                                    ><el-progress
                                                        :percentage="
                                                            Number(
                                                                (
                                                                    ((item.prize_count - item.be_won_count) /
                                                                        item.prize_count) *
                                                                    100
                                                                ).toFixed(1)
                                                            )
                                                        "
                                                    ></el-progress
                                                ></span>
                                                <span v-else>不限量</span>
                                            </div>
                                        </a>
                                    </div>
                                </el-dialog>
                                <el-tooltip effect="light" placement="right-start">
                                    <span class="u-odds" v-show="odds">+ 概率公式</span>
                                    <div class="m-blindbox-info" slot="content">
                                        {{ odds }}
                                    </div>
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
                                                <img :src="item.img" />
                                                <div class="u-count" v-if="item.prize_count">
                                                    <span>【总数量】{{ item.prize_count }}</span>
                                                    <span>【已抽出】{{ item.be_won_count }}</span>
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
                                                <img :src="item.img" />
                                                <div class="u-count" v-if="item.prize_count">
                                                    <span>【总数量】{{ item.prize_count }}</span>
                                                    <span>【已抽出】{{ item.be_won_count }}</span>
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
                            <img
                                :src="`${themeImg}refresh.svg`"
                                class="u-img refresh"
                                @click="refreshBox"
                                alt="刷新盲盒"
                                v-if="theme !== 'weiqi'"
                            />
                            <!-- 围棋主题需要换图片所以用div的背景图代替 -->
                            <div class="u-img refresh" @click="refreshBox" v-if="theme === 'weiqi'"></div>
                            <div
                                class="m-random u-img"
                                :class="{ disabled: !activeList.length || points < draw[0][1] || isDrawing }"
                                @click="openBox"
                            >
                                <span class="u-price">{{ draw[0][1] }}</span>
                            </div>
                            <div
                                class="m-open u-img"
                                :class="{ disabled: points < draw[1][1] || isDrawing }"
                                @click="openBox('all')"
                            >
                                <span class="u-price u-discount"> x {{ draw[1][1] }}</span>
                                <span class="u-price"> x {{ draw[0][1] * 10 }}</span>
                            </div>
                            <!-- 中奖记录 -->
                            <div class="m-history box" :class="history ? 'history' : 'close'">
                                <div class="m-title" @click="openHistory">
                                    <img :src="`${__imgRoot}history.png`" class="u-history" alt="开盒记录" />
                                    <img
                                        :src="`${__imgRoot}close.png`"
                                        width="42px"
                                        class="u-close"
                                        alt="关闭"
                                        @click.stop="closeHistory"
                                    />
                                </div>
                                <div class="m-mark" @click="toLogin" v-if="!isLogin"></div>
                                <History :id="ID" :show="history" @update="showPrizes" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-goods" :class="{ active: hasPrize }" @click.stop="closePrize">
                <div class="m-item">
                    <div class="u-item box" v-for="(item, i) in myPrizes" :key="i">
                        <template v-if="item.prize_type == 'vip_asset'">
                            <img class="u-img" :src="`${__imgRoot}points.png`" />
                            <span>{{ item.vip_asset_once_give + asset[item.vip_asset_type] }}</span>
                        </template>
                        <template v-if="item.prize_type == 'thanks'">
                            <img class="u-img" :src="`${__imgRoot}thanks.png?123`" />
                            <span>感谢参与</span>
                        </template>
                        <template v-if="item.prize_type == 'mall_goods'">
                            <img class="u-img" :src="item.goods.goods_images[0]" />
                            <span>{{ item.goods.title }}</span>
                            <a :href="address" target="_blank" class="u-tips" v-if="!item.goods.is_virtual">
                                点击填写收货地址
                            </a>
                        </template>
                    </div>
                </div>
                <img
                    :src="`${themeImg}${history ? 'ok' : 'get'}.svg?123`"
                    class="u-get"
                    :class="{ disabled: prizesInterval !== null }"
                    alt="拿下"
                    @click.stop="closePrize"
                />
            </div>
        </div>
        <div class="mark" v-if="!event_status">
            <div class="m-box"><img :src="`${__imgRoot}null.png`" alt="活动暂未开启" /></div>
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
import User from "@jx3box/jx3box-common/js/user";
import { getBreadcrumb, getConfig } from "@/service/vip/cms";
import { getBlindBox, goodLucky, getMyLucky, getLuckyConfig, getMyInfo } from "@/service/vip/lottery";
import { cloneDeep, throttle, zip } from "lodash";
import { resolveImagePath } from "@jx3box/jx3box-common/js/utils";
import { __Root, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
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
            draw: {},
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
            status: {
                0: "全部",
                1: "抽奖中",
                2: "中奖",
                3: "未中奖",
            },
            asset: {
                boxcoin: "盒币（重制）",
                boxcoin_origin: "盒币（缘起）",
                point: "积分",
            },

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
        History,
        bindWechat,
    },
    computed: {
        data: function () {
            let _data = {};
            this.raw.forEach((item) => {
                if (!_data[item.subtype]) _data[item.subtype] = [];
                _data[item.subtype].push(item);
            });
            return _data;
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
        loadUser() {
            if(this.isLogin){
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
                        this.gift_off = res[2];
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

                    this.draw = zip(data.allow_once_try_count, data.allow_once_try_count_cost_points);
                    this.previewList = this.setPrizeList(data);
                    this.prizeList = this.setPrizeList(data).reverse();
                    this.scroll(this.prizeList.length);
                    const userLevelLimit = data.user_level_limit;
                    const userLevel = User.getLevel(this.user.experience);

                    if (userLevelLimit > userLevel) {
                        this.$alert("很抱歉，您的用户等级不足", "无法进行当前活动", {
                            type: "error",
                        });
                    }
                    this.theme = data.skin;
                    this.refreshBox();
                })
                .catch((e) => {
                    this.$alert("活动还未开始或已结束", {
                        type: "error",
                    });
                });
        },
        setPrizeList(data) {
            return data.prize.map((item) => {
                if (item.prize_type != "mall_goods" && this.assetImg[item.vip_asset_type])
                    return { img: this.assetImg[item.vip_asset_type], name: "积分（积分）" };
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
            this.$confirm("参与抽奖必须登录, 是否登录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
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
            setTimeout(() => {
                const rule = `
            @keyframes scroll_prize {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-${148 * count}px);
                }
            }`;
                const style = document.createElement("style");
                style.setAttribute("type", "text/css");
                document.head.appendChild(style);
                style.sheet.insertRule(rule);
                this.$refs.scroll.style.animation = `scroll_prize ${(count * 148) / 50}s linear infinite`;
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
            if (this.points < this.draw[0][1] || this.mark) return;
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
            let batch = 1;
            if (this.allActive) batch = 10;
            this.isDrawing = true;
            goodLucky(this.ID, batch).then((res) => {
                const _id = res.data?.data.id;
                this.showPrizes(_id, true);
                this.myPoints();
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
                        return this.$alert("请前往开盒记录查看，如无结果请联系网站管理人员", "开盒出现异常", {
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
    destroyed() {
        clearInterval(this.scrollInterval);
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/lottery/index.less";
</style>
