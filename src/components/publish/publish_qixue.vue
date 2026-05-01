<template>
    <div class="m-publish-qixue" v-show="subtype !== '通用'">
        <h5 class="u-title">奇穴方案</h5>
        <div class="m-talent-box qx-container"></div>
    </div>
</template>

<script>
import JX3_QIXUE from "@jx3box/jx3box-talent";
import "@jx3box/jx3box-talent/talent.css";
import $ from "jquery";

import { getBreadCrumb } from "@/service/publish/cms";
export default {
    name: "publish_qixue",
    props: {
        subtype: {
            type: String,
            default: "通用",
        },
        editable: {
            type: Boolean,
            default: true,
        },
        modelValue: {
            type: String,
            default: undefined,
        },
        value: {
            type: String,
            default: "",
        },
        isWujie: {
            type: Number,
            default: 0,
        },
    },
    emits: ["update", "update:modelValue"],
    data() {
        return {
            driver: null,
            version: {
                std: "",
                wujie: "",
            },
            sq: "1,1,1,1,1,1,1,1,2,3",
            changeHandler: null,
            lastReloadSignature: "",
        };
    },
    computed: {
        client() {
            return this.isWujie ? "wujie" : "std";
        },
        currentValue() {
            return this.modelValue !== undefined ? this.modelValue : this.value;
        },
        reloadTrigger() {
            return [this.client, this.subtype, this.currentValue];
        },
    },
    watch: {
        reloadTrigger: {
            handler() {
                const __data = this.parseTalentValue(this.currentValue);
                const nextSq = __data && typeof __data.sq === "string" ? __data.sq : this.getDefaultSq();
                const nextSignature = this.buildReloadSignature(nextSq);

                if (this.driver && this.lastReloadSignature === nextSignature) {
                    return;
                }

                this.sq = nextSq;
                this.reloadTalent(nextSignature);
            },
            immediate: true,
        },
    },
    mounted() {
        this.installTalent();
    },
    beforeUnmount() {
        if (this.changeHandler) {
            $(document).off("JX3_QIXUE_Change", this.changeHandler);
        }
    },
    methods: {
        parseTalentValue(value) {
            if (!value) return null;
            try {
                return JSON.parse(value);
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        getDefaultSq() {
            return this.client === "std" ? "1,1,1,1,1,1,1,1,2,3" : "1,1,1,1";
        },
        buildReloadSignature(sq) {
            return [this.client, this.subtype, this.version[this.client] || "", sq].join("|");
        },
        async installTalent() {
            await getBreadCrumb("pvp_talent_version").then((res) => {
                this.version.std = res.data?.data?.html;
            });
            await getBreadCrumb("pvp_talent_version_mobile").then((res) => {
                this.version.wujie = res.data?.data?.html;
            });

            this.driver = new JX3_QIXUE({
                version: this.version[this.client],
                editable: this.editable,
                client: this.client,
            });

            this.reloadTalent(this.buildReloadSignature(this.sq));

            const vm = this;
            if (this.changeHandler) {
                $(document).off("JX3_QIXUE_Change", this.changeHandler);
            }

            this.changeHandler = function (e, ins) {
                if (!ins || ins.xf !== vm.subtype) {
                    return;
                }

                let __data = ins.code;
                const next = JSON.stringify(__data);
                vm.sq = __data.sq;

                if (next === vm.currentValue) return;

                vm.$emit("update:modelValue", next);
                vm.$emit("update", next);
            };

            $(document).off("JX3_QIXUE_Change", this.changeHandler).on("JX3_QIXUE_Change", this.changeHandler);
        },
        reloadTalent(signature) {
            if (!this.subtype || this.subtype == "通用") return;
            this.$nextTick(() => {
                if (!this.driver) return;
                this.driver?.then((talent) => {
                    this.lastReloadSignature = signature || this.buildReloadSignature(this.sq);
                    talent.load({
                        xf: this.subtype,
                        client: this.client,
                        sq: this.sq,
                        version: this.version[this.client],
                    });
                });
            });
        },
    },
};
</script>
