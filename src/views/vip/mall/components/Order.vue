<template>
    <el-dialog title="确认订单" :visible="modelValue" @close="close" class="m-page-order" width="70%">
        <div class="m-goods">
            <div class="u-img" v-if="item && item.goods_images">
                <a :href="`/vip/mall/${item.id}`" target="_blank"><img class="u-pic" :src="item.goods_images[0]" alt="" /></a>
                <a :href="`/vip/mall/${item.id}`" class="u-title" target="_blank">{{ item.title }}</a>
                <div class="u-postage">
                    <span class="u-span">邮费：{{ item.postage ? item.postage / 100 + "元" : "包邮" }}</span>
                </div>
            </div>
            <div class="m-info">
                <div class="m-order-step">
                    <el-divider content-position="left">1. 订单详情</el-divider>
                    <span class="u-coin"
                        >数量:<b>{{ count }}</b></span
                    >
                    <span class="u-coin" v-show="item.price_points"
                        >积分:<b>{{ item.price_points * count }}</b></span
                    >
                    <span class="u-coin" v-show="item.price_boxcoin"
                        >盒币:<b>{{ item.price_boxcoin * count }}</b></span
                    >
                    <span class="u-coin" v-show="item.price_cny"
                        >金箔:<b>{{ item.price_cny * count }}</b></span
                    >
                </div>

                <div class="m-order-step">
                    <el-divider content-position="left">2. 选择地址</el-divider>
                    <div class="m-address">
                        <div class="m-button">
                            <el-button plain type="primary" icon="el-icon-sort" @click="visible = true" size="small"
                                >选择地址</el-button
                            >
                            <a class="el-button el-button--small is-plain" href="/dashboard/address" target="_blank"
                                ><i class="el-icon-setting"></i> 管理地址</a
                            >
                        </div>
                        <template v-if="address">
                            <div class="u-my-address">
                                <span class="u-label"><i class="el-icon-s-home"></i> 收货地址</span>
                                <div class="u-addr">
                                    <span class="u-name"
                                        >{{ address.contact_name }} - {{ address.contact_phone }}
                                    </span>
                                    <span class="u-address">
                                        - {{ address.province }}{{ address.city }}{{ address.area
                                        }}{{ address.address }}
                                    </span>
                                </div>
                            </div>
                        </template>
                        <div v-else><el-button type="success" icon="el-icon-plus">添加地址</el-button></div>
                    </div>
                </div>

                <div class="m-order-step">
                    <el-divider content-position="left">3. 备注</el-divider>
                    <el-input v-model="remark" placeholder="请输入备注" type="textarea" :rows="2"></el-input>
                </div>

                <el-button class="u-buy" type="primary" :loading="loading" @click="toBuy" :disabled="!ready"
                    >支付订单</el-button
                >
            </div>
        </div>
        <Address :visible="visible" @close="closeAddress" />
    </el-dialog>
</template>

<script>
import { __userLevel, __Root } from "@/utils/config";
import Address from "./address.vue";
import { forEach } from "lodash";
import { getItem, toPayOrder } from "@/service/vip/mall";
export default {
    name: "Order",
    components: {
        Address,
    },
    emits: ["update:modelValue"],
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        id: {
            type: [Number, String],
            default: "",
        },
        count: {
            type: [Number, String],
            default: 1,
        },
    },
    computed: {
        pay_status() {
            return this.$store.state.mall.pay_status;
        },
        address() {
            return this.$store.state.mall.myAddress;
        },
        ready({ address }) {
            return (
                address.contact_name ||
                address.contact_phone ||
                address.province ||
                address.city ||
                address.area ||
                address.address
            );
        },
    },
    watch: {
        modelValue: {
            handler(val) {
                val && this.id && this.getItem();
            },
        },
    },
    data() {
        return {
            remark: "",
            item: {},

            visible: false,
            loading: false,
        };
    },
    methods: {
        getItem() {
            getItem(this.id).then((res) => {
                this.item = res.data.data;
            });
        },
        close() {
            this.$emit("update:modelValue", false);
        },
        closeAddress() {
            this.visible = false;
        },
        toBuy() {
            this.$alert("你确定支付该订单吗？如需取消可前往个人中心-订单中心处理。", "支付确认", {
                confirmButtonText: "确定",
                callback: (action) => {
                    if (action == "confirm") {
                        this.loading = true;
                        this.$store
                            .dispatch("mall/buyGoods", {
                                id: this.id,
                                count: this.count,
                                addressId: this.address.id,
                                remark: this.remark,
                            })
                            .then(() => {
                                this.$message({
                                    type: "success",
                                    message: "下单成功",
                                });

                                this.$emit("update:modelValue", false);
                                // 打开新窗口
                                window.open(location.origin + "/dashboard/mall");
                            })
                            .finally(() => {
                                this.loading = false;
                            });
                    }
                },
            });
        },
    },
};
</script>

<style lang="less">
@import "~@/assets/css/vip/mall/goods_order.less";
</style>
