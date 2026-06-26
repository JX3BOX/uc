export const MALL_DECORATION_SINGLE_LIMIT_MESSAGE = "装扮类商品仅可拥有1份";
export const MALL_DECORATION_OWNED_MESSAGE = "已拥有该商品，无需重复兑换";

export function canAddMultipleMallGoods(good = {}) {
    return good.category !== "virtual" || good.sub_category === "palu";
}

export function isOwnedSingleMallGoods(good = {}) {
    return !canAddMultipleMallGoods(good) && !!good.has_owned;
}

export function getMallGoodsCartAmount(cart = [], good = {}) {
    const cartItem = cart.find((item) => {
        return String(item.goods_id || item.goods?.id) === String(good.id);
    });
    return Number(cartItem?.amount || cartItem?.count) || 0;
}

export function shouldBlockSingleDecorationAdd(cart = [], good = {}) {
    return !canAddMultipleMallGoods(good) && getMallGoodsCartAmount(cart, good) >= 1;
}
