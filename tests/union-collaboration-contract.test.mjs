import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const unionView = fs.readFileSync(new URL("../src/views/publish/union.vue", import.meta.url), "utf8");
const callbackView = fs.readFileSync(
    new URL("../src/views/dashboard/callback/invitation_creators.vue", import.meta.url),
    "utf8"
);
const unionService = fs.readFileSync(new URL("../src/service/publish/union.js", import.meta.url), "utf8");

test("联合创作列表保护跨路由分页和异步请求", () => {
    assert.match(unionView, /"\$route\.name": function/);
    assert.match(unionView, /requestSerial !== this\.requestSerial/);
    assert.match(unionView, /:key="item\.post_id"/);
});

test("联合创作列表按权限展示编辑操作并明确整篇删除", () => {
    assert.match(unionView, /v-if="isActive \|\| item\.r_edit"/);
    assert.match(unionView, /publish\.confirm\.deleteWork/);
    assert.match(unionView, /publish\.common\.deleteWork/);
});

test("原作者管理接口与公开作者接口分离", () => {
    assert.match(unionService, /authors\/manage/);
});

test("受邀创作页直接读取并处理待接受邀请", () => {
    assert.match(unionView, /v-model="pendingDialogVisible"/);
    assert.match(unionView, /class="u-pending-entry"/);
    assert.match(unionView, /status: "pending"/);
    assert.match(unionView, /acceptUnionInvitation/);
    assert.match(unionView, /rejectInvitation/);
    assert.match(unionView, /pendingInvitations/);
});

test("邀请创作页展示已加入和待接受成员", () => {
    assert.match(unionView, /acceptedAuthors\(item\)/);
    assert.match(unionView, /pendingAuthors\(item\)/);
    assert.match(unionView, /item\.union_authors/);
});

test("邀请回调等待操作完成后再跳转", () => {
    assert.match(callbackView, /await quitUnionPost\(this\.id\)/);
    assert.ok(callbackView.indexOf("await quitUnionPost(this.id)") < callbackView.indexOf('this.$router.push("/msg")'));
    assert.match(callbackView, /actionLoading/);
});
