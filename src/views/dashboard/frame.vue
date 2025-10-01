<template>
    <uc class="m-dashboard-frame m-dashboard-skin" icon="el-icon-brush" title="主题装扮" :tab-list="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--mini is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> 前往获取装扮</a
            >
        </template>
        <div class="m-frame">
            <!-- 左右两侧 -->
            <div class="m-frame-left">
                <a
                    class="u-btn el-button el-button--default el-button--mini is-plain"
                    href="/dashboard/avatar"
                    target="_blank"
                    ><i class="el-icon-picture-outline-round"></i> 修改头像</a
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
                            <span class="u-name"><i class="el-icon-collection-tag"></i>头像框</span>
                            <a class="u-buy" :href="`/vip/mall?category=virtual&sub_category=avatar`" target="_blank"
                                ><i class="el-icon-shopping-cart-2"></i> 前往获取</a
                            >
                        </div>
                        <div class="u-frame-item">
                            <div class="u-picbox" v-for="(item, i) in frameList" :key="i">
                                <el-tooltip effect="dark" placement="top" :open-delay="200">
                                    <div slot="content">{{ item.desc }}<br />{{ item.postscript }}</div>
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
        <div class="m-btn">
            <el-button type="primary" @click="updateAvatarFrame">确认</el-button>
            <el-button @click="reset">清除所有装扮</el-button>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { themeTab } from "@/assets/data/dashboard/tabs.json";
import User from "@jx3box/jx3box-common/js/user";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import { __imgPath } from "@/utils/config";
import { getFrames, getUserOverview } from "@/service/dashboard/profile";
import { updateAvatarFrame, getDecoration, receive, setDecoration } from "@/service/dashboard/decoration";
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
            framesBak: {},
            // 数据
            avatar: User.getInfo().avatar_origin,
            frame: null,
            frames: {}, //远程json
            avatars: [], //头像筛选
            decoration: null, //装扮筛选用于判断是否符合领取条件
        };
    },
    computed: {},
    methods: {
        reset() {
            this.frame = this.framebak;
            this.frames = this.framesBak;
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
        updateAvatarFrame() {
            updateAvatarFrame({ user_avatar_frame: this.frame }).then((res) => {
                this.$message({
                    message: "头像框更新成功",
                    type: "success",
                });
                const params = this.frameList.map((item) => {
                    return { val: item.name, using: item.using, type: "avatar" };
                });
                setDecoration(params);
            });
        },
        receiveFrame(type) {
            receive(this.uid, type).then((data) => {
                this.$message({
                    message: "领取成功",
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
            let list = this.frameList;
            let find = list.find((e) => e.using == 1);
            if (find) find.using = 0;
            item.using == 1 ? (item.using = 0) : (item.using = 1);
            this.frame = item.name;
        },
        load: function () {
            getUserOverview(this.uid).then((res) => {
                this.frame = res.data.data.user_avatar_frame || "";
                this.framebak = res.data.data.user_avatar_frame || "";
            });
            getFrames().then((res) => {
                this.frames = res.data;
                this.framesBak = res.data;
                this.loadDecoration();
            });
        },
        loadDecoration() {
            getDecoration().then((data) => {
                let res = data.data.data;
                let typeArr = ["atcard", "homebg", "sidebar", "calendar"];
                let arr = res.filter((item) => item.type != "" && typeArr.indexOf(item.type) != -1);
                this.decoration = this.formattingData(arr, "val");
                this.avatars = res.filter((e) => e.type == "avatar");
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
            let arr = this.decoration[key]?.filter((item) => item.type != "" && typeArr.indexOf(item.type) != -1);
            if (arr?.length >= 4) return true;
            return false;
        },
        dataProcessing() {
            let avatars = this.avatars || [],
                frames = this.frames,
                firstRes = [{ desc: "无边框", name: "", val: "", isHave: 1, using: 1 }],
                twoRes = [],
                threeRes = [];
            Object.keys(frames).forEach((key, i) => {
                let item = { ...frames[key], ...{ isHave: 0, using: 0, receive: false } };
                let find = avatars.find((e) => e.val == key);
                if (find) {
                    item.using = find.using;
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
