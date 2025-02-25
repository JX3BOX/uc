<template>
    <div class="c-author">
        <!--粉丝团-->
        <AuthorFans :uid="Number(uid)" class="m-common-box m-fans" :fansLimit="20"></AuthorFans>
        <div class="m-common-box m-user-bio">
            <div class="u-label"><i class="el-icon-edit"></i><span>TA的签名</span></div>
            <div class="u-userBio">
                {{ data.user_bio || "这个人太懒了~没有写签名。" }}
            </div>
        </div>
        <!-- <div class="m-common-box m-links" v-if="data != '' && (data.weibo_id || data.github_id || data.tv_id)">
            <div class="u-label"><i class="el-icon-user"></i><span>TA的信息</span></div>
            <AuthorLink class="u-links-box" :uid="uid" :data="data" />
        </div> -->
        <!--他的荣誉-->
        <AuthorMedals :uid="uid" class="u-trophy m-common-box m-medals"></AuthorMedals>
        <!--他的团队-->
        <!-- <AuthorTeams :uid="uid" class="u-teams m-common-box m-teams"></AuthorTeams> -->
    </div>
</template>

<script>
import AuthorFans from "@jx3box/jx3box-common-ui/src/author/AuthorFans";
// import AuthorLink from "@jx3box/jx3box-common-ui/src/author/AuthorLink";
import AuthorMedals from "@jx3box/jx3box-common-ui/src/author/AuthorMedals";
// import AuthorTeams from "@jx3box/jx3box-common-ui/src/author/AuthorTeams";
import { getUserInfo } from "@jx3box/jx3box-common-ui/service/author";

// 铭牌
import dateFormat from "@/utils/dateFormat";
import { getNamespaces } from "@/service/author/helper.js";
export default {
    name: "Primary",
    components: {
        AuthorFans,
        // AuthorLink,
        AuthorMedals,
        // AuthorTeams,
    },
    data: function () {
        return {
            data: "",
            namespaceList: [],
            defult_link: "https://www.jx3box.com",
        };
    },
    computed: {
        uid: function () {
            return this.$route.params.id;
        },
        params: function () {
            return {
                user_id: this.uid,
                page: 1,
                per: 5,
            };
        },
    },
    filters: {
        dateFormat: function (val) {
            return dateFormat(new Date(~~val * 1000));
        },
    },
    mounted() {
        if (!this.uid) {
            return;
        }
        this.installModules();
        this.getNamespacesList();
    },
    methods: {
        installModules: function () {
            getUserInfo(this.uid).then((data) => {
                if (data) {
                    this.data = data;
                    this.$emit("authorInfo", data);
                }
            });
        },
        getNamespacesList: function () {
            getNamespaces(this.params)
                .then((res) => {
                    this.namespaceList = res.data.data.list;
                })
                .finally(() => {});
        },
    },
};
</script>

<style scoped lang="less">
@import "~@/assets/css/author/newCss/primary.less";
</style>
<style lang="less">
.m-fans {
    .f-avatar {
        .h(auto) !important;
        flex-wrap: wrap;
    }
}
</style>
