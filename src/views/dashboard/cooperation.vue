<template>
    <div class="m-dashboard m-cooperation">
        <h2 class="u-title">
            <span class="u-title-text">
                <i class="el-icon-reading"></i>
                签约中心
                <el-tag class="u-sign" size="small" type="success" v-if="isSuperAuthor"
                    >签约时长：{{ signDuration }}{{ signDurationType }}</el-tag
                >
            </span>
            <el-button type="primary" @click="openPage" size="small" v-if="isSuperAuthor" icon="el-icon-unlock">
                敏感词测试
            </el-button>
        </h2>
        <div class="m-cooperation-ac m-block" v-html="data"></div>
        <div class="m-cooperation-form m-block">
            <h3>【认证说明】</h3>
            <div>
                <p>1、以下所有项目请务必填写真实有效，否则将不会处理，多次提交被拒后将不再接受申请。</p>
                <p>2、自述部分请填写魔盒内发布的有效作品链接（不少于3篇），站外链接将不会作为参考依据。</p>
                <p>
                    3、当成功接受申请后，请加入Q群<a href="https://jq.qq.com/?_wv=1027&k=3Hgmu6jg">140129951</a
                    >，不定期发放奖励或其它通知。
                </p>
            </div>
            <hr />
            <el-alert
                title="签约成功！"
                type="success"
                :description="`签约为每赛季审核一次，过期后如不满足条件的将会被取消资格。 本次签约时间：${signAt}`"
                show-icon
                :closable="false"
                v-if="isSuperAuthor"
            >
            </el-alert>
            <el-alert
                title="等待审核！"
                type="warning"
                description="签约申请提交成功，请耐心等待审核！"
                show-icon
                :closable="false"
                v-if="!isSuperAuthor && !checked"
            >
            </el-alert>
            <el-alert
                title="申请被驳回"
                type="error"
                :description="checkedRemark || '请填写有效的联系方式与作品，不符合要求的作品将不会受理。'"
                show-icon
                :closable="false"
                v-if="!isSuperAuthor && checked == 2"
            >
            </el-alert>
            <h3>【认证信息】</h3>
            <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="100px"
                :label-position="position"
                :disabled="isSuperAuthor || !checked"
            >
                <el-form-item class="u-item" label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
                </el-form-item>

                <el-form-item class="u-item" label="QQ" prop="qq">
                    <el-input v-model="form.qq" placeholder="请输入联系QQ"></el-input>
                </el-form-item>

                <el-form-item class="u-item" label="电话" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
                </el-form-item>

                <el-form-item class="u-item" label="社交平台" prop="weibo">
                    <el-input v-model="form.weibo" placeholder="请输入微博/B站地址"></el-input>
                </el-form-item>

                <el-form-item class="u-item" label="自述" prop="description">
                    <el-input
                        type="textarea"
                        :rows="8"
                        :maxlength="800"
                        placeholder="详述自己的一些作品"
                        v-model="form.description"
                        show-word-limit
                    ></el-input>
                </el-form-item>

                <el-form-item class="u-btns" label>
                    <el-button
                        type="primary"
                        class="u-submit"
                        @click="submitForm('form')"
                        icon="el-icon-s-promotion"
                        :disabled="isSuperAuthor || processing"
                        >提交签约申请</el-button
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
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc.js";
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
                nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
                qq: [
                    {
                        required: true,
                        message: "请输入QQ号码",
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: "请输入联系电话",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "请认真填写，否则将申请将不会被通过",
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
            if (!this.last || this.last["checked_at"] === undefined) {
                return 0; // 无签约记录则返回0
            }

            const checkedDate = dayjs(this.last["checked_at"] * 1000);
            const now = dayjs();
            const diffYears = now.diff(checkedDate, "year");

            // 如果已签约且不足一年，返回天数；否则返回年数
            return this.last["checked"] === 1 && diffYears < 1 ? now.diff(checkedDate, "day") : diffYears;
        },
        signDurationType: function () {
            return this.signDuration < 1 ? "天" : "年";
        },
        signAt: function () {
            return this.last["checked_at"] ? dayjs(this.last["checked_at"] * 1000).format("YYYY-MM-DD HH:mm:ss") : "";
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
                            this.$message.success("提交申请成功，请等待管理审核。");
                        })
                        .catch((e) => {
                            this.$message.error(e.message);
                        })
                        .finally(() => {
                            this.processing = false;
                        });
                }
            });
        },
        // 是否为签约作者
        checkSuperUser: function () {
            this.user?.profile?.uid &&
                getSuperAuthorState(this.user?.profile?.uid).then((res) => {
                    this.isSuperAuthor = res.data.data;
                });
        },
        // 加载申请记录
        loadContractAuthorLogs: function () {
            getContractAuthorLogs().then((res) => {
                this.logs = res.data.data.list;
                if (this.logs && this.logs.length) {
                    this.checked = this.logs[0]["checked"];
                    this.checkedRemark = this.logs[0]["check_remark"];
                    this.form = this.logs[0];
                }
            });
        },
        loadAc() {
            getBreadcrumb("sign-ac").then((data) => {
                this.data = data;
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
            getLastContractAuthorLog().then((res) => {
                this.last = res.data.data;
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
        gap:10px;
    }

    .u-sign {
        font-size: 14px;
        font-weight: normal;
        margin-left: 10px;
    }
}
@media screen and (max-width: @phone) {
    .m-block {
        margin: 10px 0;
    }
}
</style>
