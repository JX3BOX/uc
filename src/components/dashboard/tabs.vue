<template>
    <el-tabs class="m-dashboard-tabs" v-model="active" @tab-click="changeTab">
        <el-tab-pane v-for="item in tabs" :key="item.name" :name="item.name">
            <span slot="label"
                ><i :class="item.icon" class="u-tab-icon"></i> {{ item.label }}
                <span v-if="showCount" class="u-count" :class="count[countMap[item.name]] ? 'is-orange' : ''"
                    >({{ count[countMap[item.name]] || 0 }})</span
                >
            </span>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { getLetterUnread, getMessageUnread } from "@/service/dashboard/msg";
export default {
    name: "",
    props: {
        tabs: {
            type: Array,
            default: () => [],
        },
        msgChangeCount: {
            type: Number,
            default: 0,
        },
    },
    data: function () {
        return {
            active: "",
            countMap: {
                msg: "message",
                letter: "letter",
            },
            count: {
                message: 0,
                letter: 0,
            },
        };
    },
    watch: {
        $route: function () {
            this.active = this.routeName;
        },
        msgChangeCount: {
            immediate: true,
            handler(num) {
                if (num > 0) {
                    // 全读
                    this.count.message = 0;
                }
                if (num < 0) {
                    // 单个已读
                    if (this.count.message > 0) {
                        this.count.message += num;
                    }
                }
            },
        },
    },
    computed: {
        showCount() {
            return ["msg", "letter"].includes(this.routeName);
        },
        routeName() {
            return this.$route.name;
        },
    },
    methods: {
        changeTab: function () {
            this.$router.push({ name: this.active });
        },
        loadCount() {
            getLetterUnread().then((res) => {
                const data = res.data?.data || {};
                this.count.letter = data.letter || 0;
            });

            getMessageUnread().then((res) => {
                this.count.message = res.data.data?.unread_count || 0;
            })
        },
    },
    mounted: function () {
        this.active = this.routeName;
        if (this.showCount) {
            this.loadCount();
        }
    },
    components: {},
};
</script>
