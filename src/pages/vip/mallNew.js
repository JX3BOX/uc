import User from "@jx3box/jx3box-common/js/user";
import { getCart, addGoodsToCart, deleteCart, deleteCartGoods, updateGoodsNum } from "@/service/vip/cart";
import { getAddress, toPay, updateAddress, getMyAddress, toPayOrder } from "@/service/vip/mall";

const store = {
    namespaced: true,
    state: {
        asset: {},
        cartIsShow: false,
        cart: [],
        pay_status: false,
        addressList: [],
        myAddress: {},
        boundCart: {},
        assetIsShow: false,
        navIsShow: false,
        cartConfirmIsShow: false,
    },
    mutations: {
        toState(state, data) {
            Object.keys(data).forEach((item) => {
                state[item] = data[item];
            });
        },
    },
    actions: {
        // 获取我的资产
        async getAsset({ commit }) {
            return User.getAsset().then((data) => {
                commit("toState", { asset: data });
            });
        },
        changeCartIsShow({ commit }, isShow) {
            commit("toState", { cartIsShow: isShow });
        },
        async clearCart({ commit }) {
            deleteCart().then(() => {
                commit("toState", {
                    cart: [],
                });
            });
        },
        async getCart({ commit }) {
            return getCart().then((res) => {
                const cart = res.data?.data || [];
                commit("toState", {
                    cart: cart,
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
        setBoundCart({ commit }, boundCart) {
            commit("toState", { boundCart });
        },
        changeCartConfirmIsShow({ commit }, isShow) {
            commit("toState", { cartConfirmIsShow: isShow });
        },
    },
    modules: {},
    getters: {
        checkedItems(state) {
            return state.cart.filter((item) => item.can_buy === 1 && (item.checked || item.checked === undefined));
        },
        all_price_points(state, getters) {
            return getters.checkedItems.reduce((prev, cur) => prev + cur.goods.price_points * cur.amount, 0);
        },
        all_price_boxcoin(state, getters) {
            return getters.checkedItems.reduce((prev, cur) => prev + cur.goods.price_boxcoin * cur.amount, 0);
        },
        checked_num(state, getters) {
            return getters.checkedItems.reduce((prev, cur) => prev + cur.amount, 0);
        },
        num(state) {
            return state.cart.reduce((prev, cur) => prev + cur.amount, 0);
        },
    },
};

export default store;
