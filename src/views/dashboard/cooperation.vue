<template>
    <div class="m-dashboard m-cooperation">
        <h2 class="u-title">
            <span class="u-title-text">
                <i class="el-icon-reading"></i>
                {{ $t("dashboard.cooperation.title") }}
                <el-tag class="u-sign" type="success" size="small" v-if="isSuperAuthor"
                    >{{ $t("dashboard.cooperation.duration") }}：{{ signDuration }}{{ signDurationType }}</el-tag
                >
            </span>
            <el-button class="u-unlock-btn" type="primary" @click="openPage" v-if="isSuperAuthor" icon="Unlock"> {{ $t("dashboard.filter.title") }} </el-button>
        </h2>
        <div class="m-cooperation-ac m-block" v-html="data"></div>
        <div class="m-cooperation-form m-block">
            <h3>{{ $t("dashboard.cooperation.instructionsTitle") }}</h3>
            <div>
                <p>{{ $t("dashboard.cooperation.instruction1") }}</p>
                <p>{{ $t("dashboard.cooperation.instruction2") }}</p>
                <p>
                    {{ $t("dashboard.cooperation.instruction3Prefix") }}<a href="https://jq.qq.com/?_wv=1027&k=3Hgmu6jg">140129951</a
                    >{{ $t("dashboard.cooperation.instruction3Suffix") }}
                </p>
            </div>
            <hr />
            <el-alert
                :title="$t('dashboard.cooperation.approved')"
                type="success"
                :description="$t('dashboard.cooperation.approvedDescription', { time: signAt })"
                show-icon
                :closable="false"
                v-if="isSuperAuthor"
            >
            </el-alert>
            <el-alert
                :title="$t('dashboard.cooperation.pending')"
                type="warning"
                :description="$t('dashboard.cooperation.pendingDescription')"
                show-icon
                :closable="false"
                v-if="!isSuperAuthor && !checked"
            >
            </el-alert>
            <el-alert
                :title="$t('dashboard.cooperation.rejected')"
                type="error"
                :description="checkedRemark || $t('dashboard.cooperation.rejectedDescription')"
                show-icon
                :closable="false"
                v-if="!isSuperAuthor && checked == 2"
            >
            </el-alert>
            <h3>{{ $t("dashboard.cooperation.infoTitle") }}</h3>
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="100px"
                :label-position="position"
                :disabled="isSuperAuthor || !checked"
            >
                <el-form-item class="u-item" :label="$t('dashboard.profile.nickname')" prop="nickname">
                    <el-input v-model="form.nickname" :placeholder="$t('dashboard.profile.nicknamePlaceholder')" size="large"></el-input>
                </el-form-item>

                <el-form-item class="u-item" label="QQ" prop="qq">
                    <el-input v-model="form.qq" :placeholder="$t('dashboard.cooperation.qqPlaceholder')" size="large"></el-input>
                </el-form-item>

                <el-form-item class="u-item" :label="$t('dashboard.common.phone')" prop="phone">
                    <el-input v-model="form.phone" :placeholder="$t('dashboard.cooperation.phonePlaceholder')" size="large"></el-input>
                </el-form-item>

                <el-form-item class="u-item" :label="$t('dashboard.cooperation.socialPlatform')" prop="weibo">
                    <el-input v-model="form.weibo" :placeholder="$t('dashboard.cooperation.socialPlaceholder')" size="large"></el-input>
                </el-form-item>

                <el-form-item class="u-item" :label="$t('dashboard.cooperation.selfIntroduction')" prop="description">
                    <el-input
                        type="textarea"
                        :rows="8"
                        :maxlength="800"
                        :placeholder="$t('dashboard.cooperation.descriptionPlaceholder')"
                        v-model="form.description"
                        show-word-limit
                        size="large"
                    ></el-input>
                </el-form-item>

                <el-form-item class="u-btns" label>
                    <el-button
                        type="primary"
                        class="u-submit"
                        @click="submitForm('form')"
                        icon="Promotion"
                        size="large"
                        :disabled="isSuperAuthor || processing"
                        >{{ $t("dashboard.cooperation.submit") }}</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import User from "@jx3box/jx3box-common/js/user";
import {
    contractAuthorApply,
    getSuperAuthorState,
    getContractAuthorLogs,
    getLastContractAuthorLog,
} from "@/service/dashboard/cooperation";
import { getBreadcrumb } from "@jx3box/jx3box-common/js/system.js";
import { pick } from "lodash";
import dayjs from "dayjs";
export default {
    name: "cooperation",
    props: [],
    data: function () {
        return {
            position: window.innerWidth < 768 ? "top" : "left",
            form: {
                nickname: "",
                qq: "",
                phone: "",
                weibo: "",
                description: "",
            },
            rules: {
                nickname: [{ required: true, message: this.$t("dashboard.profile.nicknamePlaceholder"), trigger: "blur" }],
                qq: [
                    {
                        required: true,
                        message: this.$t("dashboard.profile.qqPlaceholder"),
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: this.$t("dashboard.cooperation.phonePlaceholder"),
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: this.$t("dashboard.cooperation.descriptionRequired"),
                        trigger: "blur",
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(new Error(this.$t("dashboard.cooperation.descriptionEmpty")));
                                return;
                            }
                            const urlStart = "https://www.jx3box.com/";
                            let count = 0;

                            const parts = value.split(urlStart);
                            count = parts.length - 1;

                            if (count < 3) {
                                callback(new Error(this.$t("dashboard.cooperation.linksRequired", { count })));
                            } else {
                                callback();
                            }
                        },
                        trigger: "blur",
                    },
                ],
            },
            user: User, // 用户信息
            isSuperAuthor: false, // 是否为签约作者

            // 请求成功的一次
            checked: -1,
            checkedRemark: "",

            // 签约记录
            logs: [],
            last: {},

            processing: false,

            data: "",
        };
    },
    computed: {
        // 最近一次申请记录
        log: function () {
            return this.logs && this.logs[0];
        },
        signDuration: function () {
            // 检查是否有有效的签约记录
            if (!this.last || this.last["updated"] === undefined) {
                return 0; // 无签约记录则返回0
            }

            const checkedDate = dayjs(this.last["updated"] * 1000);
            const now = dayjs();
            const diffYears = now.diff(checkedDate, "year");

            // 如果已签约且不足一年，返回天数；否则返回年数
            return this.last["checked"] === 1 && diffYears < 1 ? now.diff(checkedDate, "day") : diffYears;
        },
        signDurationType: function () {
            return this.signDuration < 1 ? this.$t("dashboard.common.days") : this.$t("dashboard.common.years");
        },
        signAt: function () {
            return this.last["updated"] ? dayjs(this.last["updated"] * 1000).format("YYYY-MM-DD HH:mm:ss") : "";
        },
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const data = pick(this.form, ["nickname", "qq", "phone", "weibo", "description"]);
                    this.processing = true;
                    contractAuthorApply(data)
                        .then((res) => {
                            this.checked = 0;
                            this.$message.success(this.$t("dashboard.cooperation.submitSuccess"));
                        })
                        .catch((e) => {
                            this.$message.error(this.getErrorMessage(e));
                        })
                        .finally(() => {
                            this.processing = false;
                        });
                }
            });
        },
        getErrorMessage(e) {
            return e?.response?.data?.msg || e?.response?.data?.message || e?.message || this.$t("dashboard.common.requestFailed");
        },
        // 是否为签约作者
        checkSuperUser: function () {
            this.user?.profile?.uid &&
                getSuperAuthorState(this.user?.profile?.uid)
                    .then((res) => {
                        this.isSuperAuthor = res.data.data;
                    })
                    .catch(() => {
                        this.isSuperAuthor = false;
                    });
        },
        // 加载申请记录
        loadContractAuthorLogs: function () {
            getContractAuthorLogs()
                .then((res) => {
                    this.logs = res.data.data?.list || [];
                    if (this.logs && this.logs.length) {
                        this.checked = this.logs[0]["checked"];
                        this.checkedRemark = this.logs[0]["check_remark"];
                        this.form = this.logs[0];
                    }
                })
                .catch(() => {
                    this.logs = [];
                    this.checked = -1;
                    this.checkedRemark = "";
                });
        },
        loadAc() {
            getBreadcrumb("sign-ac")
                .then((data) => {
                    this.data = data;
                })
                .catch(() => {
                    this.data = "";
                });
        },
        // 初始化
        init: function () {
            this.loadContractAuthorLogs();
            this.checkSuperUser();
            this.loadAc();
            this.loadLastLog();
        },
        openPage() {
            this.$router.push({ name: "filter" });
        },
        loadLastLog() {
            getLastContractAuthorLog()
                .then((res) => {
                    this.last = res.data.data || {};
                })
                .catch(() => {
                    this.last = {};
                });
        },
    },
    mounted: function () {
        this.init();
    },
};
</script>
<style lang="less">
.m-block {
    background-color: #fafbfc;
    border: 1px solid @color-link;
    margin: 15px 15px 5px 15px;
    padding: 10px 10px 10px 30px;
    border-radius: 6px;
    position: relative;

    h3,
    h6 {
        .fz(13px,22px);
        color: #333;
        margin: 10px 0;
    }
    p {
        font-size: 12px;
        line-height: 26px;
        margin: 0;
    }
}

.m-cooperation {
    .u-title {
        .flex;
        justify-content: space-between;
        align-items: center;
    }

    .u-title-text {
        .flex;
        align-items: center;
        gap: 10px;
    }

    .u-sign {
        font-size: 12px;
        font-weight: normal;
        margin-left: 10px;
    }
}
@media screen and (max-width: @phone) {
    .m-block {
        margin: 10px 0;
    }

    .u-unlock-btn {
        .pa;
        right: -10px;
    }
}
</style>
