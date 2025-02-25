<template>
    <div class="m-publish-fb">
        <!-- 1.选择资料片 -->
        <el-form-item label="资料片" v-if="zlp_list">
            <el-radio
                v-for="(zlp, i) in zlp_list"
                :label="zlp"
                border
                :key="i"
                v-model="fbdata.fb_zlp"
                @change="zlpChange(zlp)"
            >
                {{ zlp }}
                <span class="u-level">{{ fbmap[zlp]["level"] }}</span>
            </el-radio>
        </el-form-item>

        <!-- 2.选择副本名称 -->
        <el-form-item label="副本名称" v-if="fb_list">
            <el-radio
                class="u-fb-thumbnail"
                v-for="(fb, key) in fb_list"
                :label="key"
                :key="key"
                v-model="fbdata.fb_name"
                @change="subtypeChange(key)"
            >
                <img :src="fb.icon | thumbnail(fb.icon)" :alt="key" onerror="this.src='https://img.jx3box.com/image/fb_map_thumbnail/undefined.png'"/>
                <span>{{ key }}</span>
            </el-radio>
        </el-form-item>

        <!-- 选择BOSS -->
        <el-form-item :label="fbdata.fb_name == '剑踪幻域' ? '秘境名称' : '首领名称'" v-if="boss_list">
            <div class="u-boss-list">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                    全部
                </el-checkbox>
                <el-checkbox-group v-model="fbdata.fb_boss" @change="handleCheckedBossesChange">
                    <el-checkbox v-for="(boss, i) in boss_list" :label="boss" :key="i">{{ boss }}</el-checkbox>
                </el-checkbox-group>
            </div>
        </el-form-item>

        <!-- 选择难度模式 -->
        <el-form-item label="难度模式" v-if="level_list">
            <el-checkbox-group v-model="fbdata.fb_level">
                <el-checkbox
                    v-for="level in level_list"
                    :label="level.mode"
                    :key="level.mode + level.map_id"
                ></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <slot></slot>
    </div>
</template>

<script>
import lodash from "lodash";
import isEmptyMeta from "@/utils/isEmptyMeta.js";
import fbmap_std from "@jx3box/jx3box-data/data/fb/fb_map.json";
import fbmap_origin from "@jx3box/jx3box-data/data/fb/fb_map_origin.json";
import { __ossMirror, __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import Bus from "@/utils/bus.js";
// META空模板
const default_meta = {
    fb_zlp: "",
    fb_name: "",
    fb_boss: [],
    fb_level: [],
};
export default {
    name: "publishFb",
    props: ["data", "client"],
    components: {},
    data: function () {
        return {
            isIndeterminate: false,
            checkAll: false,
            fbdata: this.data,
            // fbmap,
        };
    },
    model: {
        prop: "data", //向上同步数据
        event: "update",
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler: function (newval) {
                if (!newval || isEmptyMeta(newval)) {
                    this.fbdata = lodash.cloneDeep(default_meta);
                } else {
                    this.fbdata = newval;
                }
            },
        },
        fbdata: {
            deep: true,
            handler: function (newval) {
                this.$emit("update", newval);
            },
        },
        "fbdata.fb_zlp": function (val) {
            this.isIndeterminate = false;
            this.checkAll = false;
            val && this.$emit("updateMeta", { key: "zlp", val: val });
        },
        "fbdata.fb_name": function (val) {
            this.isIndeterminate = false;
            this.checkAll = false;
            val && this.$emit("updateMeta", { key: "post_subtype", val: val });
        },
    },
    computed: {
        fbmap: function () {
            return this.client == "origin" ? fbmap_origin : fbmap_std;
        },
        zlp_list: function () {
            return Object.keys(this.fbmap);
        },
        fb_list: function () {
            let zlp = this.fbmap?.[this.fbdata.fb_zlp];
            return lodash.get(zlp, "dungeon");
        },
        boss_list: function () {
            return lodash.get(this.fb_list?.[this.fbdata?.fb_name], "boss");
        },
        level_list: function () {
            return lodash.get(this.fb_list?.[this.fbdata?.fb_name], "maps");
        },
        default_zlp: function () {
            return lodash.get(this.zlp_list, 0);
        },
        default_fb: function () {
            return Object.keys(this.fbmap[this.default_zlp]["dungeon"])[0];
        },
    },
    methods: {
        handleCheckAllChange(val) {
            this.fbdata.fb_boss = val ? this.boss_list : [];
            this.isIndeterminate = false;
        },
        handleCheckedBossesChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.boss_list.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.boss_list.length;
        },
        // 设置默认资料片和副本
        setDefaultOption: function () {
            this.fbdata.fb_name = this.default_fb;
            this.fbdata.fb_zlp = this.default_zlp;
        },
        // 当切换资料片时
        zlpChange: function (zlp) {
            let first = Object.keys(this.fbmap[zlp]["dungeon"])[0];
            this.fbdata.fb_name = first;
            this.fbdata.fb_boss = [];
            this.fbdata.fb_level = [];
        },
        // 当副本切换时
        subtypeChange: function (subtype) {
            this.fbdata.fb_boss = [];
            this.fbdata.fb_level = [];
        },
    },
    filters: {
        thumbnail: function (url) {
            return __imgPath + url + "?v=" + Date.now();
        },
    },
    created: function () {},
    mounted: function () {
        this.setDefaultOption();
        // 当切换客户端版本时
        Bus.$on("changeClient", (client) => {
            this.setDefaultOption();
        });
    },
};
</script>
<style lang="less">
.u-boss-list {
    .flex;
    align-items: flex-start;
    gap: 30px;
}
</style>
