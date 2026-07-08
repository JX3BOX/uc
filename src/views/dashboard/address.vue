<template>
    <uc>
        <div class="m-page-address">
            <!-- 显示地址 -->
            <el-button type="primary" icon="Plus" @click="add">添加地址</el-button>

            <div class="m-content">
                <el-table :data="list" v-loading="loading">
                    <el-table-column prop="contact_name" label="姓名" width="180"> </el-table-column>
                    <el-table-column prop="contact_phone" label="电话" width="180"> </el-table-column>
                    <el-table-column label="默认地址" width="180">
                        <template #default="scope">
                            <el-switch v-model="scope.row.is_default" @change="change(scope.row)"> </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="地址">
                        <template #default="scope">
                            {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template #default="scope">
                            <div class="m-actions">
                                <!--编辑-->
                                <el-button circle @click="edit(scope.row)" icon="Edit"></el-button>
                                <!--删除-->
                                <el-popconfirm
                                    confirm-button-text="确定"
                                    cancel-button-text="取消"
                                    icon="InfoFilled"
                                    title="确定删除吗？"
                                    @confirm="del(scope.row.id)"
                                >
                                    <template #reference>
                                        <el-button circle icon="Delete"></el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 地址表单 -->
            <el-dialog
                class="m-address-dialog"
                v-model="visible"
                :title="form.id ? '编辑地址' : '添加地址'"
                width="680px"
                @closed="resetForm"
            >
                <el-form :model="form" :rules="rules" ref="ruleForm" label-position="top">
                    <el-form-item label="联系人" prop="contact_name">
                        <el-input placeholder="请输入名称" v-model="form.contact_name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="contact_phone">
                        <el-input placeholder="请输入手机号" v-model="form.contact_phone"></el-input>
                    </el-form-item>
                    <el-form-item label="联系地址" prop="province">
                        <el-cascader
                            class="u-address"
                            v-model="address"
                            :options="addressList"
                            placeholder="请选择省 / 市 / 区"
                            clearable
                            filterable
                            @change="handleChange"
                        ></el-cascader>
                        <el-form-item class="m-detail-address" prop="address">
                            <el-input placeholder="请输入详细地址" v-model="form.address"></el-input>
                        </el-form-item>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
                </template>
            </el-dialog>
        </div>
    </uc>
</template>

<script>
import addressList from "@/assets/data/dashboard/address.json";
import { getAddress, addAddress, delAddress, updateAddress, defaultAddress } from "@/service/dashboard/goods";
import { omit } from "lodash";
import uc from "@/components/dashboard/uc.vue";
export default {
    name: "myAddress",
    components: { uc },
    data: function () {
        const checkPhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入手机号"));
                return;
            }

            const num = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if (!num.test(value)) {
                callback(new Error("请输入正确的手机号"));
            } else {
                callback();
            }
        };
        const checkAddress = (rule, value, callback) => {
            if (value) {
                callback();
            } else {
                callback(new Error("请输入具体地址"));
            }
        };
        return {
            address: [],
            addressList,

            list: [],
            loading: false,
            visible: false,
            form: {
                contact_name: "",
                contact_phone: "",
                province: "",
                city: "",
                area: "",
                address: "",
            },

            rules: {
                contact_name: [{ required: true, message: "请输入联系人名称", trigger: "blur" }],
                contact_phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
                province: [{ required: true, message: "请选择省市区", trigger: "change" }],
                address: [{ required: true, validator: checkAddress, trigger: "blur" }],
            },
        };
    },
    computed: {},
    methods: {
        getEmptyForm() {
            return {
                contact_name: "",
                contact_phone: "",
                province: "",
                city: "",
                area: "",
                address: "",
            };
        },
        load() {
            this.loading = true;
            return getAddress()
                .then((res) => {
                    this.list = res.data?.data?.list || [];
                })
                .catch(() => {
                    this.list = [];
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        add() {
            this.visible = true;
            this.form = this.getEmptyForm();
            this.address = [];
        },
        reset() {
            this.visible = false;
            this.resetForm();
            this.load();
        },
        resetForm() {
            this.form = this.getEmptyForm();
            this.address = [];
            this.$refs.ruleForm?.clearValidate();
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const form = omit(this.form, ["created_at", "updated_at", "user_id", "id", "is_default"]);
                    this.form.id
                        ? updateAddress(this.form.id, form).then(() => {
                              this.$message({
                                  message: "编辑成功",
                                  type: "success",
                              });
                              this.reset();
                          })
                        : addAddress(form).then(() => {
                              this.$message({
                                  message: "添加成功",
                                  type: "success",
                              });
                              this.reset();
                          });
                }
            });
        },
        handleChange(list) {
            this.form.province = list?.[0] || "";
            this.form.city = list?.[1] || "";
            this.form.area = list?.[2] || "";
            this.$refs.ruleForm?.validateField("province");
        },
        edit(item) {
            this.visible = true;
            this.form = { ...item };
            this.address = [this.form.province, this.form.city, this.form.area];
        },
        del(id) {
            delAddress(id).then(() => {
                this.$message({
                    message: "删除成功",
                    type: "success",
                });
                this.load();
            });
        },
        change(row) {
            if (!row.is_default) {
                this.load();
                return;
            }
            defaultAddress(row.id).then(() => {
                this.load();
            });
        },
    },
    created: function () {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/address.less";
</style>
