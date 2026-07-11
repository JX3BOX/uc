<template>
    <el-dialog
        :title="$t('vip.mall.switchAddress')"
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
                    <span>{{ $t("vip.mall.phoneValue", { phone: item.contact_phone }) }}</span>
                    <span>{{ $t("vip.mall.addressValue", { address: `${item.province}${item.city}${item.area}${item.address}` }) }}</span>
                </div>
            </el-radio>
        </el-radio-group>
        <a class="m-card m-no-address" href="/dashboard/address" target="_blank" v-else>
            {{ $t("vip.mall.noSwitchableAddress") }}
        </a>
        <template #footer>
            <el-button @click="close">{{ $t("vip.common.cancel") }}</el-button>
            <el-button type="primary" @click="submit">{{ $t("vip.common.confirm") }}</el-button>
        </template>
    </el-dialog>
</template>

<script>
import User from "@jx3box/jx3box-common/js/user";

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
            if (!User.isLogin()) {
                this.close();
                return User.toLogin();
            }
            if (!this.id) {
                return this.close();
            }
            this.$store.dispatch("mallNew/changeAddress", this.id);
            this.close();
        },
    },
    created() {
        if (!User.isLogin()) return;
        this.$store.dispatch("mallNew/getAddressList");
        this.$store.dispatch("mallNew/getMyAddress");
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_address.less";
</style>
