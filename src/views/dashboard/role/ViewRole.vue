<template>
    <div class="v-role-view">
        <h2 class="u-title">
            <i class="el-icon-user"></i> {{ $t("dashboard.role.info") }}
            <!-- <div class="u-op" v-if="data && isCustom && hasRight">
                <router-link
                    :to="'/role/edit/' + id"
                    class="el-button el-button--primary el-button--small"
                >
                    <i class="el-icon-edit-outline"></i> 编辑角色
                </router-link>
                <el-button
                    class="u-btn u-delete"
                    type="info"
                    plain
                    
                    @click="delRole"
                    icon="Delete"
                >删除</el-button>
            </div>-->
            <el-button class="u-back" plain icon="ArrowLeft" @click="goBack">{{
                $t("dashboard.common.back")
            }}</el-button>
        </h2>
        <div class="m-role-detail" v-if="data">
            <div class="m-role-info">
                <RoleAvatar class="u-avatar" :mount="data.mount" :body_type="data.body_type" />
                <div class="u-meta u-name">
                    <!-- <em>角色名</em> -->
                    <!-- <img v-if="!~~data.custom" class="u-verify" svg-inline src="@/assets/img/dashboard/verify.svg" /> -->
                    {{ data.name }}
                </div>
                <div class="u-meta">
                    <span class="u-remark">
                        <!-- <em>备注</em> -->
                        {{ data.note || "-" }}
                    </span>
                </div>
                <div class="u-meta">
                    <span class="u-server">
                        <em>{{ $t("dashboard.role.server") }}</em>
                        {{ data.server }}
                    </span>
                    <span class="u-school">
                        <em>{{ $t("dashboard.role.school") }}</em>
                        <img class="u-icon" :src="showSchoolIcon(data.mount)" />
                        {{ showSchoolName(data.mount, $t("dashboard.common.unknown")) }}
                    </span>
                    <span class="u-body">
                        <em>{{ $t("dashboard.role.bodyType") }}</em>
                        {{ showBodyType(data.body_type, $t("dashboard.common.unknown")) }}
                    </span>
                </div>
                <div class="u-meta">
                    <span class="u-author">
                        <img
                            class="u-author-avatar"
                            width="24"
                            height="24"
                            :src="showAvatar(data.user_avatar)"
                            alt=""
                        />
                        <a class="u-author-name" :href="authorLink(data.uid)" target="_blank">
                            {{ data.display_name }}
                        </a>
                    </span>
                    <span class="u-remark">
                        <em>{{ $t("dashboard.role.boundAt") }}</em>
                        {{ showTime(data.created_at) }}
                    </span>
                </div>
            </div>
            <!-- <div class="m-role-player">
                <el-divider content-position="left">
                    <i class="el-icon-magic-stick"></i>
                    角色信息
                </el-divider>
                <template v-if="playerId && data">
                    <Player
                        :playerId="playerId"
                        :server="server"
                        :role="data.name"
                        :darkMode="false"
                        :showEquipName="true"
                        :showPosition="false"
                    />
                </template>
                <div class="u-null" v-else>
                    <i class="el-icon-warning-outline"></i> 本角色需要重新绑定方可获取相应信息
                </div>
            </div> -->
            <div class="m-role-belongs" v-if="hasRight">
                <el-divider content-position="left">
                    <i class="el-icon-collection-tag"></i>
                    {{ $t("dashboard.role.joinedTeams") }}
                </el-divider>
                <template v-if="teams && teams.length">
                    <div class="u-teams">
                        <router-link class="u-team" :to="'/org/' + item.team_id" v-for="(item, i) in teams" :key="i">
                            <img class="u-team-logo" v-if="item.team_logo" :src="showTeamLogo(item.team_logo)" />
                            <img class="u-team-logo" v-else src="@/assets/img/dashboard/null.png" />
                            <span class="u-team-name">{{ item.team_name }}</span>
                        </router-link>
                    </div>
                    <div class="u-lock"><i class="el-icon-lock"></i>{{ $t("dashboard.role.teamsPrivate") }}</div>
                </template>
                <template v-else>
                    <div class="u-lock"><i class="el-icon-warning-outline"></i>{{ $t("dashboard.role.noTeams") }}</div>
                </template>
            </div>
        </div>
        <div class="m-role-null m-team-limit" v-if="warning_visible">
            <p class="u-title">
                <img class="u-icon" svg-inline src="@/assets/img/dashboard/warning.svg" />
                Not Found
            </p>
            {{ $t("dashboard.role.notFound") }}
        </div>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { getRole, deleteRole, getRoleBelongTeams } from "@/service/dashboard/role.js";
import RoleAvatar from "@/components/dashboard/role/RoleAvatar.vue";
import {
    showBodyType,
    getThumbnail,
    authorLink,
    showAvatar,
    showSchoolIcon,
    showSchoolName,
    showTime,
} from "@/utils/filters";
export default {
    name: "ViewRole",
    props: [],
    data: function () {
        return {
            data: "",
            warning_visible: false,
            teams: [],
            isLogin: User.isLogin(),
        };
    },
    computed: {
        id: function () {
            return ~~this.$route.params.id;
        },
        hasRight: function () {
            return this.data.uid == User.getInfo().uid || User.isSuperAdmin();
        },
        isCustom: function () {
            return this.data && this.data.custom;
        },
        playerId: function () {
            return this.data.player_id;
        },
        server: function () {
            return this.data.server;
        },
    },
    methods: {
        delRole: function () {
            this.$alert(this.$t("dashboard.role.deleteConfirm"), this.$t("dashboard.common.message"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        deleteRole(this.id).then((res) => {
                            this.$notify({
                                title: this.$t("dashboard.common.deleteSuccess"),
                                message: this.$t("dashboard.role.deleteSuccess"),
                                type: "success",
                            });
                            this.$router.push("/role");
                        });
                    }
                },
            });
        },
        loadData: function () {
            getRole(this.id).then((res) => {
                this.data = res.data.data;
                if (this.hasRight) {
                    getRoleBelongTeams(this.id).then((res) => {
                        this.teams = res.data.data;
                    });
                }
            });
        },
        goBack: function () {
            this.$router.push("/role");
        },
        showTeamLogo: function (val) {
            return getThumbnail(val, 256);
        },
        authorLink,
        showAvatar,
        showBodyType,
        showSchoolIcon,
        showSchoolName,
        showTime,
    },
    mounted: function () {
        this.loadData();
    },
    components: {
        RoleAvatar,
        // Player,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/role/view_role.less";
</style>
