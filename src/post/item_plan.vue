<template>
	<div class="m-publish-box">
		<!-- 返回 -->
		<publish-header name="物品清单" :localDraft="false">
			<slot name="header"></slot>
		</publish-header>
		<!-- 表单 -->
		<el-form class="u-form" label-position="left" label-width="80px">
			<!-- 清单名称 -->
			<el-form-item label="标题">
				<el-input v-model="data.title" placeholder="请输入物品清单的标题" maxlength="20" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="可见性">
				<el-radio v-model="data.public" :label="1">公开</el-radio>
				<el-radio v-model="data.public" :label="0">私有</el-radio>
			</el-form-item>
			<!-- 清单描述 -->
			<el-form-item label="描述">
				<el-input type="textarea" :rows="3" v-model="data.description" placeholder="简单说明一下你的物品清单" :maxlength="2000" show-word-limit></el-input>
			</el-form-item>
			<!-- 清单类型 -->
			<el-form-item label="类型">
				<el-radio-group v-model="data.type" size="medium" @change="resetPages">
					<el-radio-button label="1">道具清单</el-radio-button>
					<el-radio-button label="2">装备清单</el-radio-button>
				</el-radio-group>
				<el-button class="u-add-plan" size="medium" icon="el-icon-plus" @click="addRelation">新增分组</el-button>
			</el-form-item>
			<!-- 制作清单 -->
			<el-form-item label="清单">
				<div class="m-plan-list">
					<!-- 搜索物品 -->
					<div class="u-list-search" v-if="searchList.length">
						<el-input class="u-title" placeholder="请输入物品名称（可适配中括号）" prefix-icon="el-icon-search" v-model.lazy.trim="keyword"></el-input>
						<draggable v-model="searchList" draggable=".u-change" :move="moveHandle" :group="{ name: 'draggable-item', pull: 'clone', put: false }">
							<jx3-item-simple class="u-change" v-for="(item, index) in searchList" :key="index" :item="item" />
						</draggable>

						<el-pagination small class="m-archive-pages" background layout="prev, pager, next, jumper" :hide-on-single-page="true" :page-size="per" :total="total" :current-page.sync="page" size="mini"></el-pagination>
					</div>
					<!-- 物品子清单 -->
					<el-row v-if="data.type == '1'" class="u-list-box" :gutter="20">
						<el-col v-for="(relation, index) in data.relation" :key="index" :span="6">
							<div class="u-list">
								<i class="u-list-close el-icon-circle-close" @click="data.relation.splice(index, 1)"></i>
								<el-input class="u-title" type="text" placeholder="子清单标题（选填）" v-model="relation.title" maxlength="20" show-word-limit></el-input>
								<draggable class="u-item-drag" :list="relation.data" group="draggable-item" ghost-class="ghost">
									<template v-if="relation.data && relation.data.length">
										<div v-for="(item, key) in relation.data" :key="key" class="u-selected u-selected-item u-selected-count">
											<itemIcon class="u-icon" :item_id="item.id" />
											<div class="u-count">
												<span>数量：</span>
												<el-input-number size="mini" v-model.number="item.count" :min="1" label="数字"></el-input-number>
											</div>
											<i class="u-close el-icon-circle-close" @click="relation.data.splice(key, 1)"></i>
										</div>
									</template>
									<div class="u-normal" v-else>拖拽所需道具到此处</div>
								</draggable>
							</div>
						</el-col>
					</el-row>
					<!-- 装备子清单 -->
					<el-row v-else class="u-list-box u-list-equip" :gutter="20">
						<el-col v-for="(equip, index) in equipList" :key="index" :span="6">
							<div v-for="(eq, key) in equip" :key="key" class="u-list">
								<div class="u-title">{{ eq.label }}</div>
								<draggable :list="eq.list" :move="moveHandle" :data-AucGenre="eq.AucGenre" :data-AucSubType="eq.AucSubType" group="draggable-item" ghost-class="ghost">
									<template v-if="eq.list && eq.list.length">
										<div v-for="(item, key) in eq.list" :key="key" class="u-selected u-selected-item u-selected-equip">
											<itemIcon class="u-icon" v-if="typeof item == 'string'" :item_id="item" />
											<itemIcon class="u-icon" v-if="typeof item == 'object'" :item="item" />
											<i class="u-close el-icon-circle-close" @click="eq.list.splice(key, 1)"></i>
										</div>
									</template>
									<div class="u-normal" v-else>拖拽所需道具到此处</div>
								</draggable>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-form-item>
			<!-- 提交表单 -->
			<el-form-item>
				<el-button class="u-publish" icon="el-icon-s-promotion" type="primary" @click="submit" :loading="loading">提交物品清单</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import header from "@/components/publish/publish_header.vue";
import ItemSimple from "@jx3box/jx3box-editor/src/ItemSimple";
import itemIcon from "@/components/publish/publish_icon.vue";
import draggable from "vuedraggable";
import { searchItems } from "@/service/publish/item";
import { getPlanByID, postMyPlans, addMyPlans } from "@/service/publish/item_plan";
import { iconLink } from "@jx3box/jx3box-common/js/utils";
const default_plan = {
	id: "",
	title: "",
	public: 1,
	type: "1",
	description: "",
	relation: [],
};
const default_equip = [
	[
		{ title: "melee_weapon", label: "武器", AucGenre: 1, list: [] },
		{ title: "range_weapon", label: "暗器", AucGenre: 2, list: [] },
	],
	[
		{ title: "helm", label: "帽子", AucGenre: 3, AucSubType: 2, list: [] },
		{ title: "chest", label: "上衣", AucGenre: 3, AucSubType: 1, list: [] },
		{ title: "waist", label: "腰带", AucGenre: 3, AucSubType: 3, list: [] },
	],
	[
		{ title: "bangle", label: "护腕", AucGenre: 3, AucSubType: 6, list: [] },
		{ title: "pants", label: "下装", AucGenre: 3, AucSubType: 4, list: [] },
		{ title: "boots", label: "鞋子", AucGenre: 3, AucSubType: 5, list: [] },
	],
	[
		{ title: "amulet", label: "项链", AucGenre: 4, AucSubType: 1, list: [] },
		{ title: "pendant", label: "腰坠", AucGenre: 4, AucSubType: 3, list: [] },
		{ title: "ring_1", label: "戒指", AucGenre: 4, AucSubType: 2, list: [] },
		{ title: "ring_2", label: "戒指", AucGenre: 4, AucSubType: 2, list: [] },
	],
];
export default {
	name: "plan",
	components: {
		draggable,
		"publish-header": header,
		"jx3-item-simple": ItemSimple,
		itemIcon,
	},
	data: function () {
		return {
			// 清单
			data: Object.assign({}, default_plan),

			relationList: [],
			equipList: [...default_equip],

			// 物品
			loading: false,
			keyword: "",
			per: 15,
			page: 1,
			total: 1,
			searchList: [],

			item_id: "",
		};
	},
	computed: {
		plan_id() {
			return this.$route.params.plan_id;
		},
		// 搜索参数
		search_params() {
			let params = {
				page: this.page,
				limit: this.per,
				is_equip: this.data.type == 2 ? 1 : 0,
				fields: ["id", "UiID", "Name", "IconID", "Quality", "AucGenre", "AucSubType", "Desc"],
				apply: 1,
			};
			if (this.keyword) params.keyword = this.keyword;
			return params;
		},
	},
	watch: {
		// 搜索物品重置
		keyword() {
			this.resetPages();
		},
		// 重新搜索
		search_params: {
			immediate: true,
			deep: true,
			handler: function () {
				this.loadItems();
			},
		},
	},

	methods: {
		// 物品
		// ===================================
		// 物品搜索
		loadItems() {
			searchItems(this.search_params).then((res) => {
				res.data.map((item) => (item.count = 1));
				this.searchList = res.data;
				this.total = res.total;
			});
		},
		// 重置分页
		resetPages() {
			this.page = 1;
		},
		// 物品id转图片链接
		iconLink,

		// 清单
		// ===================================
		// 新增清单
		addRelation() {
			this.data.relation.unshift({
				title: "",
				data: [],
			});
		},
		// 装备清单的移动
		moveHandle(e) {
			if (e.to.classList.contains("u-item-drag")) return;
			let AucGenre = e.to.getAttribute("data-AucGenre");
			let AucSubType = e.to.getAttribute("data-AucSubType");
			let result = e.draggedContext.element.AucGenre == AucGenre;
			if (AucSubType !== null) result = result && e.draggedContext.element.AucSubType == AucSubType;
			return result;
		},

		// 数据处理
		// ===================================
		// 获取plan_id的数据
		getPlanData() {
			getPlanByID(this.plan_id).then((res) => {
				res = this.extractID(res);
				console.log(res);
				this.data = res;
				if (this.data.type == 2) this.toEquipList(this.data.relation);
			});
		},
		//处理旧数据
		extractID(data) {
			if (data.type == 1) {
				data.relation = data.relation.map((item) => {
					item.data = item.data.map((el) => {
						if (typeof el == "string") el = { id: el, count: 1 };
						if (typeof el == "object") el = { id: el.id, count: el.count };
						return el;
					});
					return item;
				});
			} else {
				data.relation = this.equipItem(data.relation);
			}
			return data;
		},
		// 将装备object转换为string
		equipItem(data) {
			for (const key in data) {
				data[key] = data[key].map((item) => {
					if (typeof item == "object") item = item.id;
					return item;
				});
			}
			return data;
		},
		// 装备分组
		toEquipList(_obj) {
			this.equipList.map((list) => {
				list.map((el) => {
					if (_obj.hasOwnProperty(el.title)) {
						el.list = _obj[el.title];
					}
				});
			});
		},
		// 装备提交数据转换
		toEquip() {
			let obj = {};
			this.equipList.forEach((list) => {
				list.forEach((el) => {
					obj[el.title] = el.list;
				});
			});
			obj = this.equipItem(obj);
			this.data.relation = obj;
		},

		// --提交清单-------
		submit() {
			if (this.data.type == 2) this.toEquip();

			this.loading = true;
			this.plan_id
				? postMyPlans(this.plan_id, this.data)
						.then(() => {
							this.$message({ message: "物品清单修改成功", type: "success" });
							this.$router.push({ name: "bucket", params: { type: "item_plan" } });
						})
						.finally(() => {
							this.loading = false;
						})
				: addMyPlans(this.data)
						.then(() => {
							this.$message({ message: "物品清单提交成功", type: "success" });
							this.$router.push({ name: "bucket", params: { type: "item_plan" } });
						})
						.finally(() => {
							this.loading = false;
						});
		},
	},
	created: function () {
		if (this.plan_id) this.getPlanData();
	},
};
</script>
<style scoped lang="less">
@import "~@/assets/css/publish/item_plan.less";
.el-col {
	min-width: 260px;
}
</style>
