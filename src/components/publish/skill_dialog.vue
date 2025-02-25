<template>
    <el-dialog
        class="c-large-dialog"
        :visible="modelValue"
        @close="close"
        title="技能库"
        append-to-body
        custom-class="m-skill-dialog"
    >
        <el-tabs v-model="activeName" type="card" class="m-skill-tabs">
            <el-tab-pane label="门派武学" name="special">
                <template #label>
                    <div class="u-tab-label">
                        <i class="el-icon-s-order"></i>
                        <b>门派武学</b>
                    </div>
                </template>
            </el-tab-pane>
            <el-tab-pane label="全部技能" name="all">
                <template #label>
                    <div class="u-tab-label">
                        <i class="el-icon-menu"></i>
                        <b>全部技能</b>
                    </div>
                </template>
            </el-tab-pane>
        </el-tabs>
        <div class="m-select-content">
            <div v-show="activeName === 'all'">
                <div class="m-database-search">
                    <el-radio-group class="u-client" v-model="client" @change="search">
                        <el-radio-button label="std">剑三</el-radio-button>
                        <el-radio-button label="origin">缘起</el-radio-button>
                    </el-radio-group>
                    <el-input
                        class="u-input"
                        placeholder="请输入 ID 或 名称"
                        v-model="query"
                        @keyup.enter.native="search"
                    >
                        <template slot="prepend">ID ／名称</template>
                    </el-input>
                </div>

                <div v-if="total && done" class="m-resource-count">
                    <i class="el-icon-s-data"></i> 共找到 <b>{{ total }}</b> 条记录
                </div>
                <ul class="m-resource-list">
                    <li v-for="(o, i) in skill" class="u-item" :key="i" @click="selectSkill(o, i)" ref="skill">
                        <span class="u-id">ID:{{ o.SkillID }}</span>
                        <img class="u-pic" :title="'IconID:' + o.IconID" :src="iconURL(o.IconID)" />
                        <span class="u-primary">
                            <span class="u-name">
                                {{ o.Name }}
                                <em v-if="o.SkillName">({{ o.SkillName }})</em>
                            </span>
                            <span class="u-content">
                                {{ filterRaw(o.Desc) }}
                            </span>
                        </span>
                    </li>
                </ul>
                <el-alert v-if="!skill.length && done" title="没有找到相关条目" type="info" show-icon></el-alert>

                <template v-if="multipage">
                    <!-- 下一页 -->
                    <el-button
                        class="m-archive-more"
                        :class="{ show: hasNextPage }"
                        type="primary"
                        icon="el-icon-arrow-down"
                        @click="appendPage"
                        >加载更多</el-button
                    >
                    <!-- 分页 -->
                    <el-pagination
                        class="m-archive-pages"
                        background
                        layout="total, prev, pager, next,jumper"
                        :hide-on-single-page="true"
                        :page-size="per"
                        :total="total"
                        :current-page.sync="page"
                        @current-change="changePage"
                    ></el-pagination>
                </template>

                <div class="m-database-tip" v-show="isBlank">❤ 请输入搜索条件查询</div>
            </div>
            <pvp-martial
                v-show="activeName === 'special'"
                :platform="platform"
                :subtype="subtype"
                @selectSkill="selectSkill"
            ></pvp-martial>
        </div>

        <!-- 已选技能 -->
        <el-divider>已选技能</el-divider>
        <div class="m-selected-skills">
            <ul class="m-skills-list">
                <li v-for="(skill, index) in selected" :key="index" class="m-skill">
                    <div class="u-skill" v-if="skill && skill.IconID">
                        <img class="u-skill-icon" :src="iconURL(skill.IconID)" :alt="skill.IconID" />
                        <span class="u-name" :title="skill.Name">{{ skill.Name }}</span>
                    </div>
                    <div class="u-mask" @click="removeSelected(index)">
                        <i class="el-icon-delete"></i>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 插入按钮 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="submit">
                {{ buttonTXT }}
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
import { iconLink } from "@jx3box/jx3box-common/js/utils";
import { getSkill } from "@/service/publish/node";
import pvp_martialVue from "./pvp_martial.vue";
export default {
    name: "skillDialog",
    components: {
        "pvp-martial": pvp_martialVue,
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        subtype: {
            type: String,
            default: "通用",
        },
        platform: {
            type: String,
            default: "std",
        },
    },
    model: {
        prop: "modelValue",
        event: "update:modelValue",
    },
    data() {
        return {
            client: location.href.includes("origin") ? "origin" : "std",
            skill: [],
            done: false,
            per: 10,
            page: 1,
            total: 1,
            pages: 1,
            query: "",

            activeName: "special",
            selected: [],
        };
    },
    computed: {
        hasNextPage: function () {
            return this.total > 1 && this.page < this.pages;
        },
        multipage: function () {
            return this.done && this.pages > 1;
        },
        isBlank: function () {
            return !this.query && !this.skill["length"];
        },
        buttonTXT: function () {
            return "确 定";
        },
    },
    methods: {
        getData(page = 1, append = false) {
            if (!this.query) return;

            this.loading = true;
            this.per = 10;
            this.done = false;
            let query = this.query;
            let params = {
                strict: ~~this.strict,
                per: this.per,
                page: page,
                client: this.client,
            };

            getSkill(query, params)
                .then((data) => {
                    if (!append) this.skill = [];
                    const list = this.transformData(data.list || []);
                    this.pages = data.pages;
                    this.total = data.total;
                    this.skill = this.skill.concat(list);
                })
                .finally(() => {
                    this.done = true;
                    this.loading = false;
                });
        },
        selectSkill: function (o) {
            this.selected.push(o);
        },
        removeSelected: function (index) {
            this.selected.splice(index, 1);
        },
        submit() {
            this.$emit("submit", this.selected);
            this.close();
            this.selected = [];
        },
        close() {
            this.$emit("update:modelValue", false);
        },
        iconURL: function (id) {
            return iconLink(id, this.client);
        },
        filterRaw: function (str) {
            return str && str.replace(/\\n/g, "\n");
        },
        search: function () {
            this.page = 1;
            this.getData();
        },
        appendPage: function () {
            this.getData(++this.page, true);
        },
        changePage: function (i) {
            this.getData(i);
        },
        transformData: function (data) {
            data.forEach((item) => {
                item.isSelected = false;
            });
            return data;
        },
    },
};
</script>
