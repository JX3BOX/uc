<template>
    <div class="v-role-add">
        <h2 class="u-title">
            <i class="el-icon-setting"></i> 编辑角色
            <el-button
                slot="reference"
                class="u-back"
                size="mini"
                plain
                icon="el-icon-arrow-left"
                @click="goBack"
            >返回</el-button>
        </h2>
        <roleform :data="form" @submit="submit" btn_txt="更新" :processing="processing" />
    </div>
</template>

<script>
import roleform from "@/components/dashboard/role/roleform.vue";
import User from "@jx3box/jx3box-common/js/user";
import { getRole, updateRole } from "@/service/dashboard/role.js";
export default {
    name: "",
    props: [],
    data: function () {
        return {
            form: {
                ID: "",
                name: "",
                server: "",
                mount: "",
                body_type: "",
                note: "",
                custom: 1,
                uid: "",
            },
            processing: false,
        };
    },
    computed: {
        id: function () {
            return ~~this.$route.params.id;
        },
    },
    methods: {
        loadData: function () {
            getRole(this.id).then((res) => {
                let hasRight =
                    res.data.data.uid == User.getInfo().uid ||
                    User.isSuperAdmin();
                if (!hasRight) {
                    this.$message.error("没有操作权限");
                    return;
                } else {
                    this.form = res.data.data;
                }
            });
        },
        submit: function () {
            // 如果是绑定的角色不能改
            if (!this.form.custom) {
                this.$message.error("绑定角色不允许篡改");
                return;
            }
            this.processing = true;
            updateRole(this.id, this.form)
                .then((res) => {
                    this.$message({
                        message: "更新成功",
                        type: "success",
                    });
                    this.$router.push("/role");
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        goBack : function (){
            this.$router.push('/role')
            // this.$router.go(-1)
        }
    },
    mounted: function () {
        this.loadData();
    },
    components: {
        roleform,
    },
};
</script>
