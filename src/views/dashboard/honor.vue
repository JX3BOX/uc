/dashboard
<template>
    <uc class="m-dashboard-honor m-dashboard-skin" icon="el-icon-brush" :title="$t('dashboard.theme.title')" :tab-list="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--small is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> {{ $t("dashboard.theme.getDecorations") }}</a
            >
        </template>
        <div class="m-honor">
            <div class="m-honor-left">
                <div class="u-header-info">
                    <div class="u-user-summary">
                        <CommonAvatar
                            class="u-author-avatar"
                            :uid="uid"
                            :url="avatar"
                            :size="avatarSize()"
                            :frame="avatar_frame"
                        />
                        <div class="u-author-info">
                            <span class="u-name">
                                <span @click="copyData(data.display_name || $t('dashboard.common.anonymous'))">{{ data.display_name || $t("dashboard.common.anonymous") }}</span
                                >&nbsp;<span class="u-uid" @click="copyData(data.ID || 0)">(UID : {{ data.ID || 0 }})</span>
                            </span>
                            <div class="u-tips">
                                <el-tooltip :content="$t('dashboard.honor.currentExperience', { value: data.experience || 0 })" placement="top">
                                    <span
                                        class="u-level"
                                        :class="'lv-' + level"
                                        :style="{ backgroundColor: showLevelColor(level) }"
                                        >Lv.{{ level }}</span
                                    >
                                </el-tooltip>
                                <el-tooltip :content="vipTypeTitle" v-if="isPRO || isVIP" placement="top">
                                    <span class="u-vip" target="_blank">
                                        <i class="u-icon vip">{{ vipType }}</i>
                                    </span>
                                </el-tooltip>
                                <el-tooltip :content="$t('dashboard.honor.contractedAuthor')" v-if="isSuperAuthor" placement="top">
                                    <span class="u-superauthor">
                                        <i class="u-icon superauthor">{{ $t("dashboard.honor.contractedAuthor") }}</i>
                                    </span>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                    <div
                        class="u-honor"
                        v-if="!isSelect.isCustomize"
                        :style="{ backgroundImage: `url(${imgUrl(isSelect)})` }"
                    >
                        <span :style="{ color: isSelect.color }">{{ isSelect.name }}</span>
                    </div>
                </div>
            </div>

            <div class="m-honor-right">
                <div class="u-honor-list">
                    <div class="u-title">
                        <span class="u-name"><i class="el-icon-collection-tag"></i>{{ $t("dashboard.honor.title") }}</span>
                        <a class="u-buy" :href="`/vip/mall?category=virtual&sub_category=honor`" target="_blank"
                            ><i class="el-icon-shopping-cart-2"></i> {{ $t("dashboard.theme.goGet") }}</a
                        >
                    </div>
                    <div class="u-honor-item">
                        <div class="u-picbox" v-for="item in honorList" :key="item.isCustomize ? 'customize' : item.id">
                            <el-tooltip effect="dark" placement="top" :open-delay="200">
                                <template #content>{{ item.name }}</template>
                                <div class="u-pic" :class="setClass(item)" @click="selectChange(item)">
                                    <div v-if="item.isCustomize" class="u-noHonor"></div>
                                    <el-image :src="imgUrl(item)" fit="contain" v-else />
                                </div>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="m-btn">
            <el-button type="primary" :loading="submitting" @click="submit" size="large">{{ $t("dashboard.common.confirm") }}</el-button>
            <el-button @click="reset" size="large">{{ $t("dashboard.common.reset") }}</el-button>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import tabsData from "@/assets/data/dashboard/tabs.json";
const { themeTab } = tabsData;
import User from "@jx3box/jx3box-common/js/user";
import { getMyInfo } from "@/service/dashboard/index.js";
import { __userLevelColor, __imgPath, __cdn } from "@/utils/config";
import { getHonor, getUserHonors, setHonor, cancelHonor } from "@/service/dashboard/decoration";
import { cloneDeep, inRange } from "lodash";
import CommonAvatar from "@jx3box/jx3box-ui/src/author/Avatar.vue";
export default {
    name: "honor",
    props: [],
    data: function () {
        return {
            tabList: themeTab,
            isVIP: false,
            info: {
                uid: User.getInfo().uid,
                name: this.$t("dashboard.common.anonymous"),
                user_avatar: `${__imgPath}/image/common/avatar.png`,
                user_avatar_frame: "default",
                bio: "-",
                sign: 0,
            },
            isSelect: {},
            honorList: [],
            list: [],
            isSelectBak: {},
            submitting: false,
        };
    },
    computed: {
        uid: function () {
            return User.getInfo().uid;
        },
        data: function () {
            return this.info;
        },
        avatar: function () {
            return this.data.user_avatar || "";
        },
        avatar_frame: function () {
            return this.data.user_avatar_frame || "";
        },
        isPRO: function () {
            return this.data?.is_pro;
        },
        isSuperAuthor: function () {
            return !!this.data?.sign;
        },
        vipType: function () {
            return this.isPRO ? "PRO" : "PRE";
        },
        vipTypeTitle: function () {
            return this.isPRO ? this.$t("dashboard.honor.proMember") : this.$t("dashboard.honor.advancedMember");
        },
        level: function () {
            return User.getLevel(this.data?.experience || 0);
        },
    },
    methods: {
        imgUrl: function (item) {
            return __cdn + `design/decoration/honor/${item.img}/${item.img}.${item.img_ext || "png"}`;
        },
        setClass(item) {
            if (!item.isHave) return "noHave";
            if (item.using) return "select";
        },
        avatarSize() {
            let w = document.body.clientWidth || document.documentElement.clientWidth;
            if (w > 500) {
                return "m";
            } else {
                return "s";
            }
        },
        loadUserInfo: function () {
            getMyInfo().then((res) => {
                if (res.data.data) {
                    this.info = res.data.data;
                }
            });
        },
        disposeHonor(honor) {
            const data = honor || {};
            const honorConfig = honor?.honor || {};
            //正则取出前缀
            let only = honorConfig.only;
            let prefix = honorConfig.prefix || "";
            let regPrefix = prefix.match(/(?<=\{)(.+?)(?=\})/g);
            let ranking = Array.isArray(honorConfig.ranking) ? honorConfig.ranking : [];
            let honorStr = honorConfig.year || "";
            if (!only) {
                if (regPrefix) {
                    if (data) {
                        honorStr = honorStr + (honor?.[regPrefix[0]] || "");
                    }
                } else {
                    honorStr = honorStr + prefix;
                }
            } else {
                honorStr = prefix;
            }
            //排名处理
            if (ranking.length > 0 && data) {
                for (let i = 0; i < ranking.length; i++) {
                    //处在范围内取数组第三个值进行称号拼接
                    if (honor?.ranking != undefined && inRange(Number(honor?.ranking), ranking[i][0], ranking[i][1])) {
                        let str = ranking[i][2] || "";
                        //正则取出需替换值，如果没有则直接拼接
                        let regStr = str.match(/(?<=\{)(.+?)(?=\})/g);
                        if (regStr) {
                            //包含花括号替换
                            honorStr =
                                honorStr +
                                str.replace(/\{([^{}]+?)\}/g, function (match, p1) {
                                    return data[p1] || honor[p1] || "";
                                });
                        } else {
                            honorStr = honorStr + str;
                        }
                        break;
                    }
                }
            }
            return honorStr + (honorConfig.suffix || "");
        },
        async loadHonor() {
            try {
                const res = await getHonor({ _no_page: 1 });
                const data = res?.data?.data || {};
                this.honorList = Array.isArray(data?.list) ? data.list : Array.isArray(data) ? data : [];
                await this.loadDecoration();
            } catch (e) {
                this.honorList = [];
                this.$message.error(this.$t("dashboard.common.requestFailed"));
            }
        },
        loadDecoration() {
            return getUserHonors().then((res) => {
                const myHonors = res || [];
                this.honorList = this.honorList.map((item) => {
                    const isHave = myHonors?.find((e) => e.honor_id == item.id);
                    if (isHave) {
                        item.honor_id = isHave.honor_id;
                        item.ranking = isHave.ranking;
                        item.server = isHave.server;
                        item.extra = isHave.extra;
                        item.isHave = true;
                    }
                    const isUsing = myHonors?.find((e) => e.honor_id == item.id && e.using == 1);
                    if (isUsing) {
                        item.using = 1;
                    }

                    item.name = this.disposeHonor({
                        ...isHave,
                        honor: item,
                    });

                    return item;
                });
                let isUsing = this.honorList?.find((item) => item.using == 1);
                let isCustomize = {
                    type: "honor_customize",
                    img: this.$t("dashboard.honor.noTitle"),
                    name: this.$t("dashboard.honor.removeTitle"),
                    using: isUsing ? 0 : 1,
                    isHave: true,
                    isCustomize: true, //是否是自己定义的
                };
                if (isUsing) {
                    this.isSelect = isUsing;
                } else {
                    this.isSelect = isCustomize;
                }
                this.honorList.unshift(isCustomize);
                this.honorList = this.sortData(this.honorList);
                this.list = cloneDeep(this.honorList);
                this.isSelectBak = cloneDeep(this.isSelect);
            });
        },
        selectChange(item) {
            if (!item.isHave) return;
            this.honorList.forEach((e) => {
                e.using = 0;
            });
            item.using = 1;
            this.isSelect = item;
        },
        reset() {
            this.honorList = cloneDeep(this.list);
            this.isSelect = cloneDeep(this.isSelectBak);
        },
        sortData(arr) {
            // 已有的称号
            const isHave = arr.filter((e) => e.isHave).sort((a, b) => (a.id || 0) - (b.id || 0));
            // 未有的称号
            const noHave = arr.filter((e) => !e.isHave).sort((a, b) => (a.id || 0) - (b.id || 0));
            return isHave.concat(noHave);
        },
        showLevelColor: function (level) {
            return __userLevelColor[level];
        },
        async submit() {
            if (this.submitting) return;
            const item = this.honorList?.find((e) => e.using == 1);
            this.submitting = true;
            try {
                if (item?.id) {
                    await setHonor(item.id);
                } else {
                    await cancelHonor();
                }
                this.list = cloneDeep(this.honorList);
                this.isSelectBak = cloneDeep(this.isSelect);
                this.$message({
                    message: this.$t("dashboard.honor.updateSuccess"),
                    type: "success",
                });
            } catch (e) {
                this.$message.error(this.$t("dashboard.common.operationFailedRetry"));
            } finally {
                this.submitting = false;
            }
        },
    },
    mounted: function () {
        this.loadUserInfo();
        this.loadHonor();
    },
    components: {
        uc,
        CommonAvatar,
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/honor.less";
</style>
