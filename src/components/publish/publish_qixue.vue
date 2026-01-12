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
            sq: "1,1,1,1,1,1,1,1,2,3",
        };
    },
    computed: {
        client() {
            return this.isWujie ? "wujie" : "std";
        },
        reloadTrigger() {
            return [this.client, this.subtype, this.value];
        },
    },
    watch: {
        reloadTrigger: {
            handler(val) {
                const shouldLength = this.client === "std" ? 10 : 4;
                let __data;
                if (this.value) {
                    try {
                        __data = JSON.parse(this.value);
                    } catch (error) {
                        console.error(error);
                    }
                }
                if (!__data || __data.sq.split(",").length !== shouldLength) {
                    // 未传入数据，或者传入的value格式不对
                    this.sq = Array.from({ length: shouldLength }, (_, i) => (i < 7 ? 1 : i - 6)).join(",");
                } else {
                    this.sq = __data.sq;
                }
                this.reloadTalent();
            },
            immediate: true,
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
