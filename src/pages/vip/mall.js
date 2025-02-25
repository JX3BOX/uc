import { getAddress, toPay, updateAddress, getMyAddress, toPayOrder, getSkinJson } from "@/service/vip/mall";
import User from "@jx3box/jx3box-common/js/user";
import { getCart, addGoodsToCart, deleteCart, deleteCartGoods, updateGoodsNum } from "@/service/vip/cart";

const store = {
    namespaced: true,
    state: {
        addressList: [],
        myAddress: {},
        goodsList: [],

        goodsListTotal: 0,
        goodsListPageSize: 9,
        goodsListLoading: false,

        pageIndex: 1,
        type: "",
        subtype: "",
        level: "0",
        vip_limit: "",
        search: "",
        pay_status: false,

        asset: {},
        client: location.href.includes("origin") ? "origin" : "std",
        skinJson: {},

        cart: [],
        cartVisible: false,
        boundCart: {},
    },
    getters: {
        cartNum: (state) => {
            const cart = (state.cart || []).map((item) => item.amount || 1);
            return cart.reduce((prev, cur) => {
                return prev + cur;
            }, 0);
        },
    },
    mutations: {
        toState(state, data) {
            Object.keys(data).forEach((item) => {
                state[item] = data[item];
            });
        },
        SET_STATE(state, { key, value }) {
            state[key] = value;
        },
    },
    actions: {
        setCart({ commit }, cart) {
            commit("SET_STATE", {
                key: "cart",
                value: cart,
            });
        },
        async clearCart({ commit }) {
            deleteCart().then(() => {
                commit("SET_STATE", {
                    key: "cart",
                    value: [],
                });
            });
        },
        async deleteCartGoods({ dispatch }, id) {
            deleteCartGoods(id).then(() => {
                dispatch("getCart");
            });
        },
        async updateGoodsNum({ dispatch }, { shopping_item_id, amount }) {
            updateGoodsNum(shopping_item_id, amount).then(() => {
                dispatch("getCart");
            });
        },
        async addCart({ dispatch }, { id, amount }) {
            return addGoodsToCart(id, amount)
                .then(() => {
                    dispatch("getCart");
                    return true;
                })
                .catch(() => {
                    return false;
                });
        },
        async getCart({ commit }) {
            getCart().then((res) => {
                const cart = res.data?.data || [];
                commit("SET_STATE", {
                    key: "cart",
                    value: cart,
                });
            });
        },
        // 获取魔卡皮肤json
        async getSkinJson({ commit }) {
            getSkinJson().then((res) => {
                commit("toState", { skinJson: res.data });
            });
        },
        // 获取地址列表
        async getAddressList({ commit }) {
            getAddress().then((res) => {
                commit("toState", { addressList: res.data.data.list });
            });
        },
        // 获取默认地址
        async getMyAddress({ commit }) {
            getMyAddress().then((res) => {
                commit("toState", { myAddress: res.data.data });
            });
        },
        // 提交订单
        async buyGoods({ dispatch }, { id, count, addressId, remark }) {
            return new Promise((resolve) => {
                toPayOrder(id, count, addressId, remark).then((res) => {
                    dispatch("toPay", res.data.data.id);
                    resolve(res);
                });
            });
        },
        // 付款
        async toPay({ commit }, id) {
            return toPay(id).then(() => {
                commit("toState", { pay_status: true });
            });
        },
        // 获取我的资产
        async getAsset({ commit }) {
            User.getAsset().then((data) => {
                commit("toState", { asset: data });
            });
        },
        // 切换地址并更新默认地址
        async changeAddress({ dispatch, state }, addressId) {
            if (state.myAddress.id == addressId) return;
            updateAddress(addressId).then(() => {
                dispatch("getMyAddress");
            });
        },
    },
    modules: {},
};

export default store;
