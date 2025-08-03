<template>
    <div class="v-sync-data">
        <h2 class="u-title">
            <i class="el-icon-connection"></i> 同步数据
            <el-button slot="reference" class="u-back" size="mini" icon="el-icon-arrow-left" @click="goBack"
                >返回列表</el-button
            >
        </h2>
    </div>
</template>

<script>
import { getBreadcrumb } from "@jx3box/jx3box-common/js/api_misc.js";
export default {
    name: "SyncData",
    data() {
        return {
            notice: ""
        }
    },
    methods: {
        goBack() {
            this.$router.push("/role/list");
        },
        loadBreadCrumb() {
            getBreadcrumb("role_sync").then((res) => {
                this.notice = res
            });
        }
    },
    mounted() {
        // 可以在这里添加同步数据的逻辑
        this.loadBreadCrumb();
    }
}
</script>

<style lang="less">

</style>
