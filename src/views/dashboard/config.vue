<template>
    <div class="m-dashboard m-dashboard-config">
        <h2 class="u-title"><i class="el-icon-setting"></i> {{ $t("dashboard.config.title") }}</h2>
        <ContentSkeleton v-if="loading" variant="form" :rows="8" />
        <el-form v-else class="m-config-form" label-position="left" label-width="160px">
            <el-form-item :label="$t('dashboard.config.theme')">
                <template #label>
                    <span>{{ $t("dashboard.config.theme") }}</span>
                    <el-tooltip class="item" effect="dark" :content="$t('dashboard.config.appOnly')" placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-radio-group v-model="conf.theme" size="small">
                    <el-radio-button value="light">{{ $t("dashboard.config.light") }}</el-radio-button>
                    <el-radio-button value="dark">{{ $t("dashboard.config.dark") }}</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('dashboard.config.editorMode')">
                <el-radio-group v-model="conf.editor_mode" size="small">
                    <el-radio-button value="tinymce">{{ $t("dashboard.config.visual") }}</el-radio-button>
                    <el-radio-button value="markdown">Markdown</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('dashboard.config.commentOrder')">
                <el-radio-group v-model="conf.cmt_order" size="small">
                    <el-radio-button value="DESC">{{ $t("dashboard.config.newestFirst") }}</el-radio-button>
                    <el-radio-button value="ASC">{{ $t("dashboard.config.oldestFirst") }}</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="接受赠礼">
                <el-switch v-model="conf.allow_cny" active-color="#13ce66" active-text="开启" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item> -->
            <el-form-item :label="$t('dashboard.config.acceptGifts')">
                <template #label>
                    <span>{{ $t("dashboard.config.acceptGifts") }}</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('dashboard.config.acceptGiftsTip')"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-switch
                    v-model="conf.allow_gift_of_mall_virtual_goods"
                    active-color="#13ce66"
                    :active-text="$t('dashboard.common.enabled')"
                    :active-value="1"
                    :inactive-value="0"
                ></el-switch>
            </el-form-item>
            <el-form-item :label="$t('dashboard.config.subscriptionNotifications')">
                <template #label>
                    <span>{{ $t("dashboard.config.subscriptionNotifications") }}</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('dashboard.config.subscriptionTip')"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-switch
                    v-model="conf.feed_message"
                    active-color="#13ce66"
                    :active-text="$t('dashboard.common.enabled')"
                    :active-value="1"
                    :inactive-value="0"
                ></el-switch>
            </el-form-item>
            <el-form-item :label="$t('dashboard.config.loverFeature')">
                <template #label>
                    <span>{{ $t("dashboard.config.loverFeature") }}</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('dashboard.config.loverTip')"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-switch
                    v-model="conf.accept_lover_request"
                    active-color="#13ce66"
                    :active-text="$t('dashboard.common.enabled')"
                    :active-value="1"
                    :inactive-value="0"
                ></el-switch>
            </el-form-item>
            <el-form-item :label="$t('dashboard.config.followLimit')">
                <template #label>
                    <span>{{ $t("dashboard.config.followLimit") }}</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="$t('dashboard.config.followLimitTip')"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-select v-model="conf.rss_need_level" size="large">
                    <el-option
                        v-for="item in levelMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('dashboard.config.language')">
                <template #label>
                    <span>{{ $t("dashboard.config.language") }}</span>
                    <el-tooltip class="item" effect="dark" :content="$t('dashboard.config.languageTip')" placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-select v-model="conf.default_lang" size="large">
                    <el-option
                        v-for="(item, key) in lang"
                        :key="key"
                        :label="item.name"
                        :value="item.locale"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('dashboard.config.client')">
                <template #label>
                    <span>{{ $t("dashboard.config.client") }}</span>
                    <el-tooltip class="item" effect="dark" :content="$t('dashboard.config.clientTip')" placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-select v-model="conf.default_client" size="large">
                    <el-option :label="$t('dashboard.config.standardClient')" value="std"></el-option>
                    <el-option :label="$t('dashboard.config.originClient')" value="origin"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('dashboard.config.calendarLink')">
                <template #label>
                    <span>{{ $t("dashboard.config.calendarLink") }}</span>
                    <el-tooltip class="item" effect="dark" :content="$t('dashboard.config.calendarLinkTip')" placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-input v-model="conf.fav_link" size="large" :placeholder="$t('dashboard.config.calendarLinkPlaceholder')"></el-input>
            </el-form-item>
            

            <!-- <el-form-item label="评论邮件通知">
                <el-switch v-model="conf.cmt_email" active-color="#13ce66" active-text="开启" :active-value="1" :inactive-value="0" disabled></el-switch>
            </el-form-item> -->

            <!-- <el-form-item label="快捷键">
                <el-switch v-model="conf.hotkey" active-color="#13ce66" active-text="同步" :active-value="1" :inactive-value="0" disabled></el-switch>
            </el-form-item>
            <el-form-item label="游戏设置">
                <el-switch v-model="conf.game_setting" active-color="#13ce66" active-text="同步" :active-value="1" :inactive-value="0" disabled></el-switch>
            </el-form-item>
            <el-form-item label="自定义界面">
                <el-switch v-model="conf.custom_ui" active-color="#13ce66" active-text="同步" :active-value="1" :inactive-value="0" disabled></el-switch>
            </el-form-item>
            <el-form-item label="插件设置">
                <el-switch v-model="conf.plugin_setting" active-color="#13ce66" active-text="同步" :active-value="1" :inactive-value="0" disabled></el-switch>
            </el-form-item>
            <el-form-item label="成就进度">
                <el-switch v-model="conf.achievement_process" active-color="#13ce66" active-text="同步" :active-value="1" :inactive-value="0" disabled></el-switch>
            </el-form-item> -->
            <el-form-item label="" class="u-btns">
                <el-button class="u-publish" type="primary" @click="submit" size="large">{{ $t("dashboard.common.save") }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getUserConf, setUserConf } from "@/service/dashboard/conf";
import lang from "@/assets/data/dashboard/lang.json";

export default {
    name: "config",
    props: [],
    data: function () {
        return {
            loading: true,
            conf: {
                theme: "light",
                cmt_email: 0,
                cmt_order: "DESC",
                editor_mode: "tinymce",
                allow_cny: 1,
                allow_gift_of_mall_virtual_goods: 1,
                feed_message: 1,
                accept_lover_request: 1,
                // hotkey: false,
                // game_setting: false,
                // custom_ui: false,
                // plugin_setting: false,
                // achievement_process: false,
                // plugin_setting_my: false,
                // plugin_setting_lr: false,
                // plugin_setting_jx: false,
                // plugin_setting_fy: false,
                fav_link: "",
                default_client: "",
                rss_need_level: 1,
                default_lang: "zh-cn",
            },

            levelMap: new Array(8).fill(0).map((_, i) => {
                return {
                    label: this.$t("dashboard.config.level", { level: i + 1 }),
                    value: i + 1,
                };
            }),

            lang,

            oldLang: "",
        };
    },
    computed: {},
    methods: {
        loadData: function () {
            this.loading = true;
            return getUserConf()
                .then((res) => {
                    this.conf = {
                        ...(res?.data?.data || {}),
                        theme: res?.data?.data?.theme || "light",
                    };

                    this.oldLang = this.conf.default_lang;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        submit: function () {
            setUserConf(this.conf).then((res) => {
                this.$message({
                    message: this.$t("dashboard.config.updateSuccess"),
                    type: "success",
                });

                // 如果修改了语言设置，提示用户刷新页面以应用新的语言
                if (this.oldLang !== this.conf.default_lang) {
                    location.reload();
                }
            });
        },
    },
    mounted: function () {
        this.loadData();
    },
    components: {},
};
</script>

<style lang="less">
@import "~@/assets/css/dashboard/config.less";
</style>
