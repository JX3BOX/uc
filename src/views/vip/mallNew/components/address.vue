<template>
    <el-dialog
        title="切换地址"
        v-model="show"
        width="60%"
        class="m-goods-address"
        :before-close="close"
        append-to-body
    >
        <el-radio-group class="m-box" v-model="id" v-if="list && list.length">
            <el-radio :value="item.id" border v-for="(item, i) in list" :key="i">
                <div class="m-card">
                    <span>{{ item.contact_name }}</span>
                    <span>电话：{{ item.contact_phone }}</span>
                    <span>地址：{{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}</span>
                </div>
            </el-radio>
        </el-radio-group>
        <a class="m-card m-no-address" href="/dashboard/address" target="_blank" v-else>
            没有可切换的地址，点击管理地址
        </a>
        <template #footer>
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </template>
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
            return this.$store.state.mallNew.addressList;
        },
        address() {
            return this.$store.state.mallNew.myAddress || {};
        },
    },
    watch: {
        visible(val) {
            this.show = val;
            if (val) {
                this.syncSelectedAddress();
            }
        },
        list: {
            handler() {
                this.syncSelectedAddress();
            },
            immediate: true,
        },
        address: {
            handler() {
                this.syncSelectedAddress();
            },
            immediate: true,
        },
    },
    methods: {
        syncSelectedAddress() {
            const firstAddress = this.list?.[0] || {};
            this.id = this.address.id || firstAddress.id || 0;
        },
        close() {
            this.show = false;
            this.$emit("close");
        },
        submit() {
            if (!this.id) {
                return this.close();
            }
            this.$store.dispatch("mallNew/changeAddress", this.id);
            this.close();
        },
    },
    created() {
        this.$store.dispatch("mallNew/getAddressList");
        this.$store.dispatch("mallNew/getMyAddress");
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_address.less";
</style>
