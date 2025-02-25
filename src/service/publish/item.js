import { $node } from "@jx3box/jx3box-common/js/https.js";

// 物品搜索
function search_items(keyword, length, fields, is_equip = null) {
	let params = { keyword: keyword, limit: length, fields: fields };
	if (is_equip !== null) params.is_equip = is_equip ? 1 : 0;

	return $node().get(`/item/search`, {
        params
    })
}

// 物品搜索
function searchItems(params) {
	return $node()
		.get(`/item/search`, { params })
		.then((res) => {
			return res.data.data;
		});
}

// 获取物品
function get_item(item_id) {
	if (!item_id) return;
	return $node().get(`/item/id/${item_id}`);
}
export { search_items, get_item, searchItems };
