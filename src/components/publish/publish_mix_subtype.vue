<template>
    <div class="m-publish-xf m-publish-mix-subtype">
        <el-form-item label="跨心法">
            <el-select v-model="mix_subtype" multiple popper-class="m-mix-subtype__pop" style="width: 100%;">
                <el-option
                    v-for="(item, i) in xfmap"
                    :label="item.name"
                    :key="i"
                    :value="item.name"
                    v-show="item.client.includes(exact_client)"
                >
                    <div class="m-xf-item">
                        <img class="u-pic" :src="xficon(item.id)" :alt="item.name" />
                        <span class="u-txt">{{ item.name }}</span>
                    </div>
                </el-option>
            </el-select>
        </el-form-item>
        <slot></slot>
    </div>
</template>
<script>
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "publish_mix_subtype",
    props: ["data", "client"],
    data: function () {
        return {
            mix_subtype: this.data,

            exact_client: this.client || "std",
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: function (newval) {
            this.mix_subtype = newval;
        },
        mix_subtype: {
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
    methods: {
        xficon: function (id) {
            return __imgPath + "image/xf/" + id + ".png";
        },
    },
};
</script>

<style lang="less">
.m-publish-mix-subtype {
    .el-form-item {
        margin-bottom: 22px;
    }
}
.m-mix-subtype__pop {

    .m-xf-item {
        .flex;
        align-items: center;
        gap: 10px;
    }

    .u-pic {
        .size(24px);
    }
}
</style>
