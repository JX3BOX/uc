<template>
    <uc class="m-dashboard-palu m-dashboard-skin" icon="el-icon-brush" :title="$t('dashboard.theme.title')" :tab-list="tabList">
        <template #header>
            <a class="u-link el-button el-button--default el-button--small is-round is-plain" :href="mallUrl" target="_blank">
                <i class="el-icon-shopping-cart-2"></i> {{ $t("dashboard.palu.redeem") }}
            </a>
        </template>

        <section class="m-palu">
            <ContentSkeleton v-if="loading" variant="cards" :rows="8" :columns="4" />
            <template v-else>
            <header class="m-palu-summary">
                <span class="u-summary-icon"><i class="el-icon-magic-stick"></i></span>
                <div class="u-summary-content">
                    <h3>{{ $t("dashboard.palu.title") }}</h3>
                    <i18n-t keypath="dashboard.palu.summary" tag="p">
                        <template #owned>{{ ownedKinds }}</template>
                        <template #total>{{ cards.length }}</template>
                        <template #count><b>{{ totalAmount }}</b></template>
                    </i18n-t>
                </div>
                <el-input
                    v-model="keyword"
                    class="u-search"
                    :placeholder="$t('dashboard.palu.searchPlaceholder')"
                    clearable
                >
                    <template #prefix><i class="el-icon-search"></i></template>
                </el-input>
            </header>

            <div v-if="filteredCards.length" class="m-palu-list">
                <article v-for="item in filteredCards" :key="item.val" class="m-palu-card" :class="{ 'is-owned': item.amount > 0 }">
                    <el-image class="u-image" :src="item.image" fit="cover" lazy>
                        <template #error><div class="u-image-error"><i class="el-icon-picture-outline"></i></div></template>
                    </el-image>
                    <div class="u-info">
                        <h4 :title="item.title">{{ item.title }}</h4>
                        <span v-if="item.amount > 0" class="u-owned"><i class="el-icon-circle-check"></i> {{ $t("dashboard.palu.quantity", { count: item.amount }) }}</span>
                        <span v-else class="u-unowned">{{ $t("dashboard.palu.unowned") }}</span>
                    </div>
                    <a v-if="!item.amount" class="u-redeem el-button el-button--primary el-button--small" :href="item.mallUrl" target="_blank">
                        <i class="el-icon-shopping-cart-full"></i> {{ $t("dashboard.palu.redeem") }}
                    </a>
                </article>
            </div>
            <el-empty v-else :description="$t('dashboard.palu.empty')" />
            </template>
        </section>
    </uc>
</template>

<script>
import uc from "@/components/dashboard/uc.vue";
import tabsData from "@/assets/data/dashboard/tabs.json";
import { getDecoration } from "@/service/dashboard/decoration";
import { getItemList } from "@/service/vip/mall";
import { __cdn } from "@/utils/config";

const { themeTab } = tabsData;
const MALL_URL = "/vip/mall/list?category=virtual&sub_category=palu";

export default {
    name: "palu",
    components: { uc },
    data() {
        return { tabList: themeTab, mallUrl: MALL_URL, cards: [], keyword: "", loading: true };
    },
    computed: {
        filteredCards() {
            const keyword = this.keyword.trim().toLowerCase();
            if (!keyword) return this.cards;
            return this.cards.filter((item) => `${item.title} ${item.val}`.toLowerCase().includes(keyword));
        },
        ownedKinds() {
            return this.cards.filter((item) => item.amount > 0).length;
        },
        totalAmount() {
            return this.cards.reduce((total, item) => total + item.amount, 0);
        },
    },
    methods: {
        buildCards(goodsList, decorations) {
            const ownedMap = new Map();
            decorations.forEach((item) => {
                const val = String(item?.val || "").trim();
                if (!val) return;
                const current = ownedMap.get(val) || { amount: 0 };
                current.amount += Math.max(0, Number(item.amount) || 0);
                ownedMap.set(val, current);
            });

            const cards = goodsList
                .filter((item) => item?.remark)
                .map((item) => {
                    const val = String(item.remark);
                    const title = item.title || val;
                    const owned = ownedMap.get(val);
                    ownedMap.delete(val);
                    return {
                        val,
                        title,
                        amount: owned?.amount || 0,
                        image: `${__cdn}design/decoration/palu/${val}.png`,
                        mallUrl: `/vip/mall/${item.id}?category=virtual&sub_category=palu&search=${encodeURIComponent(title)}`,
                    };
                });

            ownedMap.forEach(({ amount }, val) => {
                cards.push({ val, title: val, amount, image: `${__cdn}design/decoration/palu/${val}.png`, mallUrl: MALL_URL });
            });
            return cards.sort((a, b) => Number(b.amount > 0) - Number(a.amount > 0));
        },
        async load() {
            this.loading = true;
            try {
                const [goodsResult, decorationResult] = await Promise.allSettled([
                    getItemList({ category: "virtual", sub_category: "palu", _no_page: 1 }),
                    getDecoration({ type: "palu" }),
                ]);
                if (goodsResult.status === "rejected") throw goodsResult.reason;
                const goods = goodsResult.value.data?.data?.list || [];
                const decorations = decorationResult.status === "fulfilled" ? decorationResult.value.data?.data || [] : [];
                this.cards = this.buildCards(goods, decorations);
            } catch (err) {
                this.cards = [];
                this.$message.error(err?.response?.data?.msg || this.$t("dashboard.palu.loadFailed"));
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.load();
    },
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/palu.less";
</style>
