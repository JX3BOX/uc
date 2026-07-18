<template>
    <div class="v-role-list">
        <h2 class="u-title">
            <i class="el-icon-coordinate"></i> {{ $t("dashboard.role.myRoles") }}
            <!-- <goback /> -->
            <div class="u-op">
                <router-link to="/role/bind" class="el-button el-button--primary el-button--default">
                    <i class="el-icon-connection"></i>&nbsp;{{ $t("dashboard.role.bind") }}
                </router-link>
                <!-- <router-link to="/role/sync" class="el-button el-button--primary el-button--small">
                    <i class="el-icon-refresh"></i> {{ $t("dashboard.role.syncData") }}
                </router-link> -->
                <!-- <router-link to="/role/add" class="el-button el-button--primary el-button--small">
                    <i class="el-icon-plus"></i> {{ $t("dashboard.role.customRole") }}
                </router-link> -->
            </div>
        </h2>
        <div class="m-role-list-filter">
            <el-select v-model="mount" popper-class="m-school-pop" style="width: 200px" size="large">
                <el-option :label="$t('dashboard.common.all')" value=""></el-option>
                <el-option
                    v-for="(school, school_id) in school_id_map"
                    :key="school_id"
                    :value="school_id"
                    :label="school"
                    class="u-school"
                >
                    <img width="24" height="24" :src="showSchoolIcon(school_id)" />
                    {{ school }}
                </el-option>
            </el-select>
            <el-input class="u-name" v-model="name" :placeholder="$t('dashboard.role.namePlaceholder')" size="large">
                <template #prepend> <i class="el-icon-search"></i>&nbsp;{{ $t("dashboard.common.search") }} </template>
            </el-input>
        </div>
        <ContentSkeleton v-if="loading" variant="list" :rows="6" />
        <div class="m-team-rolelist" v-else-if="data && data.length">
            <ul class="u-list">
                <li class="u-item" v-for="item in data" :key="item.ID" :class="{ auth: !item.custom }">
                    <router-link :to="'/role/' + item.ID" class="u-avatar">
                        <img class="u-pic" :src="showAvatar(item.mount, item.body_type)" alt />
                        <i class="u-status" v-if="!item.custom" :title="$t('dashboard.role.verified')">
                            <img svg-inline src="@/assets/img/dashboard/verify.svg" />
                        </i>
                    </router-link>
                    <span class="u-title">
                        <router-link class="u-rolename" :to="'/role/' + item.ID">{{ item.name }}</router-link>
                        <el-tag v-if="item.is_default_role" type="warning">{{ $t("dashboard.common.default") }}</el-tag>
                        <span class="u-star" :class="{ on: item.priority }" @click="starRole(item)">
                            <el-tooltip
                                class="item"
                                effect="dark"
                                :content="item.priority ? $t('dashboard.role.unpin') : $t('dashboard.role.pin')"
                                placement="top"
                            >
                                <i class="el-icon-star-on" v-if="item.priority"></i>
                                <i class="el-icon-star-off" v-else></i>
                            </el-tooltip>
                        </span>
                    </span>
                    <span class="u-meta">
                        <span class="u-server">
                            <em>{{ $t("dashboard.role.server") }}</em>
                            {{ item.server }}
                        </span>
                        <span class="u-mount">
                            <em>{{ $t("dashboard.role.school") }}</em>
                            <img class="u-icon" :src="showSchoolIcon(item.mount)" />
                            {{ showSchoolName(item.mount, $t("dashboard.common.unknown")) }}
                        </span>
                        <!-- <span class="u-team-name" v-if="item.team_relation && item.team_relation.team_id">
                            <em>{{ $t("dashboard.role.teamName") }}</em>
                            {{ item.team_relation.team_name }}
                        </span> -->
                        <!--<span class="u-team-status" v-if="item.team_relation && item.team_relation.team_id">
                            <em>{{ $t("dashboard.common.status") }}</em>
                            <span class="u-team-status" :class="`u-team-status-${item.team_relation.status}`">{{ teamStatus(item.team_relation.status) }}</span>
                        </span>-->
                        <span class="u-note">
                            <em>{{ $t("dashboard.common.remark") }}</em>
                            {{ item.note }}
                            <span class="u-addnote" @click="addNote(item)">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="$t('dashboard.role.setRemark')"
                                    placement="top"
                                >
                                    <i class="el-icon-edit-outline"></i>
                                </el-tooltip>
                            </span>
                        </span>
                    </span>
                    <span class="u-time u-achievement"
                        >{{ $t("dashboard.role.achievementData") }}:
                        <template v-if="item.sync_achievements"
                            ><i class="el-icon-success u-success"></i>{{ $t("dashboard.role.synced") }}</template
                        >
                        <template v-else
                            ><i class="el-icon-warning-outline u-warning"></i
                            >{{ $t("dashboard.role.notSynced") }}</template
                        >
                    </span>
                    <div class="u-op">
                        <el-switch
                            v-model="item.is_public_visible"
                            :active-value="1"
                            :inactive-value="0"
                            @change="onPublicChange(item)"
                            class="u-public"
                            :active-text="$t('dashboard.common.public')"
                        >
                        </el-switch>
                        <el-dropdown @command="handleCommand" trigger="click">
                            <el-button type="default">
                                {{ $t("dashboard.common.more") }}<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item :command="{ item, command: 'default' }">
                                        <i class="el-icon-setting"></i>
                                        {{
                                            item.is_default_role
                                                ? $t("dashboard.role.unsetDefault")
                                                : $t("dashboard.role.setDefault")
                                        }}
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="!item.custom" :command="{ item, command: 'unbind' }">
                                        <i class="el-icon-remove-outline"></i>
                                        {{ $t("dashboard.common.unbind") }}
                                    </el-dropdown-item>
                                    <template v-else>
                                        <el-dropdown-item :command="{ item, command: 'edit' }">
                                            <i class="el-icon-edit-outline"></i>
                                            {{ $t("dashboard.common.edit") }}
                                        </el-dropdown-item>
                                        <el-dropdown-item :command="{ item, command: 'delete' }">
                                            <i class="el-icon-delete"></i>
                                            {{ $t("dashboard.common.delete") }}
                                        </el-dropdown-item>
                                    </template>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </li>
            </ul>
        </div>
        <template v-else-if="loadError">
            <el-alert
                class="m-archive-null"
                :title="loadError"
                type="error"
                center
                show-icon
                :closable="false"
            ></el-alert>
            <div class="m-role-null">
                <el-button type="primary" size="small" @click="loadData">
                    <i class="el-icon-refresh"></i> {{ $t("dashboard.common.reload") }}
                </el-button>
            </div>
        </template>
        <template v-else>
            <el-alert
                class="m-archive-null"
                :title="$t('dashboard.common.noItems')"
                type="info"
                center
                show-icon
            ></el-alert>
            <div class="m-role-null">
                <router-link to="/role/bind" class="el-button el-button--primary el-button--small">
                    <i class="el-icon-connection"></i> {{ $t("dashboard.role.bind") }}
                </router-link>
                <router-link to="/role/add" class="el-button el-button--primary el-button--small">
                    <i class="el-icon-plus"></i> {{ $t("dashboard.role.customRole") }}
                </router-link>
            </div>
        </template>
        <el-dialog
            :title="$t('dashboard.role.setRemark')"
            v-model="noteVisible"
            :width="isPhone ? '95%' : '30%'"
            class="m-team-note-dialog"
        >
            <div>
                <el-input
                    v-model="note"
                    :placeholder="$t('dashboard.common.contentPlaceholder')"
                    :maxlength="20"
                    :show-word-limit="true"
                ></el-input>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="noteVisible = false">{{ $t("dashboard.common.cancel") }}</el-button>
                    <el-button type="primary" @click="confirmNote">{{ $t("dashboard.common.confirm") }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {
    getRoles,
    unbindRole,
    noteRole,
    deleteRole,
    starRole,
    unstarRole,
    updateRoleVisible,
    defaultRole,
} from "@/service/dashboard/role.js";
import school_id_map from "@jx3box/jx3box-data/data/xf/schoolid.json";
import { __imgPath, __cdn } from "@/utils/config";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { showSchoolIcon, showSchoolName, showTime, getThumbnail } from "@/utils/filters";

// 计算排序权重
const getWeight = (role) => {
    if (role.is_default_role) return 0; // 默认角色优先级最高
    if (role.priority) return 1; // 收藏角色第二
    if (!role.custom) return 2; // 认证角色第三
    return 3; // 其他角色最后
};
export default {
    name: "ListRole",
    props: [],
    data: function () {
        return {
            data: [],
            loading: false,
            loadError: "",
            loadSeq: 0,

            // 备注
            noteVisible: false,
            currentItem: "",
            note: "",

            // 角色过滤
            mount: "",
            name: "",
            xfmap,
            school_id_map,

            isPhone: window.innerWidth < 768,
        };
    },
    computed: {
        params: function () {
            return {
                mount: this.mount,
                name: this.name,
                _no_page: 1,
            };
        },
    },
    methods: {
        showSchoolIcon,
        showSchoolName,
        showTime,
        unbind: function (id) {
            this.$confirm(this.$t("dashboard.role.unbindTip"), this.$t("dashboard.common.tip"), {
                confirmButtonText: this.$t("dashboard.role.confirmUnbind"),
                cancelButtonText: this.$t("dashboard.common.cancel"),
                callback: (action) => {
                    if (action == "confirm") {
                        unbindRole(id).then((res) => {
                            this.$notify({
                                title: this.$t("dashboard.common.unbindSuccess"),
                                message: this.$t("dashboard.role.unbindSuccess"),
                                type: "success",
                            });
                            this.loadData();
                        });
                    }
                },
            });
        },
        getErrorMessage: function (err, fallback) {
            fallback = fallback || this.$t("dashboard.role.loadFailed");
            return err?.response?.data?.msg || err?.response?.data?.message || err?.message || fallback;
        },
        loadData: function () {
            const seq = ++this.loadSeq;
            this.loading = true;
            this.loadError = "";
            getRoles(this.params)
                .then((res) => {
                    if (seq !== this.loadSeq) return;
                    this.data = res.data.data.list || [];
                    // 进行排序
                    // 默认角色第一
                    // 收藏角色第一梯队
                    // 认证角色第二梯队（即custom=0，就是游戏内绑定的，而不是自定义的）
                    // 其它角色
                    this.data.sort((a, b) => {
                        const weightA = getWeight(a);
                        const weightB = getWeight(b);

                        // 如果权重不同，按权重排序
                        if (weightA !== weightB) {
                            return weightA - weightB;
                        }

                        // 权重相同时，按名称排序
                        return a.name.localeCompare(b.name);
                    });
                })
                .catch((err) => {
                    if (seq !== this.loadSeq) return;
                    this.data = [];
                    this.loadError = this.getErrorMessage(err);
                })
                .finally(() => {
                    if (seq !== this.loadSeq) return;
                    this.loading = false;
                });
        },
        showAvatar: function (mount, body_type) {
            return getThumbnail(__cdn + "design/avatar/xisai/" + mount + "-" + body_type + ".png");
        },
        go: function (route) {
            this.$router.push(route);
        },
        addNote: function (item) {
            this.noteVisible = true;
            this.currentItem = item;
            this.note = item.note || "";
        },
        confirmNote: function () {
            noteRole(this.currentItem.ID, this.note).then((res) => {
                this.noteVisible = false;
                this.currentItem.note = this.note;
                this.note = "";

                this.$notify({
                    title: this.$t("dashboard.common.success"),
                    message: this.$t("dashboard.role.remarkSuccess"),
                    type: "success",
                });
            });
        },
        delRole: function (role_id) {
            this.$alert(this.$t("dashboard.role.deleteConfirm"), this.$t("dashboard.common.message"), {
                confirmButtonText: this.$t("dashboard.common.confirm"),
                callback: (action) => {
                    if (action == "confirm") {
                        deleteRole(role_id).then((res) => {
                            this.$notify({
                                title: this.$t("dashboard.common.deleteSuccess"),
                                message: this.$t("dashboard.role.deleteSuccess"),
                                type: "success",
                            });
                            this.loadData();
                        });
                    }
                },
            });
        },
        starRole: function (item) {
            if (item.priority) {
                unstarRole(item.ID).then((res) => {
                    item.priority = 0;
                    this.$notify({
                        title: this.$t("dashboard.role.unstarSuccess"),
                        message: this.$t("dashboard.role.roleUnstarSuccess"),
                        type: "success",
                    });
                });
            } else {
                starRole(item.ID).then((res) => {
                    item.priority = Date.now();
                    this.$notify({
                        title: this.$t("dashboard.role.starSuccess"),
                        message: this.$t("dashboard.role.roleStarSuccess"),
                        type: "success",
                    });
                });
            }
        },

        handleCommand(data) {
            if (data.command == "unbind") {
                this.unbind(data.item.ID);
            } else if (data.command == "edit") {
                this.$router.push("/role/edit/" + data.item.ID);
            } else if (data.command == "delete") {
                this.delRole(data.item.ID);
            } else if (data.command == "default") {
                defaultRole(data.item.ID, ~~!data.item.is_default_role).then((res) => {
                    this.$message({
                        title: this.$t("dashboard.common.success"),
                        message: ~~!data.item.is_default_role
                            ? this.$t("dashboard.common.setSuccess")
                            : this.$t("dashboard.common.cancelSuccess"),
                        type: "success",
                    });
                    this.loadData();
                });
            }
        },
        onPublicChange: function (item) {
            const nextVisible = item.is_public_visible;
            const oldVisible = nextVisible ? 0 : 1;
            updateRoleVisible(item.ID, nextVisible)
                .then((res) => {
                    this.$notify({
                        title: this.$t("dashboard.common.success"),
                        message: this.$t("dashboard.common.setSuccess"),
                        type: "success",
                    });
                })
                .catch((err) => {
                    item.is_public_visible = oldVisible;
                    this.$message.error(this.getErrorMessage(err, this.$t("dashboard.common.setFailed")));
                });
        },
        teamStatus(status) {
            return {
                0: this.$t("dashboard.role.pendingReview"),
                1: this.$t("dashboard.role.approved"),
            }[status];
        },
    },
    created: function () {},
    watch: {
        params: {
            immediate: true,
            handler: function (val) {
                this.loadData();
            },
        },
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/role/list_role.less";
</style>
