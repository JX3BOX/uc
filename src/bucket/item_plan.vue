<template>
	<ul>
		<li v-for="(plan, key) in data" :key="key" class="m-plan">
			<i class="u-icon">
				<img v-if="plan.public" svg-inline src="@/assets/img/publish/works/repo.svg" />
				<img v-else svg-inline src="@/assets/img/publish/works/draft.svg" />
			</i>
			<a class="u-title" target="_blank" :href="`/item/#/plan_view/${plan.id}`">{{ plan.title || "无标题" }}</a>
			<div class="u-desc">
				<time class="u-desc-subitem">
					<i class="el-icon-finished"></i>
					发布 :
					{{ dateFormat(plan.created) }}
				</time>
				<time class="u-desc-subitem">
					<i class="el-icon-refresh"></i>
					更新 :
					{{ dateFormat(plan.updated) }}
				</time>
			</div>
			<el-button-group class="u-action">
				<el-button size="mini" icon="el-icon-edit" title="编辑" @click="plan_edit(plan.id)"></el-button>
				<el-button size="mini" icon="el-icon-delete" title="删除" @click="plan_delete(plan.id)"></el-button>
			</el-button-group>
		</li>
	</ul>
</template>

<script>
import { delMyPlans } from "@/service/publish/item_plan";
import dateFormat from "@/utils/dateFormat";
export default {
	name: "item_plan",
	props: ["data"],
	methods: {
		plan_edit: function (id) {
			location.href = "/publish/#/item_plan/" + id;
		},
		plan_delete: function (id) {
			this.$confirm("确认是否删除该物品清单？", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			}).then(() => {
				delMyPlans(id).then((res) => {
					this.$emit("refresh");
					this.$message({
						message: "删除成功",
						type: "success",
					});
				});
			});
		},
		dateFormat(val) {
			return dateFormat(new Date(val * 1000));
		},
	},
};
</script>

<style scoped lang="less">
@import "~@/assets/css/publish/work.less";
// .m-dashboard-box-list {
//     .u-action {
//         top: 50%;
//         bottom: auto;
//         transform: translateY(-50%);
//     }
// }
// .m-plan {
//     padding: 10px 15px;
//     font-size: 13px;
//     .u-updated {
//         .mt(5px);
//         // opacity: 0.4;
//         font-size: 12px;
//         color: #999;
//     }
//     .u-title,
//     .u-type,
//     .u-name {
//         .dbi;
//         vertical-align: middle;
//     }
//     .u-type {
//         padding: 4px;
//         color: white;
//         border-radius: 2px;
//         .fz(12px);
//     }
//     .u-name {
//         .ml(8px);
//     }
//     .u-description {
//         .db;
//         .mt(5px);
//         color: #3d454d;
//         font-size: 12px;
//         opacity: 0.7;
//     }
// }
</style>
