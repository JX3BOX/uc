<template>
    <div class="m-dashboard m-dashboard-config">
        <h2 class="u-title"><i class="el-icon-setting"></i> 全局设置</h2>
        <el-form class="m-config-form" label-position="left" label-width="120px">
            <el-form-item label="编辑器模式">
                <el-radio-group v-model="conf.editor_mode" size="small">
                    <el-radio-button label="tinymce">可视化</el-radio-button>
                    <el-radio-button label="markdown">Markdown</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="评论默认排序">
                <el-radio-group v-model="conf.cmt_order" size="small">
                    <el-radio-button label="DESC">最新靠前</el-radio-button>
                    <el-radio-button label="ASC">最早靠前</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="接受赠礼">
                <el-switch v-model="conf.allow_cny" active-color="#13ce66" active-text="开启" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item> -->
            <el-form-item label="接受商城赠礼">
                <template #label>
                    <span>接受商城赠礼</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="当开启时，会接受其他用户为您在商城购买的虚拟礼物"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-switch v-model="conf.allow_gift_of_mall_virtual_goods" active-color="#13ce66" active-text="开启" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="订阅通知">
                <template #label>
                    <span>订阅通知</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="当开启时，订阅的作品或关注的用户有新作品发布或旧作品更新时，会收到短消息通知"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-switch v-model="conf.feed_message" active-color="#13ce66" active-text="开启" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="日历链接">
                <template #label>
                    <span>日历链接</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="网站首页日历模块点击的快捷跳转地址"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-input v-model="conf.fav_link" placeholder="输入日历链接"></el-input>
            </el-form-item>
            <el-form-item label="客户端偏好">
                <template #label>
                    <span>客户端偏好</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="在小程序端默认的游戏客户端"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-select v-model="conf.default_client">
                    <el-option label="正式服（旗舰版/无界）" value="std"></el-option>
                    <el-option label="怀旧服（缘起）" value="origin"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关注限制">
                <template #label>
                    <span>关注限制</span>
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="当用户关注自己成为粉丝时，要求的等级限制"
                        placement="top"
                        ><i class="el-icon-info"></i
                    ></el-tooltip>
                </template>
                <el-select v-model="conf.rss_need_level">
                    <el-option v-for="item in levelMap" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
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
                <el-button class="u-publish" type="primary" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getUserConf, setUserConf } from "@/service/dashboard/conf";
export default {
    name: "config",
    props: [],
    data: function () {
        return {
            conf: {
                cmt_email: 0,
                cmt_order: "DESC",
                editor_mode: "tinymce",
                allow_cny: 1,
                allow_gift_of_mall_virtual_goods: 1,
                feed_message: 1,
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
                rss_need_level: 1
            },

            levelMap: new Array(8).fill(0).map((_, i) => {
                return {
                    label: `等级${i + 1}`,
                    value: i + 1,
                };
            }),
        };
    },
    computed: {},
    methods: {
        loadData: function () {
            getUserConf().then((res) => {
                this.conf = res?.data?.data;
            });
        },
        submit: function () {
            setUserConf(this.conf).then((res) => {
                this.$message({
                    message: "设置更新成功",
                    type: "success",
                });
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
