<template>
    <uc class="m-dashboard-medal m-dashboard-skin" icon="el-icon-brush" title="主题装扮" :tab-list="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--mini is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> 前往获取装扮</a
            >
        </template>
        <div class="m-medal">
            <div class="u-list">
                <div
                    class="u-item"
                    v-for="item in medals"
                    :key="item.id"
                    :class="{
                        'is-have': hasMedal(item.name),
                    }"
                >
                    <el-tooltip :content="item.desc">
                        <img class="u-img" :src="imgSrc(item.name)" :alt="item.name" />
                    </el-tooltip>
                </div>
            </div>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { themeTab } from "@/assets/data/dashboard/tabs.json";
import User from "@jx3box/jx3box-common/js/user";
import { getUserMedals, getMedals } from "@/service/dashboard/decoration";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
export default {
    name: "medal",
    components: {
        uc,
    },
    data: function () {
        return {
            tabList: themeTab,

            medals: [],

            userMedals: [],
        };
    },
    computed: {
        uid() {
            return User.getInfo().uid;
        },
    },
    mounted: function () {
        this.load();
    },
    methods: {
        load() {
            const params = {
                _no_page: 1,
                type: "user"
            }

            if (User.isLogin()) {
                getUserMedals(this.uid).then((res) => {
                    this.userMedals = res.data.data;

                    getMedals(params).then((res) => {
                        this.medals = res.data.data;
                        // 用户有的在前
                        this.medals.sort((a, b) => {
                            const aUsing = this.userMedals.findIndex((item) => item.medal == a.name) > -1;
                            const bUsing = this.userMedals.findIndex((item) => item.medal == b.name) > -1;
                            if (aUsing && !bUsing) {
                                return -1;
                            } else if (!aUsing && bUsing) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    });
                });
            }
        },
        imgSrc(name) {
            return __imgPath + "/image/medals/user/" + name + ".gif";
        },
        hasMedal(name) {
            return this.userMedals?.findIndex((item) => item.medal == name) > -1;
        }
    },
};
</script>
<style lang="less">
.m-dashboard-medal {
    .u-list {
        .flex;
        gap: 20px;
        // justify-content: center;
        flex-wrap: wrap;
        // max-width: 800px;
        margin:0 auto;
        padding:20px;
    }
    .u-pagination {
        margin-top: 20px;
        text-align: center;
    }
    .u-img {
        .size(40px);
        border: none;
    }

    .u-item {
        filter: grayscale(100%);

        &.is-have {
            filter: none;
        }
    }
}
</style>
