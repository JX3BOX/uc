<template>
    <uc class="m-order-detail" icon="el-icon-shopping-bag-1" :title="$t('dashboard.orders.title')" :tabList="tabList">
        <template #header>
            <el-button @click="goBack" class="u-back"
                ><i class="el-icon-arrow-left"></i> {{ $t("dashboard.common.back") }}</el-button
            >
        </template>
        <div class="m-mall-detail">
            <!-- <div class="m-breadcrumb">
                <span @click="goBack" class="u-back"><i class="el-icon-arrow-left"></i> {{ $t("dashboard.common.back") }}</span>
            </div> -->

            <div class="m-content" v-if="goods">
                <div class="m-address el-card" v-if="!goods.is_virtual">
                    <span>{{ $t("dashboard.orders.recipient") }}：{{ address.actual_contact }}</span>
                    <span>{{ $t("dashboard.orders.contactPhone") }}：{{ address.actual_phone }}</span>
                    <span>{{ $t("dashboard.orders.shippingAddress") }}： {{ address.actual_address }}</span>
                </div>
                <div class="m-order el-card" v-if="goods">
                    <div class="m-img">
                        <img v-if="goods.goods_images" :src="normalizeMallImage(goods.goods_images[0])" />
                        <span class="u-link" v-if="goods.is_virtual" @click="openVirtual(goods)">{{
                            $t("dashboard.common.clickToView")
                        }}</span>
                    </div>
                    <el-descriptions
                        class="m-descriptions"
                        :title="goods.title"
                        direction="vertical"
                        :column="3"
                        border
                    >
                        <el-descriptions-item :label="$t('dashboard.orders.orderedAt')">{{
                            order.created_at
                        }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('dashboard.orders.orderNumber')" :span="2">{{
                            order.order_no
                        }}</el-descriptions-item>

                        <el-descriptions-item :label="$t('dashboard.orders.purchaseQuantity')">{{
                            order.goods_num
                        }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('dashboard.orders.postage')">
                            {{
                                goods.postage
                                    ? $t("dashboard.common.yuanAmount", { amount: goods.postage / 100 })
                                    : $t("dashboard.orders.freeShipping")
                            }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('dashboard.orders.paymentStatus')">{{
                            payStatus[order.pay_status]
                        }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('dashboard.orders.orderStatus')">
                            {{ orderStatus[order.order_status] }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('dashboard.orders.purchaseCost')">
                            <div class="u-box">
                                <span v-if="order.goods_price_cny">
                                    {{ $t("dashboard.common.goldLeaf") }}：<b>{{
                                        order.goods_price_cny * order.goods_num
                                    }}</b>
                                </span>
                                <span v-if="order.goods_price_boxcoin">
                                    {{ $t("dashboard.common.boxcoin") }}：<b>{{
                                        order.goods_price_boxcoin * order.goods_num
                                    }}</b>
                                </span>
                                <span v-if="order.goods_price_point">
                                    {{ $t("dashboard.common.points") }}：<b>{{
                                        order.goods_price_point * order.goods_num
                                    }}</b>
                                </span>
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('dashboard.orders.isGift')">{{
                            order.is_vitural_gift_order ? $t("dashboard.common.yes") : $t("dashboard.common.no")
                        }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('dashboard.common.remark')">{{
                            order.remark || "-"
                        }}</el-descriptions-item>
                        <el-descriptions-item :label="$t('dashboard.orders.review')" v-if="rate.comment" :span="3">
                            <div class="m-comment">
                                <div class="m-text">
                                    <span class="u-comment">{{ rate.comment }}</span>
                                    <span class="u-add_comment" v-if="rate.add_comment"
                                        >{{ $t("dashboard.orders.appendReview") }}：{{ rate.add_comment }}</span
                                    >
                                    <el-input v-if="append" class="u-textarea" v-model="content">
                                        <template #append>
                                            <span style="cursor: pointer" @click="appendComment">{{
                                                $t("dashboard.common.confirm")
                                            }}</span>
                                        </template>
                                    </el-input>
                                </div>
                                <div class="u-button">
                                    <el-button @click="append = !append" link v-if="order.order_status == 5">
                                        {{ $t("dashboard.orders.appendComment") }}
                                    </el-button>
                                    <el-popconfirm
                                        :title="$t('dashboard.orders.deleteReviewConfirm')"
                                        :width="200"
                                        @confirm="delComment(rate.id)"
                                    >
                                        <template #reference>
                                            <el-button link>{{ $t("dashboard.common.delete") }}</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
                <div class="m-button">
                    <template v-if="data.order.order_status == 0">
                        <el-button @click="cancel(data.order.id)">{{ $t("dashboard.orders.cancelOrder") }}</el-button>
                        <el-button @click="open(data.order.id, 'address')">{{
                            $t("dashboard.orders.changeAddress")
                        }}</el-button>
                        <el-button @click="open(data.order.id, 'remark')">{{
                            $t("dashboard.orders.addRemark")
                        }}</el-button>
                    </template>

                    <el-button @click="toConfirm(data.order.id)" v-if="data.order.order_status == 3">
                        {{ $t("dashboard.orders.confirmReceipt") }}
                    </el-button>
                    <el-button @click="toPay(data)" v-if="showPay(data.order)">{{
                        $t("dashboard.orders.clickToPay")
                    }}</el-button>
                </div>
            </div>

            <!-- 弹窗 -->
            <el-dialog :title="title" v-model="dialogVisible" width="30%" :before-close="close" class="m-edit-dialog">
                <template v-if="mode == 'address'">
                    <el-form ref="address_form" :model="address_form" :rules="address_rules" class="demo-form-inline">
                        <el-form-item :label="$t('dashboard.orders.selectShippingAddress')" prop="address_id">
                            <el-select v-model="address_form.address_id">
                                <el-option
                                    :label="`【 ${item.contact_name} ${item.contact_phone} 】 ${item.province}${item.city}${item.area}${item.address}`"
                                    :value="item.id"
                                    v-for="(item, i) in addressList"
                                    :key="i"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div class="m-button">
                                <el-button @click="close">{{ $t("dashboard.common.cancel") }}</el-button>
                                <el-button type="primary" @click="submit('address_form')">{{
                                    $t("dashboard.common.confirm")
                                }}</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </template>
                <template v-else>
                    <el-form ref="remark_form" :model="remark_form" :rules="remark_rules" class="demo-form-inline">
                        <el-form-item :label="$t('dashboard.common.remark')" prop="remark">
                            <el-input
                                type="textarea"
                                :rows="2"
                                :placeholder="$t('dashboard.common.remarkPlaceholder')"
                                v-model="remark_form.remark"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <div class="m-button">
                                <el-button @click="close">{{ $t("dashboard.common.cancel") }}</el-button>
                                <el-button type="primary" @click="submit('remark_form')">{{
                                    $t("dashboard.common.confirm")
                                }}</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </template>
            </el-dialog>
        </div>
    </uc>
</template>

<script>
import {
    updateOrderAddress,
    updateOrderRemark,
    getAddress,
    closeOrder,
    toPay,
    toConfirm,
    appendGoodsRate,
    delGoodsRate,
    getOrderId,
} from "@/service/dashboard/goods";
import mallData from "@/assets/data/dashboard/mall.json";
const { orderStatus, payStatus } = mallData;
import uc from "@/components/dashboard/uc";
import tabsData from "@/assets/data/dashboard/tabs.json";
const { mallTab } = tabsData;
import { append } from "domutils";
import { normalizeMallImage } from "@/utils/mallImage";
export default {
    name: "orderDetail",
    components: { uc },
    data: function () {
        return {
            data: {},
            mode: "",
            dialogVisible: false,
            addressList: [],
            address_form: {
                address_id: "",
            },
            address_rules: {
                address_id: [
                    { required: true, message: this.$t("dashboard.orders.addressRequired"), trigger: "change" },
                ],
            },
            remark_form: {
                remark: "",
            },
            remark_rules: {
                remark: [{ required: true, message: this.$t("dashboard.common.remarkPlaceholder"), trigger: "blur" }],
            },
            content: "",
            append: false,

            tabList: mallTab,
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        pageIndex() {
            return this.$route.params.pageIndex;
        },
        address() {
            return this.data.shipAddress || {};
        },
        order() {
            return this.data.order;
        },
        goods() {
            return this.data.goods;
        },
        rate() {
            return this.data.rate;
        },
        payStatus() {
            return this.localizeStatusMap("mallPayStatus", payStatus);
        },
        orderStatus() {
            return this.localizeStatusMap("mallOrderStatus", orderStatus);
        },
        title() {
            return this.mode == "address"
                ? this.$t("dashboard.orders.changeShippingAddress")
                : this.$t("dashboard.orders.changeRemark");
        },
    },
    methods: {
        normalizeMallImage,
        localizeStatusMap(name, source) {
            return Object.keys(source).reduce((result, key) => {
                const path = `dashboard.dataLabels.${name}.${key}`;
                result[key] = this.$te(path) ? this.$t(path) : source[key];
                return result;
            }, {});
        },
        load() {
            getOrderId(this.id).then((res) => {
                this.data = res.data.data;
            });
        },
        loadAddress() {
            getAddress().then((res) => {
                this.addressList = res.data.data.list;
            });
        },
        // 订单关闭不显示按钮
        closeButton(data) {
            if (!data) return false;
            if (data.order_status == 1 || data.order_status == 2 || data.order_status == 7) return false;
            return true;
        },
        // 显示支付按钮
        showPay(data) {
            if (data) {
                const { order_status, pay_status } = data;
                if (order_status == 1 || order_status == 2 || order_status == 7) return false;
                return pay_status == 0 ? true : false;
            }
            return false;
        },
        // 确认收货
        toConfirm(id) {
            toConfirm(id).then(() => {
                this.$message({
                    message: this.$t("dashboard.orders.receiptSuccess"),
                    type: "success",
                });
                this.data.order.order_status = 4;
            });
        },
        goBack() {
            this.$router.push({
                name: "mall",
                params: {
                    pageIndex: this.pageIndex,
                },
            });
        },
        open(id, type) {
            this.order_id = id;
            if (type == "address") this.loadAddress();
            if (this.$refs.address_form !== undefined) this.$refs.address_form.clearValidate();
            if (this.$refs.remark_form !== undefined) this.$refs.remark_form.clearValidate();
            this.mode = type;
            this.dialogVisible = true;
        },
        close() {
            this.dialogVisible = false;
        },
        // 关闭订单
        cancel(id) {
            closeOrder(id).then((res) => {
                this.$message({
                    message: this.$t("dashboard.orders.closeSuccess"),
                    type: "success",
                });
                this.list = this.list.map((item) => {
                    if (item.order.id == id) item.order.order_status = 1;
                    return item;
                });
            });
        },
        // 支付
        toPay(data) {
            const id = data.order.id;
            toPay(id).then(() => {
                this.$message({
                    message: this.$t("dashboard.orders.paymentSuccess"),
                    type: "success",
                });
                this.list = this.list.map((item) => {
                    if (item.order.id == id) item.order.pay_status = 1;
                    return item;
                });
            });
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.mode == "address"
                        ? updateOrderAddress(this.order_id, this.address_form.address_id).then(() => {
                              this.$message({
                                  message: this.$t("dashboard.orders.changeAddressSuccess"),
                                  type: "success",
                              });

                              const list = this.addressList.filter(
                                  (item) => item.id == this.address_form.address_id
                              )[0];
                              if (list) {
                                  const { province, city, area, address, contact_name, contact_phone } = list;
                                  const actual_address = province + " " + city + " " + area + " " + address;
                                  this.data.shipAddress.actual_address = actual_address;
                                  this.data.shipAddress.actual_contact = contact_name;
                                  this.data.shipAddress.actual_phone = contact_phone;
                              }
                              this.close();
                          })
                        : updateOrderRemark(this.order_id, this.remark_form.remark).then(() => {
                              this.$message({
                                  message: this.$t("dashboard.orders.changeRemarkSuccess"),
                                  type: "success",
                              });
                              this.data.order.remark = this.remark_form.remark;
                              this.close();
                          });
                }
            });
        },
        // 跳转查看
        openVirtual({ sub_category }) {
            let link = null;
            const data = {
                code: this.$router.resolve({
                    name: "card",
                    query: {
                        tab: "virtual",
                    },
                }),
                emotion: this.$router.resolve({
                    name: "emotion",
                }),
                skin: this.$router.resolve({
                    name: "theme",
                }),
                avatar: this.$router.resolve({
                    name: "frame",
                }),
                honor: this.$router.resolve({
                    name: "honor",
                }),
            };
            link = data[sub_category];
            if (link) window.open(link.href, "_blank");
        },
        // 追评
        appendComment() {
            if (this.content)
                appendGoodsRate(this.rate.id, { content: this.content }).then((res) => {
                    this.$message({
                        message: this.$t("dashboard.orders.appendReviewSuccess"),
                        type: "success",
                    });
                    this.data.rate.add_comment = this.content;
                    this.data.order.order_status = 8;
                    this.append = false;
                });
        },
        // 删除评价
        delComment(id) {
            delGoodsRate(id).then((res) => {
                this.$message({
                    message: this.$t("dashboard.orders.deleteReviewSuccess"),
                    type: "success",
                });
                this.data.rate.comment = "";
            });
        },
    },
    mounted() {
        if (this.id) this.load();
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/order_detail.less";
</style>
