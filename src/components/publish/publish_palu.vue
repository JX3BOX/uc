<template>
    <publish-palu-picker
        v-model="selectedSlug"
        :cards="cards"
        :current-value="currentSlug"
        :loading="loading || saving"
        :load-failed="loadFailed"
        :disabled="disabled || saving"
        :hint="$t('publish.palu.settingsHint')"
        :consume-hint="$t('publish.palu.consumeOnSave')"
        :remove-hint="$t('publish.palu.removeOnSave')"
        test-id="publish-palu"
        @retry="load"
    ></publish-palu-picker>
</template>

<script>
import { __cdn } from "@/utils/config";
import { getOwnedDecorations, getPostDecoration, setPostDecoration } from "@/service/publish/cms";
import publish_palu_picker from "@/components/publish/publish_palu_picker.vue";

export default {
    name: "PublishPalu",
    components: {
        "publish-palu-picker": publish_palu_picker,
    },
    props: {
        postId: {
            type: [String, Number],
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loading: false,
            saving: false,
            loadFailed: false,
            initialized: false,
            inventory: [],
            currentDecoration: null,
            selectedSlug: "",
            loadSequence: 0,
        };
    },
    computed: {
        normalizedPostId() {
            return Number(this.postId) || 0;
        },
        currentSlug() {
            return this.normalizeSlug(this.currentDecoration?.decoration_slug);
        },
        cards() {
            const cards = new Map();

            this.inventory.forEach((item) => {
                const slug = this.normalizeSlug(item?.val);
                if (!slug) return;

                const current = cards.get(slug) || {
                    value: slug,
                    amount: 0,
                    url: `${__cdn}design/decoration/palu/${slug}.png`,
                };
                current.amount += Math.max(Number(item.amount) || 0, 0);
                cards.set(slug, current);
            });

            if (this.currentSlug && !cards.has(this.currentSlug)) {
                cards.set(this.currentSlug, {
                    value: this.currentSlug,
                    amount: 0,
                    url: `${__cdn}design/decoration/palu/${this.currentSlug}.png`,
                });
            }

            return Array.from(cards.values());
        },
        hasChanged() {
            return this.normalizeSlug(this.selectedSlug) !== this.currentSlug;
        },
    },
    watch: {
        normalizedPostId: {
            immediate: true,
            handler() {
                this.load();
            },
        },
    },
    methods: {
        normalizeSlug(slug) {
            return String(slug || "").trim();
        },
        async load() {
            const sequence = ++this.loadSequence;
            this.loading = true;
            this.loadFailed = false;
            this.initialized = false;

            try {
                const requests = [getOwnedDecorations({ type: "palu" })];
                if (this.normalizedPostId) {
                    requests.push(getPostDecoration(this.normalizedPostId, "palu"));
                }

                const [inventoryResponse, decorationResponse] = await Promise.all(requests);
                if (sequence !== this.loadSequence) return;

                this.inventory = Array.isArray(inventoryResponse?.data?.data) ? inventoryResponse.data.data : [];
                this.currentDecoration = decorationResponse?.data?.data || null;
                this.selectedSlug = this.currentSlug;
                this.initialized = true;
            } catch (error) {
                if (sequence !== this.loadSequence) return;
                this.inventory = [];
                this.currentDecoration = null;
                this.selectedSlug = "";
                this.loadFailed = true;
            } finally {
                if (sequence === this.loadSequence) this.loading = false;
            }
        },
        consumeLocalInventory(slug) {
            const candidates = this.inventory
                .filter((item) => this.normalizeSlug(item?.val) === slug && Number(item.amount) > 0)
                .sort((left, right) => Number(left.id) - Number(right.id));
            if (!candidates.length) return;
            candidates[0].amount = Math.max(Number(candidates[0].amount) - 1, 0);
        },
        async save(postId) {
            const sourceId = Number(postId) || 0;
            if (!sourceId || !this.initialized || !this.hasChanged) {
                return { changed: false, consumed: false, decoration: this.currentDecoration };
            }

            const slug = this.normalizeSlug(this.selectedSlug);
            this.saving = true;
            try {
                const response = await setPostDecoration(sourceId, "palu", slug || null);
                const result = response?.data?.data || {};
                if (result.consumed) this.consumeLocalInventory(slug);
                this.currentDecoration = result.decoration || null;
                this.selectedSlug = this.currentSlug;
                return result;
            } finally {
                this.saving = false;
            }
        },
    },
};
</script>
