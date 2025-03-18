<template>
	<div class="m-dashboard-work m-dashboard-bucket" v-loading="loading">
		<!-- 标题 -->
		<div class="m-dashboard-work-header">
			<h2 class="u-title">{{ title }}</h2>
			<a :href="publishLink" class="u-publish el-button el-button--primary el-button--small" v-if="type == 'item_plan'"> <i class="el-icon-document"></i> 发布作品 </a>
		</div>

		<!-- 搜索框 -->
		<el-input class="m-dashboard-work-search" placeholder="请输入搜索内容" v-model="search">
			<span slot="prepend">关键词</span>
			<el-button slot="append" icon="el-icon-search"></el-button>
		</el-input>

		<!-- 列表 -->
		<div class="m-dashboard-box">

			<template v-if="data && data.length">
				<component class="m-dashboard-box-list" :data="data" v-bind:is="currentComponent" @refresh="loadPosts()"></component>
			</template>

			<el-alert v-else-if="!loading" class="m-dashboard-box-null" title="没有找到相关条目" type="info" center show-icon></el-alert>

			<el-pagination class="m-dashboard-box-pages" background :page-size="per" :hide-on-single-page="true" :current-page.sync="page" layout="total, prev, pager, next, jumper" :total="total" @onPageKey="onPageKey"></el-pagination>
		</div>
	</div>
</template>

<script>
import { getQuestions, getPapers } from "@/service/publish/exam";
import { getMyPlans } from "@/service/publish/item_plan";
import question from "@/bucket/question.vue";
import paper from "@/bucket/paper.vue";
import item_plan from "@/bucket/item_plan.vue";

export default {
	name: "bucket",
	props: [],
	components: {
		question,
		item_plan,
		paper,
	},
	data: function () {
		return {
			loading: false,
			data: "",
			total: 1,
			page: 1,
			per: 10,
			search: "",

			types: {
				item_plan: "我的清单",
				question: "我的题目",
				paper: "我的试卷",
			},
		};
	},
	computed: {
		type: function () {
			return this.$route.params.type;
		},
		title() {
			return this.types[this.type];
		},
		publishLink: function () {
			return "/publish/#/" + this.type;
		},
		currentComponent() {
			return this.type;
		},
		params() {
			let params = { page: this.page, limit: this.per };
			this.type == "item_plan" ? (params.search = this.search) : (params.title = this.search);
			return params;
		},
	},
	watch: {
		type() {
			this.data = "";
			this.page = 1;
			this.search = "";
		},
		params: {
			deep: true,
			handler: function () {
				this.loadPosts();
			},
		},
	},
	methods: {
		// 判断获取数据
		loadPosts: function () {
			this.loading = true;
			this.type == "item_plan" ? this.getMyPlan() : this.type == "paper" ? this.getMyPaper() : this.getMyQuestion();
		},
		// 获取我的清单
		getMyPlan() {
			getMyPlans(this.params)
				.then((res) => {
					this.data = res.list;
					this.total = res.total;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 获取我的题目
		getMyPaper() {
			getPapers(this.params)
				.then((res) => {
					this.data = res.data.data;
					this.total = res.data.page.total;
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 获取我的试卷
		getMyQuestion() {
			getQuestions(this.params)
				.then((res) => {
					this.data = res.data.data;
					this.total = res.data.page.total;
				})
				.finally(() => {
					this.loading = false;
				});
		},

		// 切换页码
		onPageKey(val) {
			this.page = val;
		},
	},
	mounted: function () {
		this.loadPosts();
	},
};
</script>

<style lang="less">
@import "~@/assets/css/publish/work.less";
</style>
