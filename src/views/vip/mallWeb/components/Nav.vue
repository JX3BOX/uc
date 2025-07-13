<template>
    <div class="m-mall-types" :class="{ isShow: $store.state.mallNew.navIsShow }">
        <div class="close-icon" @click="$store.commit('mallNew/toState', { navIsShow: false })">
            <i class="el-icon-s-fold"></i>
        </div>
        <div class="u-item" v-for="(item, i) in types" :key="i">
            <!-- 分组名 -->
            <div
                :class="{ 'u-title': true, active: query.category == item.key }"
                @click="itemLinkClick(item.key)"
                v-if="item.key != 'system'"
            >
                <i class="u-icon" :class="item.icon"></i> {{ item.name }}
            </div>
            <span v-else class="u-title" :class="query.category == item.key ? 'active' : ''" style="cursor: default"
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
                    <i class="u-arrow el-icon-caret-right"></i>
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
                        query.sub_category == child.key ? 'active' : query.sub_category == child.key ? 'active' : ''
                    "
                >
                    <i class="u-arrow el-icon-caret-right"></i> {{ child.name }}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import types from "@/assets/data/vip/goods_types.json";
export default {
    name: "Nav",
    data() {
        return {
            types,
        };
    },
    inject: ["query", "changeQuery"],
    methods: {
        itemLinkClick(key) {
            this.changeQuery(["category", "sub_category"], [key, ""]);
        },
        childLinkClick(key, child) {
            this.changeQuery(["category", "sub_category"], [key, child]);
        },
        handleCurrentChange(page) {
            this.changeQuery("pageIndex", page, true);
        },
    },
};
</script>

<style lang="less" scoped>
.m-mall-types {
    height: calc(100vh - 9.6vw);
    width: 48vw;
    background: linear-gradient(180deg, rgba(0, 0, 0, 1) 50.93%, rgba(71, 36, 0, 1) 100%);
    position: fixed;
    top: 9.6vw;
    left: -48vw;
    transition: all 0.3s ease-in-out;
    z-index: 1000;
    overflow-y: scroll;
    scrollbar-width: none;
    &.isShow {
        transform: translateX(48vw);
    }
    .close-icon {
        color: white;
        font-size: 5.3333vw;
        padding: 2.6667vw 6.4vw;
        text-align: right;
    }
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
        .fz(4.2667vw);
        .db;
        padding: 2.1333vw 2.1333vw 2.1333vw 6.9333vw;
        .flex;
        align-items: center;
        .pointer;
    }
    .u-icon {
        .fz(4.2667vw);
        .mr(0.8vw);
    }
    .u-arrow {
        font-size: 3.2vw;
        .mr(1.0667vw);
    }

    .u-children-list {
        .flex;
        .pl(12.8vw);
        flex-direction: column;
    }
    .u-child {
        .pointer;
        .flex;
        align-items: center;
        padding: 2.1333vw 0;
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
        .fz(4.2667vw);
    }
}
</style>
