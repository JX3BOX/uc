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
        <div class="m-medal-content">
            <el-divider content-position="left">已获得</el-divider>
            <div class="u-list">
                <div class="u-item is-have" v-for="item in userMedals" :key="item.id" :title="item.medal_desc">
                    <img class="u-img" :src="imgSrc(item.medal)" :alt="item.medal" />
                    <span class="u-model-name">{{ item.medal_desc }}</span>
                    <time :datetime="item.created_at" class="u-medal-time">{{ dateFormat(item.created_at) }}</time>
                    <el-button size="small" @click="onIsWearChange(item)"
                        :type="item.is_wear ? 'info' : 'primary'" :plain="!!item.is_wear"
                    >
                        <i :class="item.is_wear ? 'el-icon-help' : 'el-icon-s-help'"></i>
                        {{ item.is_wear ? "卸下" : "佩戴" }}
                    </el-button>
                </div>
            </div>
            <el-divider content-position="left">未获得</el-divider>
            <div class="u-list">
                <div class="u-item" v-for="item in noMedals" :key="item.id" :title="item.desc">
                    <img class="u-img" :src="imgSrc(item.name)" :alt="item.name" />
                    <span class="u-model-name">{{ item.desc }}</span>
                </div>
            </div>
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import { themeTab } from "@/assets/data/dashboard/tabs.json";
import User from "@jx3box/jx3box-common/js/user";
import { getUserMedals, getMedals, setMedal } from "@/service/dashboard/decoration";
import { __cdn } from "@jx3box/jx3box-common/data/jx3box.json";
import moment from "moment";
export default {
    name: "medal",
    components: {
        uc,
    },
    data: function () {
        return {
            tabList: themeTab,

            medals: [],

            // 用户拥有的勋章
            userMedals: [],
            // 未拥有
            noMedals: [],
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
        dateFormat(date) {
            return moment(date).format("YYYY-MM-DD");
        },
        load() {
            const params = {
                _no_page: 1,
                type: "user",
            };

            if (User.isLogin()) {
                getUserMedals(this.uid, {
                    is_wear: -1,
                }).then(async (res) => {
                    this.userMedals = res.data.data;
                    const models = await getMedals(params);
                    this.noMedals = models.data.data?.filter((item) => {
                        return !this.userMedals.find((userItem) => userItem.medal == item.name);
                    });
                });
            }
        },
        imgSrc(name) {
            return __cdn + "design/medals/user/" + name + ".gif";
        },
        hasMedal(name) {
            return this.userMedals?.findIndex((item) => item.medal == name) > -1;
        },
        onIsWearChange(item) {
            if (item.is_wear) {
                // 取消佩戴
                setMedal(this.uid, item.id, 0)
                    .then(() => {
                        item.is_wear = 0;
                        this.$message.success("操作成功");
                    })
                    .catch(() => {
                        item.is_wear = 1; // 如果取消失败，保持原状态
                    });
            } else {
                // 佩戴
                setMedal(this.uid, item.id, 1)
                    .then(() => {
                        item.is_wear = 1;
                        this.$message.success("操作成功");
                    })
                    .catch(() => {
                        item.is_wear = 0; // 如果佩戴失败，保持原状态
                    });
            }
        },
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
        margin: 0 auto;
        padding: 20px;
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
        .flex;
        flex-direction: column;
        align-items: center;
        &.is-have {
            filter: none;
        }

        .u-model-name {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
            display: inline-block;
            width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
        }

        .u-medal-time {
            font-size: 12px;
            color: #999;
            margin: 10px 0;
        }
    }
}
</style>
