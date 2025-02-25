<template>
    <uc>
        <el-form class="m-profile-basic" ref="form" label-width="100px" :label-position="position">
            <el-form-item class="u-name" label="昵称">
                <div class="u-value">
                    {{ nickname }}
                    <a
                        class="u-edit el-button el-button--primary el-button--mini"
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
                >
                    <el-option v-for="item in servers" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <span class="u-server-tip">
                    <i class="el-icon-question"></i>
                    部分应用将使用此服务器作为默认服务器
                </span>
            </el-form-item>

            <el-form-item class="u-name">
                <div slot="label">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="此项不会被公开,仅用于赛事联系或其它确认"
                        placement="left"
                    >
                        <div>
                            <i class="el-icon-lock"></i> QQ
                        </div>
                    </el-tooltip>
                </div>
                <el-input v-model="form.qq_number" placeholder="请输入QQ号码"></el-input>
            </el-form-item>

            <el-form-item class="u-birthday">
                <div slot="label">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="此项不会被公开,仅用于礼品发放"
                        placement="left"
                    >
                        <div>
                            <i class="el-icon-lock"></i> 生日
                        </div>
                    </el-tooltip>
                </div>
                <el-date-picker
                    v-model="form.birthday"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    placement="bottom-start"
                    :picker-options="birthday_options"
                ></el-date-picker>
            </el-form-item>
            <!-- <el-form-item class="u-phone">
                <div slot="label">
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
                </div>
                <el-input v-model="form.phone" placeholder="请输入收货电话"></el-input>
            </el-form-item> -->

            <!-- <el-form-item class="u-address">
                <div slot="label">
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
                </div>
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
                ></el-input>
            </el-form-item>

            <el-form-item class="u-tv" label="直播间">
                <el-row>
                    <el-col :span="4">
                        <div class="u-tv-type">
                            <el-select v-model="form.tv_type" placeholder="请选择平台">
                                <el-option
                                    v-for="(label, val) in tvmap"
                                    :key="val"
                                    :label="label"
                                    :value="val"
                                ></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="20">
                        <div class="u-tv-id" style="margin-left:10px;">
                            <el-input v-model="form.tv_id" placeholder="请输入直播间房间号"></el-input>
                        </div>
                    </el-col>
                </el-row>
            </el-form-item>

            <el-form-item class="u-btns" label>
                <el-button type="primary" class="u-submit" @click="submit">提交</el-button>
            </el-form-item>
        </el-form>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import User from "@jx3box/jx3box-common/js/user";
import { updateProfile, getProfile } from "@/service/dashboard/profile";
import { sterilizer } from "sterilizer/index.js";
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
            birthday_options: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
        };
    },
    computed: {},
    methods: {
        // 提交资料
        submit() {
            updateProfile(this.form).then((res) => {
                this.$message({
                    message: "资料修改成功",
                    type: "success",
                });
            });
        },
        // 获取资料
        getProfile() {
            getProfile().then((res) => {
                let data = res.data.data;
                let birth = new Date(data.birthday);
                data.birthday = birth;
                this.form = data;
            });
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
