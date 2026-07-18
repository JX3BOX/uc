<template>
    <uc class="m-dashboard-avatar">
        <ContentSkeleton v-if="loading" variant="cards" :rows="4" :columns="3" />
        <template v-else>
        <div class="m-profile-avatar">
            <div class="m-profile-box m-profile-avatar-primary">
                <img class="u-avatar u-avatar-l" :src="showAvatar(avatar)" />
                <el-upload
                    class="u-upload"
                    drag
                    accept="image/png, image/gif, image/jpeg"
                    :on-change="upload"
                    action="upload/avatar"
                    :auto-upload="false"
                >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        {{ $t("dashboard.avatar.dropFile") }}
                        <em>{{ $t("dashboard.avatar.clickUpload") }}</em>
                        <br />
                        <span class="u-tip">{{ $t("dashboard.avatar.fileTypeTip") }}</span>
                    </div>
                </el-upload>
            </div>
            <div class="m-profile-box m-profile-avatar-list">
                <div class="u-title">{{ $t("dashboard.avatar.defaultAvatar") }}</div>
                <template v-if="avatarList.length">
                    <span
                        class="u-avatar"
                        v-for="(item, i) in avatarList"
                        :key="i"
                        @click="changeAvatar(`${imgPath}img/avatar/${item}.jpg`)"
                    >
                        <el-avatar shape="square" :size="86" :src="`${imgPath}img/avatar/${item}.jpg`"></el-avatar>
                    </span>
                </template>
            </div>
        </div>
        <div class="u-profile-btn">
            <el-button type="primary" @click="submit" size="large">{{ $t("dashboard.common.confirm") }}</el-button>
            <el-button @click="reset" size="large">{{ $t("dashboard.common.reset") }}</el-button>
        </div>
        </template>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";
import { updateAvatar, uploadAvatar, getUserOverview } from "@/service/dashboard/profile";
import User from "@jx3box/jx3box-common/js/user";
import { showAvatar } from "@jx3box/jx3box-common/js/utils";
import frames from "@jx3box/jx3box-common/data/user_avatar_frame.json";
import { __imgPath } from "@/utils/config";
export default {
    name: "avatar",
    props: [],
    data: function () {
        return {
            loading: true,
            // 备份
            bak: "",
            // 数据
            avatar: "",
            frame: "",
            // VIP
            isVIP: false,
            uid: User.getInfo().uid,
            // 头像框
            frames,
            tabActivate: "0",
            decorationJson: {},
            decoration: [],
            decorationActivate: null,
            originalActivateName: null,
            selectAll: [],
            noDecoration: false,

            avatarList: [],
            imgPath: __imgPath,
        };
    },
    computed: {
        data: function () {
            return {
                user_avatar: this.avatar,
            };
        },
    },
    methods: {
        upload: function (file, fileList) {
            let formdata = new FormData();
            let filedata = file.raw;
            formdata.append("avatar", filedata);
            uploadAvatar(formdata).then((res) => {
                this.$message({
                    message: this.$t("dashboard.common.uploadSuccess"),
                    type: "success",
                });
                this.avatar = res.data.data[0];
            });
        },
        reset: function () {
            this.avatar = this.bak;
        },
        submit: function () {
            // this.decorationSubmit();
            // if (!this.isVIP) {
            //     if (this.frame) {
            //         this.$notify({
            //             title: "头像框未生效",
            //             message: "头像框仅高级/专业账号可用",
            //             type: "warning",
            //         });
            //     }
            //     this.frame = "";
            // }
            updateAvatar(this.data).then((res) => {
                User.refresh("avatar", this.avatar);
                this.$message({
                    message: this.$t("dashboard.avatar.updateSuccess"),
                    type: "success",
                });
            });
        },
        showFrame: function (name) {
            // if (process.env.NODE_ENV == "development") {
            //     return `temp/avatar/${name}/${name}.svg`;
            // }
            return __imgPath + `avatar/images/${name}/${name}.svg`;
        },
        init: function () {
            this.avatar = this.bak = User.getInfo().avatar_origin;
            this.loading = true;
            const overviewRequest = getUserOverview(this.uid)
                .then((res) => {
                    this.frame = res.data.data.user_avatar_frame || "";
                })
                .catch(() => {});
            return Promise.allSettled([overviewRequest, this.loadAvatar()]).finally(() => {
                this.loading = false;
            });
        },
        loadAvatar() {
            return getBreadcrumb("dashboard-default-avatar")
                .then((res) => {
                    this.avatarList = res ? res.split(",") : [];
                })
                .catch(() => {
                    this.avatarList = [];
                });
        },
        changeAvatar(link) {
            this.avatar = link;
        },
        showAvatar: function (val) {
            return showAvatar(val, 480, false);
        },
        showSmallAvatar: function (val) {
            return showAvatar(val, 136, false);
        },
    },
    created: function () {
        this.init();
    },
    components: {
        uc,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/profile/avatar.less";
</style>
