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
        return vm.$alert(msg || vm.$t("vip.mall.alreadyOwned"), vm.$t("vip.mall.exchangeFailed"), {
            confirmButtonText: vm.$t("vip.common.gotIt"),
            type: "warning",
        });
    }

    if (msg && vm.$message) {
        return vm.$message.error ? vm.$message.error(msg) : vm.$message({ type: "error", message: msg });
    }

    return false;
}

function getMallRequirementMessages(item = {}, canBuyInfo = {}, t = (key) => key) {
    const messages = [];

    if (canBuyInfo.level === false) {
        messages.push(t("vip.mall.requirementLevel", { level: canBuyInfo.user_level || "-" }));
    }
    if (canBuyInfo.vip_limit === false) {
        messages.push(t("vip.mall.requirementMember"));
    }
    if (canBuyInfo.box_coin === false) {
        messages.push(t("vip.mall.requirementBoxcoin", { amount: item.price_boxcoin || 0 }));
    }
    if (canBuyInfo.points === false) {
        messages.push(t("vip.mall.requirementPoints", { amount: item.price_points || 0 }));
    }
    if (canBuyInfo.cny === false) {
        messages.push(t("vip.mall.requirementCny", { amount: item.price_cny || 0 }));
    }
    if (canBuyInfo.buy_time === false) {
        messages.push(t("vip.mall.requirementTime"));
    }
    if (canBuyInfo.stock === false) {
        messages.push(t("vip.mall.requirementStock"));
    }

    return messages;
}

function alertMallRequirement(vm, item, canBuyInfo) {
    const messages = getMallRequirementMessages(item, canBuyInfo, vm.$t.bind(vm));
    const message = messages.length ? messages.join("<br />") : vm.$t("vip.mall.notEligible");

    return vm.$alert(message, vm.$t("vip.common.exchangeUnavailable"), {
        confirmButtonText: vm.$t("vip.common.gotIt"),
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
