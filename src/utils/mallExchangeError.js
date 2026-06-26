const OWNED_MALL_ITEM_CODE = 42105;

function getMallExchangeError(error) {
    const data = error?.response?.data || error?.data || {};
    return {
        code: Number(data.code ?? error?.code),
        msg: data.msg || error?.message || "",
    };
}

function handleMallExchangeError(vm, error) {
    const { code, msg } = getMallExchangeError(error);

    if (code === OWNED_MALL_ITEM_CODE) {
        return vm.$alert(msg || "用户已拥有该物品", "兑换失败", {
            confirmButtonText: "知道了",
            type: "warning",
        });
    }

    if (msg && vm.$message) {
        return vm.$message.error ? vm.$message.error(msg) : vm.$message({ type: "error", message: msg });
    }

    return false;
}

function getMallRequirementMessages(item = {}, canBuyInfo = {}) {
    const messages = [];

    if (canBuyInfo.level === false) {
        messages.push(`等级不足：需要 Lv.${canBuyInfo.user_level || "-"}`);
    }
    if (canBuyInfo.vip_limit === false) {
        messages.push("会员限制：该商品仅会员可兑换");
    }
    if (canBuyInfo.box_coin === false) {
        messages.push(`盒币不足：需要 ${item.price_boxcoin || 0} 盒币`);
    }
    if (canBuyInfo.points === false) {
        messages.push(`积分不足：需要 ${item.price_points || 0} 积分`);
    }
    if (canBuyInfo.buy_time === false) {
        messages.push("不在可兑换时间内");
    }

    return messages;
}

function alertMallRequirement(vm, item, canBuyInfo) {
    const messages = getMallRequirementMessages(item, canBuyInfo);
    const message = messages.length ? messages.join("<br />") : "当前不满足兑换条件";

    return vm.$alert(message, "暂不能兑换", {
        confirmButtonText: "知道了",
        dangerouslyUseHTMLString: true,
        type: "warning",
    });
}

export {
    OWNED_MALL_ITEM_CODE,
    getMallExchangeError,
    handleMallExchangeError,
    getMallRequirementMessages,
    alertMallRequirement,
};
