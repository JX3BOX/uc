<template>
    <div class="m-publish-xf">
        <el-form-item label="心法">
            <el-radio
                v-for="(item, i) in xfmap"
                v-model="xf"
                :value="item.name"
                :key="i"
                v-show="item.client.includes(exact_client)"
            >
                <img
                    class="u-pic"
                    :src="xficon(item.id)"
                    :alt="item.name"
                    onerror="this.src='https://img.jx3box.com/image/xf/0.png'"
                />
                <span class="u-txt">{{ item.name }}</span>
            </el-radio>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { __imgPath } from "@/utils/config";
export default {
    name: "publish_xf",
    props: {
        modelValue: {
            type: String,
            default: undefined,
        },
        data: {
            type: String,
            default: "",
        },
        client: {
            type: String,
            default: "std",
        },
    },
    data: function () {
        return {
            xf: this.modelValue !== undefined ? this.modelValue : this.data,
            exact_client: this.client || "std",
        };
    },
    emits: ["update", "update:modelValue"],
    watch: {
        modelValue: function (newval) {
            if (newval !== undefined) {
                this.xf = newval;
            }
        },
        data: function (newval) {
            if (this.modelValue === undefined) {
                this.xf = newval;
            }
        },
        xf: {
            deep: true,
            handler: function (newval) {
                this.$emit("update:modelValue", newval);
                this.$emit("update", newval);
            },
        },
        client: function (val) {
            if (val === "wujie") val = "std";
            this.exact_client = val || "std";
        },
    },
    computed: {
        xfmap() {
            const _xfmap = {};
            for (let key in xfmap) {
                const item = xfmap[key];
                if (key !== "山居剑意" && item.client.includes(this.exact_client)) {
                    _xfmap[key] = item;
                }
            }
            return _xfmap;
        },
    },
    methods: {
        xficon: function (id) {
            return __imgPath + "image/xf/" + id + ".png";
        },
    },
};
</script>
