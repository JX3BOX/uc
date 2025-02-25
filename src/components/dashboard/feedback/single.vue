<template>
    <div class="m-feed-single" v-if="data">
        <div class="m-feed-content">
            <main class="m-single-content" v-loading="loading">
                <div class="m-type">
                    <div class="u-title">
                        <span class="u-status" :style="{ backgroundColor: statusColors[data.status] }">{{
                            statusMap[data.status]
                        }}</span>
                        <div class="u-type">
                            <span class="u-value">{{ types[data.type] }}</span>
                            <span class="u-value">{{ subtypes[data.subtype] }}</span>
                        </div>
                    </div>
                    <el-dropdown
                        v-if="isTeammate && data.status < 12"
                        size="small"
                        split-button
                        trigger="click"
                        type="primary"
                        @click.stop="onDeal"
                    >
                        <i class="el-icon-s-tools"></i>
                        {{ statusText(data.status) }}
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click.native="handleEdit">
                                    <el-button class="u-btn" type="primary" size="small" icon="el-icon-edit-outline"
                                        >编辑</el-button
                                    >
                                </el-dropdown-item>
                                <el-dropdown-item v-if="data.status === 1" @click.native="handleTransfer">
                                    <el-button class="u-btn" type="warning" size="small" icon="el-icon-right"
                                        >转交</el-button
                                    >
                                </el-dropdown-item>
                                <template v-if="data.status === 2">
                                    <el-dropdown-item @click.native="handleCoordination">
                                        <el-button class="u-btn" type="success" size="small" icon="el-icon-help"
                                            >协同</el-button
                                        >
                                    </el-dropdown-item>

                                    <el-dropdown-item @click.native="handleClose">
                                        <el-button class="u-btn" type="info" size="small" icon="el-icon-circle-close"
                                            >关闭
                                        </el-button>
                                    </el-dropdown-item>
                                </template>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="m-block m-user">
                    <div class="u-subblock">
                        <span class="u-label">提交人：</span>
                        <a class="u-item u-user" :href="authorLink(data.user.id)" target="_blank">
                            <img class="u-user-avatar" :src="showAvatar(data.user.avatar)" />
                            <span class="u-user-name">{{ data.user.display_name }}</span>
                        </a>
                    </div>
                    <span class="u-time u-subblock">提交时间：{{ formateTime(data.created_at) }}</span>
                </div>
                <div class="m-block m-dev">
                    <div class="u-subblock">
                        <span class="u-label">分配至：</span>
                        <div class="u-list u-list-assign" v-if="data.assign_user && data.assign_user.length">
                            <a
                                class="u-item u-assign"
                                :href="authorLink(assign.id)"
                                target="_blank"
                                v-for="assign in data.assign_user"
                                :key="assign.id"
                            >
                                <img class="u-assign-avatar" :src="showAvatar(assign.avatar)" />
                                <span class="u-assign-name">{{ assign.display_name }}</span>
                            </a>
                        </div>
                        <div class="u-list u-list-assign" v-else>
                            <a class="u-item u-assign" :href="authorLink(1)" target="_blank">
                                <img
                                    class="u-assign-avatar"
                                    :src="showAvatar('https://oss.jx3box.com/upload/avatar/2021/3/18/6568744.png')"
                                />
                                <span class="u-assign-name">JX3BOX</span>
                            </a>
                        </div>
                    </div>
                    <div class="u-subblock" v-if="data.coordination_user?.length">
                        <span class="u-label">协同人：</span>
                        <div class="u-list u-list-assign">
                            <a
                                class="u-item u-assign"
                                :href="authorLink(item.id)"
                                target="_blank"
                                v-for="item in data.coordination_user"
                                :key="item.id"
                            >
                                <img class="u-assign-avatar" :src="showAvatar(item.avatar)" />
                                <span class="u-assign-name">{{ item.display_name }}</span>
                            </a>
                        </div>
                    </div>
                    <div class="u-subblock">
                        <span class="u-label">关联仓库：</span>
                        <div class="u-list u-list-repo">
                            <a
                                class="u-repo u-item"
                                :href="formateGithub(data.repository)"
                                v-if="data.repository"
                                target="_blank"
                            >
                                <img class="u-repo-icon" src="@/assets/img/dashboard/feedback/github.svg" alt="" />
                                <span class="u-repo-name">{{ data.repository }}</span>
                            </a>
                            <div class="u-null" v-else>-</div>
                        </div>
                    </div>
                </div>
                <div class="m-block m-refer" v-if="data.refer">
                    <div class="u-subblock">
                        <span class="u-label">来源：</span>
                        <a class="u-item u-user" :href="data.refer" target="_blank">
                            {{ data.refer }}
                        </a>
                    </div>
                </div>
                <el-steps class="m-steps" :active="currentStep" align-center finish-status="success">
                    <el-step :title="step.text" v-for="step in statusList" :key="step.value" />
                </el-steps>
                <div class="m-content m-textarea">
                    <el-divider content-position="left"><i class="el-icon-edit-outline"></i> 反馈内容</el-divider>
                    <div class="u-detail">
                        <span v-html="sanitizedHTML(data.content)"></span>
                    </div>
                </div>
                <div class="m-attachment m-textarea">
                    <el-divider content-position="left"
                        ><i class="el-icon-picture-outline-round"></i> 附件截图</el-divider
                    >
                    <div class="u-detail">
                        <div class="u-img" v-for="(img, index) in data.images" :key="index">
                            <el-image :src="img" lazy :preview-src-list="data.images"></el-image>
                        </div>
                    </div>
                </div>
                <div class="m-feedback-thx">
                    <el-divider content-position="left"
                        ><i class="el-icon-coin"></i> 反馈回馈
                        <el-button v-if="isAdmin" size="mini" class="u-thx-trigger" type="success" @click="onThx"
                            >品鉴</el-button
                        ></el-divider
                    >
                    <div class="u-thx-table">
                        <el-table size="mini" stripe border :data="thxData">
                            <el-table-column label="参与打赏" prop="ext_operate_user_info">
                                <template #default="{ row }">
                                    <div class="m-user">
                                        <img class="u-gift" svg-inline :src="giftUrl" />
                                        <a
                                            class="u-item u-user"
                                            :href="authorLink(row.ext_operate_user_info.id)"
                                            target="_blank"
                                        >
                                            <img
                                                class="u-user-avatar"
                                                :src="showAvatar(row.ext_operate_user_info.avatar)"
                                            />
                                            <span class="u-user-name">{{
                                                row.ext_operate_user_info.display_name
                                            }}</span>
                                        </a>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="盒币" prop="count">
                                <template #default="{ row }">
                                    <span class="u-count">+{{ row.count }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="寄语" prop="remark"></el-table-column>
                            <el-table-column label="时间" prop="created_at">
                                <template #default="{ row, $index }">
                                    <time :datetime="row.created_at">{{ row.created_at }}</time>

                                    <span class="u-delete" v-if="isSuperAdmin" @click="recovery(row, $index)">
                                        <i class="el-icon-delete"></i>撤销
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="m-reply" v-if="done">
                    <el-divider content-position="left"><i class="el-icon-chat-line-square"></i> 回复处理</el-divider>
                    <Comment :id="id" category="feedback" order="desc" />
                </div>
            </main>

            <Homework
                v-model="showThx"
                title="反馈回馈"
                :postType="postType"
                :postId="id"
                client="std"
                :userId="data.user_id"
                :article-id="~~id"
                category="feedback"
                placeholder="感谢！Best wishes (#^.^#)"
                @updateRecord="loadRecord"
            ></Homework>
        </div>
        <div class="m-feed-log" v-loading="logLoading">
            <el-divider content-position="left"> <i class="el-icon-document"></i>日志记录 </el-divider>

            <el-timeline v-if="logs.length" :reverse="false">
                <el-timeline-item v-for="(log, index) in logs" :key="index" :timestamp="log.created_at">
                    <div class="u-op">
                        <span class="u-label">操作人:</span>
                        <a class="u-item u-user" :href="authorLink(log.operator.id)" target="_blank">
                            <img class="u-avatar" :src="showAvatar(log.operator.avatar)" />
                            <span class="u-name">{{ log.operator.display_name }}</span>
                        </a>
                    </div>
                    <div class="u-content" v-if="log.status === 1 || log.status === 4">
                        将工单{{ log.status === 1 ? "指派" : "转交" }}给了
                        <a
                            class="u-item u-user"
                            v-for="(item, i) in log.assign_list"
                            :key="i"
                            :href="authorLink(log.operator.id)"
                            target="_blank"
                        >
                            <img class="u-avatar" :src="showAvatar(item.avatar)" />
                            <span class="u-name">{{ item.display_name }}</span>
                        </a>
                    </div>
                    <div class="u-content" v-else-if="log.status === 5">
                        邀请
                        <a
                            class="u-item u-user"
                            v-for="(item, i) in log.coordination_list"
                            :key="i"
                            :href="authorLink(item.id)"
                            target="_blank"
                        >
                            <img class="u-avatar" :src="showAvatar(item.avatar)" />
                            <span class="u-name">{{ item.display_name }}</span>
                        </a>
                        进行协同
                    </div>
                    <div class="u-content" v-else>{{ logMap(log.status) }}工单</div>
                    <div class="u-remark" v-if="log.remark">{{ log.remark || "-" }}</div>
                </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无日志"></el-empty>
        </div>
        <assign
            v-if="assignVisible"
            :visible="assignVisible"
            :teams="teammates"
            :staged="data"
            :type="opType"
            @update="load"
            @close="assignVisible = false"
        ></assign>
        <edit
            v-if="editVisible"
            :visible="editVisible"
            :staged="data"
            @update="load"
            @close="editVisible = false"
        ></edit>
        <status
            v-if="statusVisible"
            :visible="statusVisible"
            :isClose="isClose"
            :staged="data"
            @update="load"
            @close="statusVisible = false"
        ></status>
    </div>
</template>

<script>
import DOMPurify from "dompurify";
import { getFeedback, updateFeedback, getFeedbackLog } from "@/service/dashboard/feedback";
import { getTeammates } from "@/service/dashboard/index";
import { types, subtypes, statusMap, statusColors } from "@/assets/data/dashboard/feedback.json";
import { showAvatar, authorLink } from "@jx3box/jx3box-common/js/utils";
import moment from "moment";
import Comment from "@jx3box/jx3box-comment-ui/src/Comment.vue";
// 打赏相关
import { getPostBoxcoinRecords, recoveryBoxcoin } from "@/service/dashboard/thx.js";
import Homework from "@jx3box/jx3box-common-ui/src/interact/Homework.vue";
import User from "@jx3box/jx3box-common/js/user";
import AdminGift from "@jx3box/jx3box-common-ui/assets/img/widget/admin_gift.svg";
import assign from "./components/assign.vue";
import edit from "./components/edit.vue";
import status from "./components/status.vue";
export default {
    name: "FeedbackSingle",
    components: {
        Comment,
        Homework,
        assign,
        edit,
        status,
    },
    data() {
        return {
            data: "",

            loading: false,

            types,
            subtypes,
            statusMap,
            statusColors,

            done: false,

            teammates: [],

            // 打赏相关
            thxData: [],
            showThx: false,
            postType: "feedback",
            giftUrl: AdminGift,

            logs: [],
            logLoading: false,

            assignVisible: false,
            editVisible: false,
            opType: "assign",
            statusVisible: false,
            isClose: false,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        isTeammate() {
            return this.$store.state.isTeammate;
        },
        isAdmin() {
            return User.isAdmin();
        },
        isSuperAdmin() {
            return User.isSuperAdmin();
        },
        statusList() {
            const _list = Object.entries(statusMap).map(([key, value]) => {
                return {
                    text: value,
                    value: ~~key,
                };
            });
            const filterStatus = this.data.status === 11 ? 10 : 11;
            const list = _list.filter((item) => item.value !== filterStatus);
            return list;
        },
        currentStep() {
            const index = this.statusList.findIndex((item) => item.value === this.data.status) + 1;
            return index;
        },
    },
    watch: {
        id: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.load();
                }
            },
        },
    },
    mounted() {
        this.loadTeammates();

        this.loadRecord();
    },
    methods: {
        logMap(status) {
            let str = "创建";
            if (status === 2) {
                str = "开始处理";
            }
            if (status === 10) {
                str = "处理完成";
            }
            if (status === 11) {
                str = "关闭";
            }
            if (status === 12) {
                str = "完结";
            }
            return str;
        },
        statusText(status) {
            let str = "处理";
            if (status === 0) {
                str = "指派";
            } else if (status === 1) {
                str = "开始处理";
            } else if (status === 2) {
                str = "处理完成";
            } else if (status === 10 || status === 11) {
                str = "结束工单";
            }
            return str;
        },
        load() {
            this.getData();
            this.loadLogs();
        },
        onDeal() {
            if (this.data.status === 0) {
                // 待处理 指派
                this.handleAssign();
            }
            if (
                this.data.status === 1 ||
                this.data.status === 2 ||
                this.data.status === 10 ||
                this.data.status === 11
            ) {
                this.handleStatus();
            }
        },
        handleAssign() {
            this.opType = "assign";
            this.assignVisible = true;
        },
        handleTransfer() {
            this.opType = "transfer";
            this.assignVisible = true;
        },
        handleCoordination() {
            this.opType = "coordination";
            this.assignVisible = true;
        },
        handleStatus() {
            this.isClose = false;
            this.statusVisible = true;
        },
        handleEdit() {
            this.editVisible = true;
        },
        handleClose() {
            this.isClose = true;
            this.statusVisible = true;
        },
        loadLogs() {
            this.logLoading = true;
            getFeedbackLog(this.id)
                .then((res) => {
                    this.logs = res.data.data;
                })
                .finally(() => {
                    this.logLoading = false;
                });
        },
        async getData() {
            try {
                this.loading = true;
                let res = await getFeedback(this.id);
                this.data = res.data.data;
                this.data.content = this.data.content.replace(/\n/g, "<br>");
                this.done = true;
            } catch (e) {
                console.log(e);
            } finally {
                this.loading = false;
            }
        },
        async loadTeammates() {
            try {
                let res = await getTeammates();
                this.teammates = res.data.data.filter(
                    (item) => item.group && ["mp", "developer", "designer"].includes(item.group)
                );
            } catch (e) {
                console.log(e);
            }
        },
        back() {
            this.$router.go(-1);
        },
        authorLink,
        showAvatar,
        formateTime(time) {
            return moment(time).format("YYYY-MM-DD HH:mm:ss");
        },
        formateGithub(val) {
            return `https://github.com/JX3BOX/${val}`;
        },
        formateDuty(val) {
            return (
                (val &&
                    val.reduce((prev, curr) => {
                        return prev + " | " + curr;
                    })) ||
                ""
            );
        },

        sanitizedHTML(html) {
            return DOMPurify.sanitize(html);
        },

        // 打赏相关
        onThx() {
            this.showThx = true;
        },
        loadRecord() {
            getPostBoxcoinRecords(this.postType, this.id, { pageSize: 12, pageIndex: 1 }).then((res) => {
                this.thxData = res.data.data?.list || [];
            });
        },
        recovery: function (item, i) {
            this.$alert("是否确定撤销该评分？", "确认", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        recoveryBoxcoin(item.id).then(() => {
                            this.$message({
                                message: "撤销成功",
                                type: "success",
                            });
                            this.list.splice(i, 1);
                        });
                    }
                },
            });
        },
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/feedback_single.less";
</style>
