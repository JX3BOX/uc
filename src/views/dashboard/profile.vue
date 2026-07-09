<template>
    <uc>
        <el-form class="m-profile-basic" ref="form" label-width="100px" :label-position="position">
            <el-form-item class="u-name" label="昵称">
                <div class="u-value">
                    {{ nickname }}
                    <a
                        class="u-edit el-button el-button--primary el-button--small"
                        href="/vip/rename?from=dashboard_profile"
                        target="_blank"
                    >
                        <i class="el-icon-edit"></i> 修改昵称
                    </a>
                </div>
            </el-form-item>

            <el-form-item class="u-name" label="服务器">
                <el-select
                    class="u-server"
                    v-model="form.jx3_server"
                    filterable
                    placeholder="请输入服务器"
                    size="large"
                >
                    <el-option v-for="item in servers" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <span class="u-server-tip">
                    <i class="el-icon-question"></i>
                    部分应用将使用此服务器作为默认服务器
                </span>
            </el-form-item>

            <el-form-item class="u-name">
                <template #label>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="此项不会被公开,仅用于赛事联系或其它确认"
                        placement="left"
                    >
                        <div><i class="el-icon-lock"></i> QQ</div>
                    </el-tooltip>
                </template>
                <el-input v-model="form.qq_number" size="large" placeholder="请输入QQ号码"></el-input>
            </el-form-item>

            <el-form-item class="u-birthday">
                <template #label>
                    <el-tooltip class="item" effect="dark" content="此项不会被公开,仅用于礼品发放" placement="left">
                        <div><i class="el-icon-lock"></i> 生日</div>
                    </el-tooltip>
                </template>
                <el-date-picker
                    v-model="form.birthday"
                    size="large"
                    type="date"
                    placeholder="选择日期"
                    placement="bottom-start"
                    value-format="YYYY-MM-DD"
                    :disabled-date="disabledBirthdayDate"
                ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item class="u-phone">
                <template #label>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="此项不会被公开,仅用于礼品发放"
                        placement="left"
                    >
                        <div>
                            <i class="el-icon-lock"></i> 联系电话
                        </div>
                    </el-tooltip>
                </template>
                <el-input v-model="form.phone" placeholder="请输入收货电话"></el-input>
            </el-form-item> -->

            <!-- <el-form-item class="u-address">
                <template #label>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="此项不会被公开,仅用于礼品发放"
                        placement="left"
                    >
                        <div>
                            <i class="el-icon-lock"></i> 联系地址
                        </div>
                    </el-tooltip>
                </template>
                <el-input v-model="form.address" placeholder="请输入收货地址" type="textarea"></el-input>
            </el-form-item> -->

            <!-- <el-form-item class="u-tuilan" label="推栏">
                <el-input v-model="form.tuilan_id" placeholder="请输入推栏ID"></el-input>
            </el-form-item> -->

            <el-form-item class="u-name" label="签名">
                <el-input
                    type="textarea"
                    :rows="4"
                    maxlength="80"
                    placeholder="签名内容"
                    v-model="form.user_bio"
                    show-word-limit
                    size="large"
                ></el-input>
            </el-form-item>

            <el-form-item class="u-tv" label="直播间">
                <div class="u-tv-type">
                    <el-select v-model="form.tv_type" style="width: 140px" size="large" placeholder="请选择平台">
                        <el-option v-for="(label, val) in tvmap" :key="val" :label="label" :value="val"></el-option>
                    </el-select>
                </div>
                <div class="u-tv-id" style="margin-left: 10px;flex: 1">
                    <el-input v-model="form.tv_id" size="large" placeholder="请输入直播间房间号"></el-input>
                </div>
            </el-form-item>

            <el-form-item class="u-btns" label>
                <el-button type="primary" class="u-submit" @click="submit" size="large">提交</el-button>
            </el-form-item>
        </el-form>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import User from "@jx3box/jx3box-common/js/user";
import { updateProfile, getProfile } from "@/service/dashboard/profile";
import servers from "@jx3box/jx3box-data/data/server/server_list.json";
import tvmap from "@/assets/data/dashboard/tvmap.json";
export default {
    name: "profile",
    props: [],
    data: function () {
        return {
            nickname: User.getInfo().name,
            servers,
            form: {
                jx3_server: "",
                user_bio: "",
                qq_number: "",
                phone: "",
                address: "",
                tv_id: "",
                tv_type: "",
                tuilan_id: "",
                birthday: "",
            },
            position: window.innerWidth < 768 ? "top" : "left",
            tvmap,
        };
    },
    computed: {},
    methods: {
        // 提交资料
        submit() {
            const birthday = this.normalizeBirthday(this.form.birthday);
            if (birthday === false) {
                this.$message.error("生日格式不正确");
                return;
            }
            updateProfile({
                ...this.form,
                birthday,
            })
                .then((res) => {
                    this.$message({
                        message: "资料修改成功",
                        type: "success",
                    });
                })
                .catch((err) => {
                    this.$message.error(this.getErrorMessage(err, "资料修改失败"));
                });
        },
        // 获取资料
        getProfile() {
            getProfile()
                .then((res) => {
                    let data = res.data.data;
                    this.form.jx3_server = data.jx3_server;
                    this.form.user_bio = data.user_bio;
                    this.form.qq_number = data.qq_number;
                    this.form.phone = data.phone;
                    this.form.address = data.address;
                    this.form.tv_id = data.tv_id;
                    this.form.tv_type = data.tv_type;
                    this.form.tuilan_id = data.tuilan_id;
                    this.form.birthday = this.formatBirthday(data.birthday);
                })
                .catch(() => {});
        },
        formatBirthday(value) {
            if (!value) return "";
            const matched = String(value).match(/^\d{4}-\d{2}-\d{2}/);
            if (matched) return matched[0];
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return "";
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        },
        normalizeBirthday(value) {
            if (!value || value === "0000-00-00" || value === "1970-01-01") return null;
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

            const [year, month, day] = value.split("-").map(Number);
            const date = new Date(year, month - 1, day);
            const isValidDate =
                date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

            if (!isValidDate || date.getTime() > Date.now()) return false;
            return value;
        },
        disabledBirthdayDate(time) {
            return time.getTime() > Date.now();
        },
        getErrorMessage(err, fallback) {
            return err?.response?.data?.msg || err?.data?.msg || fallback;
        },
    },
    mounted: function () {
        this.getProfile();
    },
    components: {
        uc,
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/profile/profile.less";
</style>
