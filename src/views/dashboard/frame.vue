<template>
    <uc class="m-dashboard-frame m-dashboard-skin" icon="el-icon-brush" :title="$t('dashboard.theme.title')" :tab-list="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--small is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> {{ $t("dashboard.theme.getDecorations") }}</a
            >
        </template>
        <ContentSkeleton v-if="loading" variant="cards" :rows="8" :columns="4" />
        <div v-else class="m-frame">
            <!-- 左右两侧 -->
            <div class="m-frame-left">
                <a
                    class="u-btn el-button el-button--default el-button--small is-plain"
                    href="/dashboard/avatar"
                    target="_blank"
                    ><i class="el-icon-picture-outline-round"></i> {{ $t("dashboard.profile.changeAvatar") }}</a
                >
                <div class="u-avatar-box">
                    <div class="u-avatar">
                        <img :src="showAvatar(avatar)" class="u-avatar-pic" />
                        <i class="u-avatar-frame" v-if="frame">
                            <img :src="frameUrl(frame)" />
                        </i>
                    </div>
                </div>
            </div>
            <div class="m-frame-right">
                <!-- <div class="u-no-theme" :class="decorationActivate==null?'select':''" @click="noSet">不设置主题</div> -->
                <!-- 主题渲染列表 -->
                <div class="u-theme">
                    <div class="u-frame-list">
                        <div class="u-title">
                            <span class="u-name"><i class="el-icon-collection-tag"></i>{{ $t("dashboard.theme.avatarFrame") }}</span>
                            <a class="u-buy" :href="`/vip/mall?category=virtual&sub_category=avatar`" target="_blank"
                                ><i class="el-icon-shopping-cart-2"></i> {{ $t("dashboard.theme.goGet") }}</a
                            >
                        </div>
                        <div class="u-frame-item">
                            <div class="u-picbox" v-for="(item, i) in frameList" :key="i">
                                <el-tooltip effect="dark" placement="top" :open-delay="200">
                                    <template #content>
                                        <div>{{ item.desc }}<br />{{ item.postscript }}</div>
                                    </template>
                                    <div class="u-pic" :class="setClass(item)" @click="setAvatar(item)">
                                        <el-image :src="frameUrl(item.name)" fit="contain" v-if="item.name" />
                                        <div v-else class="u-noFrame"></div>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!loading" class="m-btn">
            <el-button type="primary" @click="updateAvatarFrame" size="large" :loading="submitting">{{
                $t("dashboard.common.confirm")
            }}</el-button>
            <el-button @click="reset" size="large">{{ $t("dashboard.theme.reset") }}</el-button>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import tabsData from "@/assets/data/dashboard/tabs.json";
const { themeTab } = tabsData;
import User from "@jx3box/jx3box-common/js/user";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@/utils/config";
import { getFrames, getUserOverview } from "@/service/dashboard/profile";
import { updateAvatarFrame, getDecoration, receive } from "@/service/dashboard/decoration";
export default {
    name: "frame",
    props: [],
    data: function () {
        return {
            tabList: themeTab,
            uid: User.getInfo().uid,
            frameList: [],
            //头像框备份
            framebak: "",
            // 数据
            avatar: User.getInfo().avatar_origin,
            frame: null,
            frames: {}, //远程json
            avatars: [], //头像筛选
            decoration: {}, //装扮筛选用于判断是否符合领取条件
            loading: true,
            submitting: false,
        };
    },
    computed: {},
    methods: {
        reset() {
            this.frame = this.framebak;
            this.dataProcessing();
        },
        frameUrl: function (name) {
            if (!name) return;
            return __imgPath + `avatar/images/${name}/${name}.svg`;
        },
        showAvatar: function (val) {
            return showAvatar(val, 200 * 3);
        },
        setClass(item) {
            if (item.decoration && item.receive) return "receive";
            if (!item.isHave) return "noHave";
            if (item.using) return "select";
        },
        async updateAvatarFrame() {
            if (this.submitting) return;
            this.submitting = true;
            try {
                await updateAvatarFrame({ user_avatar_frame: this.frame });
                this.framebak = this.frame;
                this.dataProcessing();
                this.$message({
                    message: this.$t("dashboard.theme.frameUpdateSuccess"),
                    type: "success",
                });
            } catch (err) {
                this.$message({
                    message: err?.response?.data?.msg || err?.message || this.$t("dashboard.theme.updateFailed"),
                    type: "error",
                });
            } finally {
                this.submitting = false;
            }
        },
        receiveFrame(type) {
            receive(this.uid, type).then((data) => {
                this.$message({
                    message: this.$t("dashboard.theme.receiveSuccess"),
                    type: "success",
                });
                this.loadDecoration();
            });
        },
        setAvatar(item) {
            //如果receive则走领取
            if (item.decoration && item.receive) {
                //先走领取完事重载状态
                this.receiveFrame(item.name);
                return;
            }
            if (!item.isHave) return;
            this.frameList.forEach((frame) => {
                frame.using = 0;
            });
            item.using = 1;
            this.frame = item.name;
        },
        async load() {
            this.loading = true;
            try {
                const [overviewResult, framesResult, decorationResult] = await Promise.allSettled([
                    getUserOverview(this.uid),
                    getFrames(),
                    getDecoration({ type: "avatar" }),
                ]);
                if (overviewResult.status === "fulfilled") {
                    this.frame = overviewResult.value.data.data.user_avatar_frame || "";
                    this.framebak = overviewResult.value.data.data.user_avatar_frame || "";
                }
                this.frames = framesResult.status === "fulfilled" ? framesResult.value.data || {} : {};
                this.avatars =
                    decorationResult.status === "fulfilled" ? decorationResult.value.data.data || [] : [];
                this.dataProcessing();
                if (framesResult.status === "rejected") throw framesResult.reason;
            } catch (err) {
                this.frameList = [];
                this.$message.error(err?.response?.data?.msg || this.$t("dashboard.common.requestFailed"));
            } finally {
                this.loading = false;
            }
        },
        loadDecoration() {
            getDecoration({ type: "avatar" }).then((data) => {
                this.avatars = data.data.data;
                this.dataProcessing();
            });
        },
        formattingData(arr, group_key) {
            let map = {};
            arr.forEach((item, i) => {
                if (!map[item[group_key]]) {
                    map[item[group_key]] = [item];
                } else {
                    map[item[group_key]].push(item);
                }
            });
            return map;
        },
        //装扮收集判断
        decorationAather(key) {
            let typeArr = ["atcard", "homebg", "sidebar", "calendar"];
            let arr = (this.decoration?.[key] || []).filter(
                (item) => item.type != "" && typeArr.indexOf(item.type) != -1
            );
            if (arr?.length >= 4) return true;
            return false;
        },
        dataProcessing() {
            let avatars = this.avatars || [],
                frames = this.frames,
                firstRes = [{ desc: this.$t("dashboard.theme.noFrame"), name: "", val: "", isHave: 1, using: 1 }],
                twoRes = [],
                threeRes = [];
            Object.keys(frames).forEach((key, i) => {
                let item = { ...frames[key], ...{ isHave: 0, using: 0, receive: false } };
                let find = avatars.find((e) => e.val == key);
                if (find) {
                    item.using = this.frame === key ? 1 : 0;
                    item.isHave = 1;
                    if (item.using) {
                        firstRes[0].using = 0;
                    }
                } else {
                    if (item.decoration) {
                        item.receive = this.decorationAather(item.name);
                    }
                }

                if (item.isHave) {
                    firstRes.push(item);
                } else if (item.decoration) {
                    twoRes.push(item);
                } else {
                    threeRes.push(item);
                }
            });
            firstRes[0].using = this.frame ? 0 : 1;
            this.frameList = [...firstRes, ...twoRes, ...threeRes];
        },
    },
    mounted: function () {
        this.load();
    },
    components: {
        uc,
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/frame.less";
</style>
