import User from "@jx3box/jx3box-common/js/user";
import { getCart, addGoodsToCart, deleteCart, deleteCartGoods, updateGoodsNum } from "@/service/vip/cart";
import { getAddress, toPay, updateAddress, getMyAddress, toPayOrder } from "@/service/vip/mall";

let cartRequest = null;

function pickUsableAddress(list) {
    const addressList = Array.isArray(list) ? list : [];
    return (
        addressList.find((item) => item?.is_default === true || item?.is_default === 1 || item?.is_default === "1") ||
        addressList[0] ||
        {}
    );
}

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
        batchConfirmIsShow: false,
    },
    mutations: {
        toState(state, data) {
            Object.keys(data).forEach((item) => {
                state[item] = data[item];
            });
        },
    },
    actions: {
        changeCartIsShow({ commit }, isShow) {
            commit("toState", { cartIsShow: isShow });
        },
        async clearCart({ commit }) {
            if (!User.isLogin()) return false;
            deleteCart().then(() => {
                commit("toState", {
                    cart: [],
                });
            });
        },
        async getCart({ commit }) {
            if (!User.isLogin()) {
                commit("toState", { cart: [] });
                return [];
            }
            if (cartRequest) return cartRequest;
            cartRequest = getCart()
                .then((res) => {
                    const cart = res.data?.data || [];
                    commit("toState", { cart });
                    return cart;
                })
                .finally(() => {
                    cartRequest = null;
                });
            return cartRequest;
        },
        async deleteCartGoods({ dispatch }, id) {
            if (!User.isLogin()) return false;
            deleteCartGoods(id).then(() => {
                dispatch("getCart");
            });
        },
        async updateGoodsNum({ dispatch }, { shopping_item_id, amount }) {
            if (!User.isLogin()) return false;
            updateGoodsNum(shopping_item_id, amount).then(() => {
                dispatch("getCart");
            });
        },
        async addCart({ dispatch }, { id, amount }) {
            if (!User.isLogin()) return false;
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
        async getAddressList({ commit, state }) {
            if (!User.isLogin()) {
                commit("toState", { addressList: [], myAddress: {} });
                return [];
            }
            return getAddress().then((res) => {
                const addressList = res.data?.data?.list || [];
                const data = { addressList };
                if (!state.myAddress?.id) {
                    data.myAddress = pickUsableAddress(addressList);
                }
                commit("toState", data);
                return addressList;
            });
        },
        // 获取默认地址
        async getMyAddress({ commit, state }) {
            if (!User.isLogin()) {
                commit("toState", { myAddress: {} });
                return {};
            }
            return getMyAddress()
                .then((res) => {
                    const address = res.data?.data || {};
                    const myAddress = address?.id ? address : pickUsableAddress(state.addressList);
                    commit("toState", { myAddress });
                    return myAddress;
                })
                .catch(() => {
                    const myAddress = pickUsableAddress(state.addressList);
                    commit("toState", { myAddress });
                    return myAddress;
                });
        },
        // 提交订单
        async buyGoods({ dispatch }, { id, count, addressId, remark }) {
            if (!User.isLogin()) return false;
            return toPayOrder(id, count, addressId, remark).then((res) => {
                return dispatch("toPay", res.data.data.id).then(() => res);
            });
        },
        // 付款
        async toPay({ commit }, id) {
            if (!User.isLogin()) return false;
            return toPay(id).then(() => {
                commit("toState", { pay_status: true });
            });
        },
        // 获取我的资产
        async getAsset({ commit }) {
            if (!User.isLogin()) {
                commit("toState", { asset: {} });
                return {};
            }
            return User.getAsset().then((data) => {
                commit("toState", { asset: data });
            });
        },
        // 切换地址并更新默认地址
        async changeAddress({ commit, dispatch, state }, addressId) {
            if (!User.isLogin()) return false;
            if (!addressId || state.myAddress.id == addressId) return;
            return updateAddress(addressId).then(() => {
                const myAddress = state.addressList.find((item) => item.id == addressId);
                if (myAddress) {
                    commit("toState", { myAddress });
                }
                return dispatch("getMyAddress");
            });
        },
        setBoundCart({ commit }, boundCart) {
            commit("toState", { boundCart });
        },
        changeCartConfirmIsShow({ commit }, isShow) {
            commit("toState", { cartConfirmIsShow: isShow });
        },
        changeBatchConfirmIsShow({ commit }, isShow) {
            commit("toState", { batchConfirmIsShow: isShow });
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
