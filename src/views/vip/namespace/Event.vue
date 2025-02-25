<template>
    <div class="m-vip-namespace-event">
        <div class="m-vip-namespace-event-cont">
            <div class="u-title">申请铭牌领取</div>
            <el-input v-model="uid" placeholder="请输入网站UID" :disabled="success"></el-input>
            <el-button type="primary" @click="submit" :disabled="success">提交</el-button>
        </div>
    </div>
</template>
<script>
import { putNamespaceKolForId } from "@/service/vip/event";
export default {
    name: "Event",
    props: [],
    data: function() {
        return {
            uid: "",
            success: false,
        };
    },
    computed: {},
    methods: {
        submit: function() {
            putNamespaceKolForId(this.uid).then((res) => {
                this.success = true;
                this.$message({
                    message: "提交成功",
                    type: "success",
                });
            });
        },
    },
    mounted: function() {},
    // components: { 'simple-header': simple_header },
};
</script>
