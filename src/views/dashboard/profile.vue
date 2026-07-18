<template>
    <uc>
        <ContentSkeleton v-if="loading" variant="form" :rows="7" />
        <el-form v-else class="m-profile-basic" ref="form" label-width="100px" :label-position="position">
            <el-form-item class="u-name" :label="$t('dashboard.profile.nickname')">
                <div class="u-value">
                    {{ nickname }}
                    <a
                        class="u-edit el-button el-button--primary el-button--small"
                        href="/vip/rename?from=dashboard_profile"
                        target="_blank"
                    >
                        <i class="el-icon-edit"></i> {{ $t("dashboard.profile.changeNickname") }}
                    </a>
                </div>
            </el-form-item>

            <el-form-item class="u-name" :label="$t('dashboard.role.server')">
                <el-select
                    class="u-server"
                    v-model="form.jx3_server"
                    filterable
                    :placeholder="$t('dashboard.role.serverInputPlaceholder')"
                    size="large"
                >
                    <el-option v-for="item in servers" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <span class="u-server-tip">
                    <i class="el-icon-question"></i>
                    {{ $t("dashboard.profile.defaultServerTip") }}
                </span>
            </el-form-item>

            <el-form-item class="u-name">
                <template #label>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('dashboard.profile.qqPrivateTip')"
                        placement="left"
                    >
                        <div><i class="el-icon-lock"></i> QQ</div>
                    </el-tooltip>
                </template>
                <el-input v-model="form.qq_number" size="large" :placeholder="$t('dashboard.profile.qqPlaceholder')"></el-input>
            </el-form-item>

            <el-form-item class="u-birthday">
                <template #label>
                    <el-tooltip class="item" effect="dark" :content="$t('dashboard.profile.birthdayPrivateTip')" placement="left">
                        <div><i class="el-icon-lock"></i> {{ $t("dashboard.profile.birthday") }}</div>
                    </el-tooltip>
                </template>
                <el-date-picker
                    v-model="form.birthday"
                    size="large"
                    type="date"
                    :placeholder="$t('dashboard.profile.selectDate')"
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

            <el-form-item class="u-name" :label="$t('dashboard.profile.signature')">
                <el-input
                    type="textarea"
                    :rows="4"
                    maxlength="80"
                    :placeholder="$t('dashboard.profile.signaturePlaceholder')"
                    v-model="form.user_bio"
                    show-word-limit
                    size="large"
                ></el-input>
            </el-form-item>

            <el-form-item class="u-tv" :label="$t('dashboard.profile.liveRoom')">
                <div class="u-tv-type">
                    <el-select v-model="form.tv_type" style="width: 140px" size="large" :placeholder="$t('dashboard.profile.platformPlaceholder')">
                        <el-option v-for="(label, val) in tvmap" :key="val" :label="tvLabel(val, label)" :value="val"></el-option>
                    </el-select>
                </div>
                <div class="u-tv-id" style="margin-left: 10px;flex: 1">
                    <el-input v-model="form.tv_id" size="large" :placeholder="$t('dashboard.profile.roomIdPlaceholder')"></el-input>
                </div>
            </el-form-item>

            <el-form-item class="u-btns" label>
                <el-button type="primary" class="u-submit" @click="submit" size="large">{{ $t("dashboard.common.submit") }}</el-button>
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
            loading: true,
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
                this.$message.error(this.$t("dashboard.profile.invalidBirthday"));
                return;
            }
            updateProfile({
                ...this.form,
                birthday,
            })
                .then((res) => {
                    this.$message({
                        message: this.$t("dashboard.profile.updateSuccess"),
                        type: "success",
                    });
                })
                .catch((err) => {
                    this.$message.error(this.getErrorMessage(err, this.$t("dashboard.profile.updateFailed")));
                });
        },
        // 获取资料
        getProfile() {
            this.loading = true;
            return getProfile()
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
                .catch(() => {})
                .finally(() => {
                    this.loading = false;
                });
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
        tvLabel(value, fallback) {
            return this.$te(`dashboard.profile.platforms.${value}`)
                ? this.$t(`dashboard.profile.platforms.${value}`)
                : fallback;
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
