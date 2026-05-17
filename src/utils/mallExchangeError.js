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

export { OWNED_MALL_ITEM_CODE, getMallExchangeError, handleMallExchangeError };
