<template>
    <el-form class="m-goods-comment" :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="商品评价" prop="rate">
            <el-rate v-model="form.rate" :max="3"></el-rate>
        </el-form-item>
        <el-form-item label="物流评价" prop="express_rate">
            <el-rate v-model="form.express_rate" :max="3"></el-rate>
        </el-form-item>
        <el-form-item label="评价内容" prop="comment">
            <el-input type="textarea" v-model="form.comment"></el-input>
        </el-form-item>
        <el-form-item label="是否匿名" prop="is_anonymous">
            <el-switch v-model="form.is_anonymous"></el-switch>
        </el-form-item>

        <div class="m-button">
            <el-button @click="close('form')">取消</el-button>
            <el-button type="primary" @click="submitForm('form')">确定</el-button>
        </div>
    </el-form>
</template>
<script>
import { goodsRate } from "@/service/dashboard/goods";
export default {
    name: "goodComment",
    props: ["order_id"],
    data: function () {
        return {
            form: {
                rate: 3,
                express_rate: 3,
                comment: "",
                is_anonymous: true,
                order_id: this.order_id,
            },

            rules: {
                comment: { required: true, message: "请填写评价内容", trigger: "blur" },
            },
        };
    },

    methods: {
        close(data) {
            this.$emit("close", data);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    goodsRate(this.form).then(() => {
                        this.$message({
                            message: "评价成功",
                            type: "success",
                        });
                        this.close(this.order_id);
                    });
                }
            });
        },
    },
};
</script>
<style lang="less">
.m-goods-comment {
    .el-form-item {
        .flex;
        .mb(12px);
        align-items: center;
    }
    .el-form-item__content {
        flex: 1;
        .ml(0) !important;
    }
    .m-button {
        .flex;
        .pt(12px);
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
}
</style>
