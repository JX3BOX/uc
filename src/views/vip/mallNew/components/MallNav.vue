<template>
    <div :class="{ 'is-hidden': !isShowNav, 'm-mall-nav': true }">
        <div class="left">
            <a :href="lotteryLink" class="image u-lottery-link" target="_blank" v-if="showLottery">
                <el-image :src="lottery" :fit="cover"></el-image>
            </a>
            <div class="m-mall-types">
                <div class="u-item" v-for="(item, i) in types" :key="i">
                    <!-- 分组名 -->
                    <div
                        :class="{ 'u-title': true, active: query.category == item.key }"
                        @click="itemLinkClick(item.key)"
                        v-if="item.key != 'system'"
                    >
                        <i class="u-icon" :class="item.icon"></i> {{ item.name }}
                    </div>
                    <span
                        v-else
                        class="u-title"
                        :class="query.category == item.key ? 'active' : ''"
                        style="cursor: default"
                        ><i class="u-icon" :class="item.icon"></i> {{ item.name }}</span
                    >

                    <!-- 子列表 -->
                    <div class="u-children-list" v-if="item.key != 'system'">
                        <div
                            :class="{ 'u-child': true, active: query.sub_category == child.key }"
                            v-for="(child, key) in item.sub_category"
                            :key="key"
                            @click="childLinkClick(item.key, child.key)"
                        >
                            <img
                                svg-inline
                                :src="
                                    require(`@/assets/img/vip/mall/icon_0${
                                        query.sub_category !== child.key ? '1' : '2'
                                    }.svg`)
                                "
                            />
                            {{ child.name }}
                        </div>
                    </div>
                    <div class="u-children-list" v-else>
                        <a
                            :href="child.link"
                            :target="child.target"
                            class="u-child"
                            v-for="(child, key) in item.sub_category"
                            :key="key"
                            :class="
                                query.sub_category == child.key
                                    ? 'active'
                                    : query.sub_category == child.key
                                    ? 'active'
                                    : ''
                            "
                        >
                            <img
                                svg-inline
                                :src="
                                    require(`@/assets/img/vip/mall/icon_0${
                                        query.sub_category !== child.key ? '1' : '2'
                                    }.svg`)
                                "
                            />
                            {{ child.name }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <SearchBox></SearchBox>
            <div class="goods-list">
                <GoodItem v-for="(item, index) in list" :key="index" :good="item"></GoodItem>
            </div>
            <div class="pagination">
                <el-pagination
                    :layout="query.pageSize == 10 ? 'total,prev, pager, next' : 'prev, pager, next'"
                    :pager-count="5"
                    :total="query.total"
                    :page-size.sync="query.pageSize"
                    :current-page.sync="query.pageIndex"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </div>
        </div>
        <div class="nav-button" v-if="isShowNav" @click="$emit('changeNav')">
            收起<i class="el-icon-arrow-left"></i>
        </div>
        <div class="nav-button" v-if="!isShowNav" @click="$emit('changeNav')">
            展开<i class="el-icon-arrow-right"></i>
        </div>
    </div>
</template>

<script>
import { getConfig } from "@/service/vip/cms";
import { getDecoration } from "@/service/author/cms";
import { __Root, __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import User from "@jx3box/jx3box-common/js/user";
import types from "@/assets/data/vip/goods_types.json";
import SearchBox from "./SearchBox.vue";
import GoodItem from "./GoodItem.vue";
export default {
    name: "MallNav",
    components: {
        SearchBox,
        GoodItem,
    },
    data() {
        return {
            isShow: true,
            types,
            showLottery: false,
            exitList: [],
        };
    },
    inject: ["query", "changeQuery"],
    props: {
        list: {
            type: Array,
            required: true,
        },
        isShowNav: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        lotteryLink() {
            return __Root + "vip/lottery";
        },
        lottery() {
            return __cdn + "design/event/lottery/lottery.png";
        },
    },
    mounted() {
        this.loadConfig();
        this.getDecoration();
    },
    methods: {
        async getDecoration() {
            if (User.profile?.uid) {
                const res = await getDecoration({ user_id: User.profile.uid });
                const emotionRes = await getDecoration({ user_id: User.profile.uid, type: "emotion" });
                const list = res.data?.data || [];
                const emotionList = emotionRes.data?.data || [];
                this.exitList = list.concat(emotionList);
            }
        },
        itemLinkClick(key) {
            this.changeQuery(["category", "sub_category"], [key, ""]);
        },
        childLinkClick(key, child) {
            this.changeQuery(["category", "sub_category"], [key, child]);
        },
        handleCurrentChange(page) {
            this.changeQuery("pageIndex", page, true);
        },
        loadConfig() {
            getConfig({ key: "mall_lottery_pic" }).then((res) => {
                this.showLottery = res?.val == "0" ? false : true;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.m-mall-nav {
    width: 880px;
    display: flex;
    transition: all 0.3s ease-in-out;
    position: relative;
    &.is-hidden {
        transform: translateX(-100%);
    }
    .left {
        width: 180px;
        background: linear-gradient(0deg, rgba(0, 0, 0, 1) 50.93%, rgba(71, 36, 0, 1) 100%);
        .image {
            .dbi;
            width: 180px;
            height: 90px;
            color: white;
        }
        .m-mall-types {
            min-height: calc(100vh - 202px);
            .pt(12px);
            .u-title {
                .bold;
                .color(rgba(194, 194, 194, 1));
                &.active,
                &:not(.active):hover {
                    .color(#0366d6);
                }
                &.active {
                    .color(rgba(255, 195, 0, 1));
                    .u-icon {
                        color: white;
                    }
                }
                .fz(16px);
                .db;
                padding: 8px 8px 8px 26px;
                .flex;
                align-items: center;
                .pointer;
            }
            .u-icon {
                .fz(16px);
                .mr(3px);
            }
            .u-arrow {
                font-size: 12px;
                .mr(4px);
            }

            .u-children-list {
                .flex;
                .pl(48px);
                flex-direction: column;
            }
            .u-child {
                .pointer;
                .flex;
                align-items: center;
                padding: 8px 0;
                gap: 4px;
                .color(rgba(163, 163, 163, 1));
                &.active {
                    .color(rgba(255, 195, 0, 1));
                    .u-arrow {
                        color: white;
                    }
                }
                &:not(.active):hover {
                    .color(@pink);
                }
                &.active {
                    .bold;
                }
                .fz(16px);
            }
        }
    }
    .right {
        width: 700px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.5);
        .goods-list {
            width: 100%;
            height: 664px;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-content: flex-start;
        }
        .pagination {
            display: flex;
            justify-content: center;
            margin-top: 33px;
            /deep/ .el-pagination {
                font-weight: 400;
                background-color: transparent;
                button,
                .el-pagination__total,
                .el-pager li {
                    background-color: transparent;
                    color: white;
                }
                button,
                .el-pager li {
                    color: white;
                    margin: 0 12px;
                    &:hover {
                        color: #5cb6ff;
                    }
                }
                .el-pager li {
                    &.active {
                        .size(24px);
                        .bold;
                        .fz(18px,24px);
                        border-radius: 12px;
                        background: rgba(255, 255, 255, 0.75);
                        color: #000;
                        padding: 0;
                        margin: 2px 12px;
                        min-width: 24px;
                    }
                }
            }
        }
    }

    .nav-button {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        width: 33px;
        height: 69px;
        border-radius: 0px 8px 8px 0px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 100%;
        top: calc(50% - 34.5px);
        font-size: 12px;
        color: rgba(255, 255, 255, 1);
        padding: 10px;
        cursor: pointer;
    }
}
@media screen and (max-width: 1550px) {
    .m-mall-nav {
        width: 510px;
        .right {
            width: 330px;
        }
    }
}
</style>
