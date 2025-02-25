<template>
    <uc>
        <div class="m-page-address">
            <!-- 显示地址 -->
            <el-button type="primary" icon="el-icon-plus" @click="add" size="small">添加地址</el-button>

            <div class="m-content">
                <el-table :data="list" size="small">
                    <el-table-column prop="contact_name" label="姓名" width="180"> </el-table-column>
                    <el-table-column prop="contact_phone" label="电话" width="180"> </el-table-column>
                    <el-table-column label="默认地址" width="180">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.is_default" @change="change(scope.row)"> </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="地址">
                        <template slot-scope="scope">
                            {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <div>
                                <!--编辑-->
                                <el-button circle @click="edit(scope.row)" icon="el-icon-edit-outline" size="mini"></el-button>
                                <!--删除-->
                                <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" title="确定删除吗？" @confirm="del(scope.row.id)">
                                    <el-button style="margin-left: 10px" slot="reference" circle size="mini" icon="el-icon-delete"></el-button>
                                </el-popconfirm>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 地址表单 -->
            <el-dialog custom-class="m-address-dialog" :visible.sync="visible" title="我的地址" width="750px">
                <el-form :model="form" :rules="rules" ref="ruleForm" label-position="top">
                    <el-form-item label="联系人" prop="contact_name">
                        <el-input placeholder="请输入名称" v-model="form.contact_name"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="contact_phone">
                        <el-input placeholder="请输入手机号" v-model="form.contact_phone"></el-input>
                    </el-form-item>
                    <el-form-item label="联系地址" prop="address">
                        <div class="m-line">
                            <el-cascader
                                class="u-address"
                                v-model="address"
                                :options="addressList"
                                @change="handleChange"
                            ></el-cascader>
                            <el-input placeholder="详细地址" v-model="form.address"></el-input>
                        </div>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="m-footer">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
                </span>
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
            if (value) {
                const num = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!num.test(value)) {
                    callback(new Error("请输入正确的手机号"));
                } else {
                    callback();
                }
            }
        };
        const checkAddress = (rule, value, callback) => {
            if (value) {
                if (this.form.province) {
                    callback();
                } else {
                    callback(new Error("请选择省市区"));
                }
            } else {
                callback(new Error("请输入具体地址"));
            }
        };
        return {
            address: "",
            addressList,

            list: [],
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
                address: [{ required: true, validator: checkAddress, trigger: "blur" }],
            },
        };
    },
    computed: {},
    methods: {
        load() {
            getAddress().then((res) => {
                this.list = res.data.data.list;
            });
        },
        add() {
            this.visible = true;
            this.form = this.$options.data().form;
            this.address = "";
        },
        reset() {
            this.visible = false;
            this.form = this.$options.data().form;
            this.address = "";
            location.reload();
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
                        : addAddress(this.form).then((res) => {
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
            this.form.province = list[0];
            this.form.city = list[1];
            this.form.area = list[2];
        },
        edit(item) {
            this.visible = true;
            this.form = item;
            this.address = [this.form.province, this.form.city, this.form.area];
        },
        del(id) {
            delAddress(id).then(() => {
                this.$message({
                    message: "删除成功",
                    type: "success",
                });
                location.reload();
            });
        },
        change(row) {
            if (!row.is_default) return;
            defaultAddress(row.id).then(() => {
                location.reload();
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
