<template>
    <el-dialog title="切换地址" :visible.sync="show" width="60%" custom-class="m-goods-address" :before-close="close" append-to-body>
        <el-radio-group class="m-box" v-model="id" v-if="list && list.length">
            <el-radio :label="item.id" border v-for="(item, i) in list" :key="i">
                <div class="m-card">
                    <span>{{ item.contact_name }}</span>
                    <span>电话：{{ item.contact_phone }}</span>
                    <span>地址：{{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}</span>
                </div>
            </el-radio>
        </el-radio-group>
        <a class="m-card m-no-address" href="/dashboard/address" target="_blank" v-else> 没有可切换的地址，点击管理地址 </a>
        <span slot="footer" class="m-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: "GoodsAddress",
    emits: ["close"],
    props: ["data", "visible"],
    data: function () {
        return {
            show: false,
            id: 0,
        };
    },
    computed: {
        list() {
            return this.$store.state.mall.addressList;
        },
    },
    watch: {
        visible(val) {
            this.show = val;
        },
    },
    methods: {
        close() {
            this.show = false;
            this.$emit("close");
        },
        submit() {
            this.$store.dispatch("mall/changeAddress", this.id);
            this.close();
        },
    },
    mounted() {
        this.$store.dispatch("mall/getAddressList");
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_address.less";
</style>
