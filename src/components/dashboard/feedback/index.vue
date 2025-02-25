<!--
 * @Author: iRuxu
 * @Date: 2022-07-03 01:06:06
 * @LastEditTime: 2022-07-04 02:18:31
 * @Description:
-->
<template>
    <div class="m-feedback-index">
        <section class="m-feedback-box">
            <el-tabs v-model="active">
                <el-tab-pane label="提交反馈" name="submit" lazy>
                    <add></add>
                </el-tab-pane>
                <el-tab-pane label="我的反馈" name="myfeedback" lazy>
                    <list v-if="active === 'myfeedback'"></list>
                </el-tab-pane>
                <el-tab-pane v-if="isTeammate" label="待处理" name="pending" lazy>
                    <pending v-if="active === 'pending'"></pending>
                </el-tab-pane>
                <el-tab-pane v-if="isTeammate" label="处理中" name="doing" lazy>
                    <pending v-if="active === 'doing'" :status="2"></pending>
                </el-tab-pane>
            </el-tabs>
        </section>
        <aside class="m-feedback-aside">
            <el-button class="u-btn" size="small" type="warning" plain @click="handleEraseClick">注销账号</el-button>
            <div class="m-feedback-faq">
                <div class="u-title"><i class="el-icon-question"></i> FAQ</div>
                <div class="u-list" v-for="item in faq" :key="item.link">
                    <a class="u-item" :href="item.link">{{ item.label }}</a>
                </div>
            </div>
        </aside>
    </div>
</template>

<script>
import add from "./add.vue";
import list from "./list.vue";
import pending from "./pending.vue";
import { getMenu } from "@jx3box/jx3box-common/js/api_misc";
export default {
    name: "FeedbackIndex",
    components: {
        add,
        list,
        pending,
    },
    data() {
        return {
            active: "submit",
            faq: {},
            onlyMe: true,
        };
    },
    computed: {
        isTeammate() {
            return this.$store.state.isTeammate;
        },
    },
    watch: {
        "$route.query": {
            deep: true,
            immediate: true,
            handler(val) {
                this.active = val.tab || "submit";
            },
        },
        active(val) {
            this.$router.push({
                path: this.$route.path,
                query: {
                    tab: val,
                },
            });
        },
    },
    mounted() {
        this.getFAQ();
    },
    methods: {
        handleEraseClick() {
            this.$router.push({ name: "feedback_erase" });
        },
        getFAQ() {
            getMenu("feedback_faq").then((res) => {
                this.faq = res;
            });
        },
    },
};
</script>

<style lang="less" scoped>
.m-feedback-index {
    display: flex;
    gap: 20px;

    .m-feedback-box {
        flex: 1;
        overflow: hidden;
        position: relative;

        .u-only-check {
            position: absolute;
            top: 8px;
            right: 8px;
        }
    }
}
.m-feedback-aside {
    width: 240px;

    .u-btn {
        width: 100%;
    }
}
@media screen and (max-width: @phone) {
    .m-feedback-aside {
        display: none;
    }
}
.m-feedback-faq {
    margin-top: 20px;
    border-radius: 4px;
    .u-title {
        .fz(14px,2);
        font-weight: bold;
        border-bottom: 1px solid #e6e6e6;
    }

    .u-list {
        padding: 10px 0;
    }
    .u-item {
        .db;
        padding: 0 5px;
        border-bottom: 1px dotted #ddd;
        .fz(13px,2);
        &:before {
            content: "»";
            color: #999;
            .mr(5px);
        }
        &:hover {
            color: #fba524;
        }
    }
}
</style>
