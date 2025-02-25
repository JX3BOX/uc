<template>
    <div class="m-info" v-if="isAdmin">
    <el-button
            type="warning"
            size="mini"
            icon="el-icon-warning-outline"
            @click="report"
            >举报</el-button
        >
        <el-button
            type="danger"
            size="mini"
            icon="el-icon-turn-off-microphone"
            @click="check(true)"
            v-if="!status"
            >禁言</el-button
        >
        <el-button
            type="success"
            size="mini"
            icon="el-icon-microphone"
            @click="check(false)"
            v-else
            >解除禁言</el-button
        >
        <el-dialog
            title="操作"
            :visible.sync="dialogVisible"
            width="30%"
            :append-to-body="true"
            custom-class="m-user-check-dialog"
            :close-on-click-modal="false"
        >
            <div>
                <p>请填写禁言/解除禁言原因</p>
                <el-input
                    v-model="reason"
                    placeholder="请输入内容"
                    :maxlength="30"
                    :show-word-limit="true"
                ></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmCheck"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";
import { muteUser } from "@/service/author/helper.js";
export default {
    name: "Info",
    props: [],
    data: function() {
        return {
            isAdmin: User.getInfo().group >= 128,
            reason: "",
            dialogVisible: false,
            dialogFullscreen : window.innerWidth < 768 ? false : true,
        };
    },
    computed: {
        status: function() {
            return this.userdata.user_status;
        },
        name: function() {
            return this.userdata.display_name;
        },
        uid : function (){
            return ~~this.$store.state.uid
        },
        userdata: function() {
            return this.$store.state.userdata;
        },
    },
    methods: {
        check: function(status) {
            this.dialogVisible = true;
        },
        confirmCheck: function() {
            let tip = this.status ? "解除禁言" : "禁言";
            this.$alert(`确定${tip}${this.name}吗？`, "消息", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        // 旧版server
                        // checkUser(this.uid, ~~status).then((res) => {
                        //      this.next()
                        // });

                        // 新版helper
                        muteUser(this.uid, {
                            mute: this.status ? 0 : 1,
                            remark: this.reason,
                        }).then((res) => {
                            this.next()
                        });
                    }
                },
            });
        },
        next: function() {
            this.$message({
                message: "操作成功",
                type: "success",
            });
            this.reason = "";
            location.reload();
        },
        report : function (){
            location.href = `/feedback?refer=${encodeURIComponent(location.href)}`;
        }
    },
    mounted: function() {},
};
</script>

<style lang="less">
.m-info {
    .fr;
}
.m-user-check-dialog {
    .el-dialog__body {
        padding: 10px 20px;
    }
}
@media screen and (max-width:@phone){
    .m-user-check-dialog{
        .w(100%);
        .mt(0);
    }
}
</style>
