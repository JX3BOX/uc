<template>
    <uc class="m-dashboard-theme m-dashboard-skin" icon="el-icon-brush" title="主题装扮" :tab-list="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--mini is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> 前往获取装扮</a
            >
        </template>
        <div class="m-theme-box">
            <!-- 左右两侧 -->
            <div class="m-theme-left">
                <div class="u-top">
                    <img :src="previewUrl" class="u-img" fit="contain" v-if="previewUrl" />
                    <div class="u-no-preview" v-else>
                        暂 无<br />
                        预 览
                    </div>
                </div>
                <div class="u-bottom">
                    <div class="u-type-box" v-for="(item, index) in themeType" :key="index">
                        <img
                            :src="getActiveImg(item)"
                            class="u-img"
                            fit="contain"
                            v-if="isStatus(item)"
                            @click="preview(item)"
                        />
                        <div class="u-no-select" v-else-if="!item.statue">
                            敬 请<br />
                            期 待
                        </div>
                        <div class="u-no-select" v-else>
                            暂 无<br />
                            设 置
                        </div>
                        <div class="u-title">{{ item.name }}</div>
                    </div>
                </div>
            </div>
            <div class="m-theme-right">
                <!-- 主题渲染列表 -->
                <div class="u-theme">
                    <div class="u-decoration-list" v-for="(item, i) in decoration" :key="i + item.val">
                        <div class="u-title">
                            <span class="u-name"><i class="el-icon-collection-tag"></i> {{ item.name }}</span>
                            <a
                                class="u-buy"
                                :href="`/vip/mall?category=virtual&sub_category=skin&search=${item.name}`"
                                target="_blank"
                                ><i class="el-icon-shopping-cart-2"></i> 前往获取</a
                            >
                        </div>
                        <div class="u-decoration-item">
                            <div v-for="(item2, i2) in item.list" :key="'c' + i2" :title="item2.name" class="u-picbox">
                                <div
                                    class="u-pic"
                                    :class="item2.isHave ? (item2.using ? 'select' : '') : 'noHave'"
                                    @click="setStatus(i, i2, item2)"
                                >
                                    <el-image :src="item2 | showDecoration" fit="contain" />
                                </div>
                                <div class="u-decoration-name">{{ item2.text }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="u-btn">
            <el-button type="primary" @click="decorationSubmit">确认</el-button>
            <el-button @click="reset">重置</el-button>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { getDecoration, setDecoration, getDecorationJson } from "@/service/dashboard/decoration";
import User from "@jx3box/jx3box-common/js/user";
import { __imgPath, __cdn } from "@/utils/config";
import { cloneDeep, flatten } from "lodash";
import { themeTab } from "@/assets/data/dashboard/tabs.json";

const sortBy = function (sort) {
    return (x, y) => {
        return x[sort] - y[sort];
    };
};

//去重并判断是否拥有
const uniqueFromObject = function (arr, uniId, key, options, noKey = []) {
    let res = new Map(),
        newArr = [];
    let optionsClone = cloneDeep(options);
    let filterArr = arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
    optionsClone.forEach((item, i) => {
        item.val = key;
        if (noKey.indexOf(key) === -1) {
            let find = filterArr.find((e) => e.type == item.type);
            if (find) {
                item.isHave = 1;
                item.using = find.using;
            }
        }
        newArr.push(item);
    });
    return newArr;
};

export default {
    name: "theme",
    props: [],
    data: function () {
        return {
            tabList: themeTab,
            uid: User.getInfo().uid,
            themeType: [
                { name: "个人名片", type: "atcard", statue: 1 },
                { name: "主页风格", type: "homebg", statue: 1 },
                { name: "侧栏主题", type: "sidebar", statue: 1 },
                { name: "首页日历", type: "calendar", statue: 1 },
                { name: "评论皮肤", type: "comment", statue: 1 },
                //{ name: "社区称号", type: "", statue: 0 },
            ],
            previewUrl: "",
            decoration: [],
            decorationJson: [], //远程json
            originalActivateName: null,
            back: {},
        };
    },
    computed: {},
    methods: {
        reset() {
            let back = cloneDeep(this.back);
            this.previewUrl = "";
            this.decoration = back.decoration;
            this.originalActivateName = back.originalActivateName;
        },
        loadDecoration() {
            getDecorationJson().then((res) => {
                sessionStorage.setItem("decoration_json", JSON.stringify(res.data));
                this.decorationJson = res.data;
                getDecoration().then((res) => {
                    let typeArr = ["atcard", "homebg", "sidebar", "calendar", "comment"];
                    let arr = res.data.data.filter((item) => item.type != "" && typeArr.indexOf(item.type) != -1);
                    this.decoration = this.formattingData(arr, "val");
                    this.decoration = this.sortData(this.decoration, this.decorationJson);
                    this.back.decoration = cloneDeep(this.decoration);
                    this.back.originalActivateName = cloneDeep(this.originalActivateName);
                });
            });
        },
        //数据分组，设置已激活name
        formattingData(arr, group_key) {
            let map = {},
                res = [],
                noKey = [];
            let options = [
                { type: "atcard", text: "个人名片", sort: 1, isHave: 0, using: 0 },
                { type: "homebg", text: "主页风格", sort: 2, isHave: 0, using: 0 },
                { type: "sidebar", text: "侧栏主题", sort: 3, isHave: 0, using: 0 },
                { type: "calendar", text: "首页日历", sort: 4, isHave: 0, using: 0 },
                { type: "comment", text: "评论皮肤", sort: 5, isHave: 0, using: 0 },
            ];
            arr.forEach((item, i) => {
                let sortFind = options.find((e) => e.type == item.type);
                if (sortFind) {
                    item.sort = sortFind.sort;
                    if (!map[item[group_key]]) {
                        map[item[group_key]] = [item];
                    } else {
                        map[item[group_key]].push(item);
                    }
                    if (item.using) {
                        this.originalActivateName = item[group_key];
                    }
                }
            });

            let decorationJson = cloneDeep(this.decorationJson);
            Object.keys(decorationJson).forEach((key, i) => {
                if (!map[key] && decorationJson[key].status == 1) {
                    noKey.push(key);
                    let optionsClone = cloneDeep(options);
                    let newArr = [];
                    optionsClone.forEach((item) => {
                        item.val = key;
                        newArr.push(item);
                    });
                    map[key] = newArr;
                }
            });
            Object.keys(map).forEach((key, i) => {
                res.push({
                    [group_key]: key,
                    name: decorationJson[key]?.desc,
                    list: uniqueFromObject(map[key], "type", key, options, noKey).sort(sortBy("sort")),
                });
            });
            return res;
        },
        // 数据排序，新的装扮在前
        sortData(arr, source = {}) {
            // 根据source的顺序排序
            let res = [];
            const userHad = arr.filter((item) => item.list.some((e) => e.isHave));
            const userNo = arr.filter((item) => !item.list.some((e) => e.isHave));

            return userHad.reverse().concat(userNo.reverse());
        },
        //设置选中/取消
        setStatus(i, i2, item) {
            if (!item.isHave) {
                return;
            }
            let type = item.type;
            let val = item.val;
            // 消除激活的同部位
            this.decoration.forEach(({ list }, index) => {
                list.forEach((item, i) => {
                    if (item.val != val && item.type == type && item.using == 1) {
                        this.decoration[index].list[i].using = 0;
                    }
                });
            });

            item.using == 1 ? (item.using = 0) : (item.using = 1);
        },
        isStatus(item) {
            // 循环所有主题的卡片，判断是否有已激活的
            let type = item.type;
            var isSelect = false;
            const _decorations = flatten(this.decoration.map((item) => item.list));
            _decorations.forEach((item) => {
                if (item.type == type && item.using == 1) {
                    isSelect = true;
                }
            });
            if (isSelect) return true;
            else return false;
        },
        preview(item) {
            this.previewUrl = this.getActiveImg(item);
        },
        getActiveImg(item) {
            let type = item.type;
            let val = undefined;
            const _decorations = flatten(this.decoration.map((item) => item.list));
            _decorations.forEach((item) => {
                if (item.type == type && item.using == 1) {
                    val = item.val;
                }
            });
            let defaultImg = "https://cdn.jx3box.com/static/dashboard/img/no.5fe91973.svg";
            if (val) return __cdn + `design/decoration/images/${val}/${type}_preview.png`;
            else return defaultImg;
        },
        decorationSubmit() {
            let activateType = [];
            let decorationName = "";
            //激活主题
            const _decorations = flatten(this.decoration.map((item) => item.list));
            const params = _decorations.map((item) => {
                if (item.using == 1) activateType.push(item.type);
                return {
                    val: item.val,
                    using: item.using,
                    type: item.type,
                };
            });
            setDecoration(params).then((data) => {
                //开始设置主题缓存,设置执行持久缓存，同时设置session,其他库优先获取session,无则获取local,还没数据则请求库所在主题位置接口
                let decoration_res = {
                    name: decorationName, //主题名称
                    type: activateType, //主题激活部位，
                };
                if (!decorationName) {
                    decoration_res.name = false;
                }
                localStorage.setItem("decoration_all", JSON.stringify(decoration_res));
                //removeItem 个人相关部位
                sessionStorage.removeItem("decoration_me" + this.uid);
                sessionStorage.removeItem("decoration_sidebar" + this.uid);
                sessionStorage.removeItem("decoration_calendar");
                sessionStorage.removeItem("decoration_atcard" + this.uid);
                this.$message({
                    message: "主题更新成功",
                    type: "success",
                });
            });
        },
    },
    mounted: function () {
        this.loadDecoration();
    },
    filters: {
        showDecoration: function (item) {
            return __cdn + `design/decoration/images/${item.val}/${item.type}_preview.png`;
        },
    },
    components: {
        uc,
    },
};
</script>
<style lang="less">
@import "~@/assets/css/dashboard/theme.less";
</style>
