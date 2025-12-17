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
        value: {
            type: String,
            default: "",
        },
        isWujie: {
            type: Number,
            default: 0,
        },
    },
    model: {
        prop: "value",
        event: "update",
    },
    data() {
        return {
            driver: null,
            version: {
                std: "",
                wujie: "",
            },
            sq: "1,1,1,1,1,1,1,1,1,1,1,1",
        };
    },
    computed: {
        client() {
            return this.isWujie ? "wujie" : "std";
        },
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(val) {
                if (!val) return;
                try {
                    let __data = JSON.parse(val);
                    this.sq = __data.sq;
                    this.reloadTalent();
                } catch (error) {
                    console.log(error);
                }
            },
        },
        subtype: {
            immediate: true,
            handler(val) {
                this.reloadTalent();
            },
        },
        isWujie: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.sq = "1,1,1,1";
                } else {
                    this.sq = "1,1,1,1,1,1,1,1,2,3";
                }
                this.reloadTalent();
            },
        },
    },
    mounted() {
        this.installTalent();
    },
    methods: {
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

            this.reloadTalent();

            const vm = this;
            $(document).on("JX3_QIXUE_Change", function (e, ins) {
                let __data = ins.code;

                vm.$emit("update", JSON.stringify(__data));
            });
        },
        reloadTalent() {
            if (!this.subtype || this.subtype == "通用") return;
            this.$nextTick(() => {
                if (!this.driver) return;
                this.driver?.then((talent) => {
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
