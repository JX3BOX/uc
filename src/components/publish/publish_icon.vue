<template>
	<el-popover v-if="source" placement="right-start" width="auto" :trigger="click_trigger ? 'click' : 'hover'" :disabled="dishoverable" popper-class="m-item-icon-popup" :visible-arrow="false" transition="none" :close-delay="0" @show="show">
		<template slot="reference">
			<div class="m-item-icon">
				<div class="u-item-icon">
					<div class="u-border" :style="{ backgroundImage: item_border(source), opacity: source.Quality == 5 ? 0.9 : 1 }"></div>
					<div class="u-border-quest" :style="{ backgroundImage: item_border_quest(source) }"></div>
					<img class="u-item-icon" :src="icon_url(source.IconID)" />
				</div>
				<div class="u-name" :class="`quality-${source.Quality}`">{{ source.Name }}</div>
			</div>
		</template>

		<jx3-item :item="source" />
	</el-popover>
</template>

<script>
import Item from "@jx3box/jx3box-editor/src/Item";
import { get_item } from "@/service/publish/item.js";
import { __imgPath } from "@jx3box/jx3box-common/data/jx3box.json";
import { iconLink } from "@jx3box/jx3box-common/js/utils";

export default {
	name: "ItemIcon",
	props: ["item", "item_id", "dishoverable", "click_trigger"],
	data() {
		return {
			source: null,
		};
	},
	computed: {
		client: function () {
			return this.$store.state.client;
		},
	},
	components: {
		"jx3-item": Item,
	},
	methods: {
		get_data(item_id) {
			if (item_id) {
				get_item(item_id).then((res) => {
					let data = res.data;
					let item = data.data.item;
					if (Object.keys(item).length) this.source = item;
				});
			}
		},
		show() {
			if (!this.source || typeof this.source.Genre === "undefined") {
				this.get_data(this.source.id);
			}
		},
		item_border(item) {
			switch (item.Quality) {
				case 3:
					return `url(${__imgPath}image/item/blue.png)`;
				case 4:
					return `url(${__imgPath}image/item/purple.png)`;
				case 5:
					return `url(${__imgPath}image/item/orange.gif)`;
				default:
					return "";
			}
		},
		item_border_quest(item) {
			if (item.IsQuest > 0) return `url(${__imgPath}image/item/renwu.png)`;
			return "";
		},
		icon_url: function (id) {
			// return iconLink(id, this.client);
			return iconLink(id); //收藏跨正式服/怀旧服
		},
	},
	watch: {
		item: {
			immediate: true,
			handler() {
				this.source = this.item;
			},
		},
		item_id: {
			immediate: true,
			handler() {
				this.get_data(this.item_id);
			},
		},
	},
};
</script>

<style lang="less">
.m-item-icon-popup {
	min-width: initial;
	padding: 0;
	border: none;
	box-shadow: none;
	background-color: transparent;
	transform: translateY(-10px);
}
</style>
<style lang="less" scoped>
.m-item-icon {
	.flex;
	align-items: center;
	.u-name {
		.ml(10px);
	}
	.quality-1 {
		color: #fff;
	}
	.quality-2 {
		color: #00d24b;
	}
	.quality-3 {
		color: #007eff;
	}
	.quality-4 {
		color: #ff2dff;
	}
	.quality-5 {
		color: #ffa500;
	}
}
.u-item-icon {
	.pr;
	.dbi;

	.u-border,
	.u-border-quest {
		.pa;
		top: 0;
		left: 0;
		.w(100%);
		.h(100%);
		box-sizing: border-box;
		background-size: contain;
		.z(2);
	}

	.u-border-quest {
		.z(3);
	}

	.u-item-icon {
		.pr;
		.db;
		.w(36px);
		.h(auto);
		max-height: 36px;
		.z(1);
	}
}
</style>
