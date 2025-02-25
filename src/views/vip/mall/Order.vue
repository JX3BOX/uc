<template>
    <div class="m-page-order">
        <div class="m-breadcrumb">
            <span @click="goBack" class="u-back"><i class="el-icon-arrow-left"></i> 返回</span>
        </div>
        <div class="m-goods el-card">
            <img class="u-img" :src="item.goods_images[0]" />
            <div class="m-info">
                <span class="u-title">{{ item.title }}</span>
                <div class="m-line">
                    <span class="u-span">兑换数量：{{ count }}件</span>
                    <span class="u-span">邮费：{{ item.postage ? item.postage / 100 + "元" : "包邮" }}</span>
                </div>

                <el-divider content-position="left">1. 兑换消耗</el-divider>

                <span v-show="item.price_cny"
                    >金箔： <b>{{ item.price_cny * count }}</b></span
                >
                <span v-show="item.price_points"
                    >积分： <b>{{ item.price_points * count }}</b></span
                >
                <span v-show="item.price_boxcoin"
                    >盒币： <b>{{ item.price_boxcoin * count }}</b></span
                >

                <el-divider content-position="left">2. 选择地址</el-divider>
                <div class="m-address">
                    <div class="m-button">
                        <el-button type="primary" icon="el-icon-sort" @click="visible = true" size="small"
                            >切换地址</el-button
                        >
                        <a
                            class="el-button el-button--warning el-button--small"
                            href="/dashboard/address"
                            target="_blank"
                            ><i class="el-icon-setting"></i> 管理地址</a
                        >
                    </div>
                    <template v-if="address">
                        <div class="u-my-address">
                            <span class="u-label"><i class="el-icon-s-home"></i> 收货地址</span>
                            <span class="u-name">{{ address.contact_name }} - {{ address.contact_phone }} </span>
                            <span class="u-address">
                                {{ address.province }}{{ address.city }}{{ address.area }}{{ address.address }}
                            </span>
                        </div>
                    </template>
                    <div v-else><el-button type="success" icon="el-icon-plus">添加地址</el-button></div>
                </div>

                <el-divider content-position="left">3. 备注</el-divider>
                <el-input v-model="remark" placeholder="请输入备注" type="textarea" :rows="2"></el-input>

                <el-button class="u-button" type="primary" @click="toBuy">确认订单</el-button>
            </div>
        </div>
        <Address :visible="visible" @close="closeAddress" />
    </div>
</template>
<script>
import { __userLevel, __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import Address from "./components/address.vue";
import { forEach } from "lodash";
import { getItem, toPayOrder } from "@/service/vip/mall";
export default {
    name: "GoodsOrder",
    data: function () {
        return {
            active: null,
            remark: "",
            visible: false,
            item: {},
        };
    },
    components: { Address },
    computed: {
        id() {
            return this.$route.params.id;
        },
        count() {
            return this.$route.params.count;
        },
        pay_status() {
            return this.$store.state.mall.pay_status;
        },
        address() {
            return this.$store.state.mall.myAddress;
        },
    },
    watch: {
        pay_status(val) {
            if (val) {
                this.$store.commit("toState", { pay_status: false });
                this.$router.go(-1);
                const url = `${__Root}dashboard/mall`;
                window.open(url);
            }
        },
    },

    methods: {
        goBack() {
            // window.history.length ?
            this.$router.go(-1);
            // : this.$router.push('/mall');
        },
        load() {
            this.$store.dispatch("mall/getMyAddress");
            if (this.id) this.getData();
        },
        showLevel(num) {
            let _key = 1;
            forEach(__userLevel, (item, key) => {
                if (num >= item[0] && num < item[1]) _key = key;
            });
            return _key;
        },
        toBuy() {
            this.$store.dispatch("mall/buyGoods", {
                id: this.id,
                count: this.count,
                addressId: this.address.id,
                remark: this.remark,
            });
        },
        change(i) {
            this.active = i;
        },
        closeAddress() {
            this.visible = false;
        },
        getData() {
            getItem(this.id).then((res) => {
                this.item = res.data.data || {};
            });
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_order.less";
</style>
