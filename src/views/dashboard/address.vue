<template>
    <uc>
        <div class="m-page-address">
            <!-- 显示地址 -->
            <el-button type="primary" icon="Plus" @click="add">{{ $t("dashboard.address.add") }}</el-button>

            <div class="m-content">
                <ContentSkeleton v-if="loading" variant="table" :rows="5" :columns="5" />
                <el-table v-else :data="list">
                    <el-table-column prop="contact_name" :label="$t('dashboard.common.name')" width="180"> </el-table-column>
                    <el-table-column prop="contact_phone" :label="$t('dashboard.common.phone')" width="180"> </el-table-column>
                    <el-table-column :label="$t('dashboard.address.default')" width="180">
                        <template #default="scope">
                            <el-switch v-model="scope.row.is_default" @change="change(scope.row)"> </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('dashboard.common.address')">
                        <template #default="scope">
                            {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.address }}
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('dashboard.common.actions')" width="180">
                        <template #default="scope">
                            <div class="m-actions">
                                <!--编辑-->
                                <el-button circle @click="edit(scope.row)" icon="Edit"></el-button>
                                <!--删除-->
                                <el-popconfirm
                                    :confirm-button-text="$t('dashboard.common.confirm')"
                                    :cancel-button-text="$t('dashboard.common.cancel')"
                                    icon="InfoFilled"
                                    :title="$t('dashboard.common.deleteConfirm')"
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
                :title="form.id ? $t('dashboard.address.edit') : $t('dashboard.address.add')"
                width="680px"
                @closed="resetForm"
            >
                <el-form :model="form" :rules="rules" ref="ruleForm" label-position="top">
                    <el-form-item :label="$t('dashboard.address.contact')" prop="contact_name">
                        <el-input :placeholder="$t('dashboard.common.namePlaceholder')" v-model="form.contact_name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('dashboard.common.mobile')" prop="contact_phone">
                        <el-input :placeholder="$t('dashboard.common.mobilePlaceholder')" v-model="form.contact_phone"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('dashboard.address.contactAddress')" prop="province">
                        <el-cascader
                            class="u-address"
                            v-model="address"
                            :options="addressList"
                            :placeholder="$t('dashboard.address.regionPlaceholder')"
                            clearable
                            filterable
                            @change="handleChange"
                        ></el-cascader>
                        <el-form-item class="m-detail-address" prop="address">
                            <el-input :placeholder="$t('dashboard.address.detailPlaceholder')" v-model="form.address"></el-input>
                        </el-form-item>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="visible = false">{{ $t("dashboard.common.cancel") }}</el-button>
                    <el-button type="primary" @click="submit('ruleForm')">{{ $t("dashboard.common.confirm") }}</el-button>
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
                callback(new Error(this.$t("dashboard.common.mobilePlaceholder")));
                return;
            }

            const num = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            if (!num.test(value)) {
                callback(new Error(this.$t("dashboard.address.invalidMobile")));
            } else {
                callback();
            }
        };
        const checkAddress = (rule, value, callback) => {
            if (value) {
                callback();
            } else {
                callback(new Error(this.$t("dashboard.address.detailRequired")));
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
                contact_name: [{ required: true, message: this.$t("dashboard.address.contactRequired"), trigger: "blur" }],
                contact_phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
                province: [{ required: true, message: this.$t("dashboard.address.regionRequired"), trigger: "change" }],
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
                                  message: this.$t("dashboard.common.editSuccess"),
                                  type: "success",
                              });
                              this.reset();
                          })
                        : addAddress(form).then(() => {
                              this.$message({
                                  message: this.$t("dashboard.common.addSuccess"),
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
                    message: this.$t("dashboard.common.deleteSuccess"),
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
