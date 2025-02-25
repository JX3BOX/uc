<template>
    <div class="m-publish-xf">
        <el-form-item label="心法">
            <el-radio
                v-for="(item, i) in xfmap"
                v-model="xf"
                :label="item.name"
                :key="i"
                v-show="item.client.includes(exact_client)"
            >
                <img class="u-pic" :src="item.id | xficon" :alt="item.name" onerror="this.src='https://img.jx3box.com/image/xf/0.png'"/>
                <span class="u-txt">{{ item.name }}</span>
            </el-radio>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "publish_xf",
    props: ["data", "client"],
    data: function () {
        return {
            xf: this.data,
            exact_client: this.client || "std",
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.xf = newval;
        },
        xf: {
            deep: true,
            handler: function (newval) {
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
            delete xfmap["山居剑意"];
            return xfmap;
        },
    },
    methods: {},
    filters: {
        xficon: function (id) {
            return __imgPath + "image/xf/" + id + ".png";
        },
    },
    mounted: function () {},
    components: {},
};
</script>
