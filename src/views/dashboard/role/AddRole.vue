<template>
    <div class="v-role-add">
        <h2 class="u-title">
            <i class="el-icon-circle-plus-outline"></i> 创建角色
            <el-button
                slot="reference"
                class="u-back"
                size="mini"
                icon="el-icon-arrow-left"
                @click="goBack"
            >返回列表</el-button>
        </h2>
        <roleform :data="form" @submit="submit" btn_txt="创建" :processing="processing" />
    </div>
</template>

<script>
import roleform from "@/components/dashboard/role/roleform.vue";
import { createRole } from "@/service/dashboard/role.js";
export default {
    name: "",
    props: [],
    data: function () {
        return {
            form: {
                name: "",
                server:
                    (localStorage &&
                        localStorage.getItem("team_role_default_server")) ||
                    "",
                mount: "0",
                body_type: "1",
                note: "",
                custom: 1,
            },
            processing: false,
        };
    },
    computed: {},
    methods: {
        submit: function () {
            this.processing = true;
            createRole(this.form)
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
        }
    },
    mounted: function () {},
    components: {
        roleform,
    },
};
</script>
