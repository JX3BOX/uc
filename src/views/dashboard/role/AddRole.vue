<template>
    <div class="v-role-add">
        <h2 class="u-title">
            <i class="el-icon-circle-plus-outline"></i> {{ $t("dashboard.role.create") }}
            <el-button class="u-back" icon="ArrowLeft" @click="goBack">{{ $t("dashboard.common.backToList") }}</el-button>
        </h2>
        <roleform :data="form" @submit="submit" :btn_txt="$t('dashboard.common.create')" :processing="processing" />
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
                server: (localStorage && localStorage.getItem("team_role_default_server")) || "",
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
                        message: this.$t("dashboard.common.updateSuccess"),
                        type: "success",
                    });
                    this.$router.push("/role");
                })
                .finally(() => {
                    this.processing = false;
                });
        },
        goBack: function () {
            this.$router.push("/role");
        },
    },
    mounted: function () {},
    components: {
        roleform,
    },
};
</script>
