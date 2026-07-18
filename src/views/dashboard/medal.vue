<template>
    <uc class="m-dashboard-medal m-dashboard-skin" icon="el-icon-brush" :title="$t('dashboard.theme.title')" :tab-list="tabList">
        <template #header>
            <a
                class="u-link el-button el-button--default el-button--small is-round is-plain"
                href="/vip/mall?category=virtual"
                target="_blank"
                ><i class="el-icon-shopping-cart-2"></i> {{ $t("dashboard.theme.getDecorations") }}</a
            >
        </template>
        <div class="m-medal-content">
            <el-divider content-position="left">{{ $t("dashboard.common.obtained") }}</el-divider>
            <div class="u-list" v-if="userMedals.length">
                <div class="u-item is-have" v-for="item in userMedals" :key="item.id" :title="item.medal_desc">
                    <img class="u-img" :src="imgSrc(item.medal)" :alt="item.medal" />
                    <span class="u-model-name">{{ item.medal_desc }}</span>
                    <time :datetime="item.created_at" class="u-medal-time">{{ dateFormat(item.created_at) }}</time>
                    <el-button
                        @click="onIsWearChange(item)"
                        :type="item.is_wear ? 'info' : 'primary'"
                        :plain="!!item.is_wear"
                        size="small"
                        :loading="updatingMedalId === item.id"
                        :disabled="updatingMedalId !== null"
                    >
                        <!-- <i :class="item.is_wear ? 'el-icon-help' : 'el-icon-s-help'"></i> -->
                        {{ item.is_wear ? $t("dashboard.medal.takeOff") : $t("dashboard.medal.wear") }}
                    </el-button>
                </div>
            </div>
            <el-empty v-else-if="!loading" :description="$t('dashboard.common.empty')" :image-size="80" />
            <el-divider content-position="left">{{ $t("dashboard.common.notObtained") }}</el-divider>
            <div class="u-list" v-if="noMedals.length">
                <div class="u-item" v-for="item in noMedals" :key="item.id" :title="item.desc">
                    <img class="u-img" :src="imgSrc(item.name)" :alt="item.name" />
                    <span class="u-model-name">{{ item.desc }}</span>
                </div>
            </div>
            <el-empty v-else-if="!loading" :description="$t('dashboard.common.empty')" :image-size="80" />
        </div>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import tabsData from "@/assets/data/dashboard/tabs.json";
const { themeTab } = tabsData;
import User from "@jx3box/jx3box-common/js/user";
import { getUserMedals, getMedals, setMedal } from "@/service/dashboard/decoration";
import { __cdn } from "@/utils/config";
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
            loading: false,
            updatingMedalId: null,
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
        async load() {
            const params = {
                _no_page: 1,
                type: "user",
            };

            this.loading = true;
            try {
                const [userResult, medalResult] = await Promise.all([
                    User.isLogin()
                        ? getUserMedals()
                        : Promise.resolve({ data: { data: [] } }),
                    getMedals(params),
                ]);
                this.userMedals = Array.isArray(userResult?.data?.data) ? userResult.data.data : [];
                const medals = Array.isArray(medalResult?.data?.data) ? medalResult.data.data : [];
                const ownedMedals = new Set(this.userMedals.map((item) => item.medal));
                this.noMedals = medals.filter((item) => !ownedMedals.has(item.name));
            } catch (e) {
                this.userMedals = [];
                this.noMedals = [];
                this.$message.error(this.$t("dashboard.common.requestFailed"));
            } finally {
                this.loading = false;
            }
        },
        imgSrc(name) {
            return __cdn + "design/medals/user/" + name + ".webp";
        },
        hasMedal(name) {
            return this.userMedals?.findIndex((item) => item.medal == name) > -1;
        },
        async onIsWearChange(item) {
            if (this.updatingMedalId !== null) return;

            const nextWearState = item.is_wear ? 0 : 1;
            this.updatingMedalId = item.id;
            try {
                await setMedal(item.id, nextWearState);
                item.is_wear = nextWearState;
                this.$message.success(this.$t("dashboard.common.operationSuccess"));
            } catch (e) {
                this.$message.error(this.$t("dashboard.common.operationFailedRetry"));
            } finally {
                this.updatingMedalId = null;
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
