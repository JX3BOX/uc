/dashboard<template>
    <uc class="m-dashboard-honor m-dashboard-skin" icon="el-icon-brush" title="主题装扮" :tab-list="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--mini is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> 前往获取装扮</a
            >
        </template>
        <div class="m-honor">
            <div class="m-honor-left">
                <div class="u-header-info">
                    <Avatar
                        class="u-author-avatar"
                        :uid="uid"
                        :url="avatar"
                        :size="avatarSize()"
                        :frame="avatar_frame"
                    />
                    <div class="u-author-info">
                        <span class="u-name">
                            <span @click="copyData(data.display_name || '匿名')">{{ data.display_name || "匿名" }}</span
                            >&nbsp;<span class="u-uid" @click="copyData(data.ID || 0)">(UID : {{ data.ID || 0 }})</span>
                        </span>
                        <div class="u-tips">
                            <el-tooltip :content="`当前经验 ${data.experience || 0}`" placement="top">
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
                            <el-tooltip content="签约作者" v-if="isSuperAuthor" placement="top">
                                <span class="u-superauthor">
                                    <i class="u-icon superauthor">签约作者</i>
                                </span>
                            </el-tooltip>
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
            </div>

            <div class="m-honor-right">
                <div class="u-honor-list">
                    <div class="u-title">
                        <span class="u-name"><i class="el-icon-collection-tag"></i>称号</span>
                        <a class="u-buy" :href="`/vip/mall?category=virtual&sub_category=honor`" target="_blank"
                            ><i class="el-icon-shopping-cart-2"></i> 前往获取</a
                        >
                    </div>
                    <div class="u-honor-item">
                        <div class="u-picbox" v-for="(item, i) in honorList" :key="i">
                            <el-tooltip effect="dark" placement="top" :open-delay="200">
                                <div slot="content">{{ item.name }}</div>
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
            <el-button type="primary" @click="submit">确认</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { themeTab } from "@/assets/data/dashboard/tabs.json";
import User from "@jx3box/jx3box-common/js/user";
import { getMyInfo } from "@/service/dashboard/index.js";
import { __userLevelColor, __imgPath, __cdn } from "@jx3box/jx3box-common/data/jx3box";
import { getHonor, getUserHonors, setHonor, cancelHonor } from "@/service/dashboard/decoration";
import { cloneDeep, inRange } from "lodash";
export default {
    name: "honor",
    props: [],
    data: function () {
        return {
            tabList: themeTab,
            isVIP: false,
            info: {
                uid: User.getInfo().uid,
                name: "匿名",
                user_avatar: `${__imgPath}/image/common/avatar.png`,
                user_avatar_frame: "default",
                bio: "-",
                sign: 0,
            },
            isSelect: {},
            honorList: [],
            list: [],
            isSelectBak: {},
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
            return this.isPRO ? "专业版会员用户" : "高级版会员用户";
        },
        level: function () {
            return User.getLevel(this.data?.experience || 0);
        },
    },
    methods: {
        imgUrl: function (item) {
            return __cdn + `design/decoration/honor/${item.img}/${item.img}.${item.img_ext}`;
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
            let prefix = honorConfig.prefix;
            let regPrefix = honorConfig.prefix.match(/(?<=\{)(.+?)(?=\})/g);
            let ranking = honorConfig.ranking;
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
            if (ranking?.length > 0 && data) {
                data.imgIndex = 0;
                for (let i = 0; i < ranking.length; i++) {
                    //处在范围内取数组第三个值进行称号拼接
                    if (honor?.ranking != undefined && inRange(Number(honor?.ranking), ranking[i][0], ranking[i][1])) {
                        data.imgIndex = i;
                        let str = ranking[i][2];
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
            return honorStr + honorConfig.suffix;
        },
        loadHonor() {
            getHonor().then((res) => {
                this.honorList = res.data.data.list;
                this.loadDecoration();
            });
        },
        loadDecoration() {
            getUserHonors(this.uid).then((res) => {
                const myHonors = res || [];
                this.honorList = this.honorList.map((item) => {
                    const isHave = myHonors?.find((e) => e.honor_id == item.id);
                    if (isHave) {
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
                    img: "不佩戴称号",
                    name: "取消佩戴称号",
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
            this.$set(this, "honorList", cloneDeep(this.list));
            this.$set(this, "isSelect", cloneDeep(this.isSelectBak));
        },
        sortData(arr) {
            // 已有的称号
            const isHave = arr.filter((e) => e.isHave).sort((a, b) => a.honor_id - b.honor_id);
            // 未有的称号
            const noHave = arr.filter((e) => !e.isHave).sort((a, b) => a.honor_id - b.honor_id);
            return isHave.concat(noHave);
        },
        showLevelColor: function (level) {
            return __userLevelColor[level];
        },
        submit() {
            const item = this.honorList?.find((e) => e.using == 1);
            if (item?.id) {
                setHonor(item.id).then((res) => {
                    this.$message({
                        message: "称号更新成功",
                        type: "success",
                    });
                });
            } else {
                cancelHonor().then((res) => {
                    this.$message({
                        message: "称号更新成功",
                        type: "success",
                    });
                });
            }
        },
    },
    mounted: function () {
        this.loadUserInfo();
        this.loadHonor();
    },
    components: {
        uc,
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/honor.less";
</style>
