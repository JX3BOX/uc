<template>
    <div class="v-sync-data">
        <h2 class="u-title">
            <i class="el-icon-connection"></i> 同步数据
            <el-button slot="reference" class="u-back" size="mini" icon="el-icon-arrow-left" @click="goBack"
                >返回</el-button
            >
        </h2>
        <div class="m-tutorial" v-html="notice"></div>
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
        goBack: function () {
            this.$router.push("/role");
        },
        loadBreadCrumb() {
            getBreadcrumb("user-sync-game-data").then((res) => {
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
.v-sync-data {
    .u-title {
        margin-bottom: 20px;
    }
    .m-tutorial {
        // background-color: #f5f7fa;
        // border:1px solid #eee;
        // padding:30px;
        // line-height:1.8;
        // p{margin:0 0 5px 0;}
        max-width:1080px;
        .auto(x);
        .x;
    }
}
</style>
