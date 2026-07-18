import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const skeleton = read("src/components/ContentSkeleton.vue");

test("content skeleton exposes the shared variants and accessible animation fallback", () => {
    for (const variant of ["dashboard", "list", "table", "cards", "form"]) {
        assert.match(skeleton, new RegExp(`\\b${variant}\\b`), `missing ${variant} skeleton variant`);
    }

    assert.match(skeleton, /role="status"/);
    assert.match(skeleton, /aria-live="polite"/);
    assert.match(skeleton, /@keyframes content-skeleton-shimmer/);
    assert.match(skeleton, /@media \(prefers-reduced-motion: reduce\)/);
});

test("dashboard, publish, and author applications register the shared skeleton", () => {
    for (const entry of ["src/pages/dashboard/index.js", "src/pages/publish/index.js", "src/pages/author/index.js"]) {
        const source = read(entry);
        assert.match(source, /import ContentSkeleton from "@\/components\/ContentSkeleton\.vue"/);
        assert.match(source, /app\.component\("ContentSkeleton", ContentSkeleton\)/);
    }
});

test("author profile uses page, sidebar, and content-list skeletons", () => {
    const page = read("src/views/author/Index.vue");
    const sidebar = read("src/components/author/newComponents/Primary.vue");
    const listComponents = [
        "src/components/author/Post.vue",
        "src/components/author/Wiki.vue",
        "src/components/author/Collection.vue",
        "src/components/author/Namespace.vue",
        "src/components/author/Jokes.vue",
        "src/components/author/Emotions.vue",
        "src/components/author/Question.vue",
        "src/components/author/Paper.vue",
        "src/components/author/Topic.vue",
        "src/components/author/Reply.vue",
        "src/components/author/Pz.vue",
        "src/components/author/DBM.vue",
        "src/components/author/Battle.vue",
        "src/components/author/item_plan.vue",
        "src/components/author/newComponents/Body.vue",
        "src/components/author/newComponents/Face.vue",
    ];

    assert.match(page, /<ContentSkeleton variant="dashboard"/);
    assert.match(page, /pageLoading:\s*true/);
    assert.match(sidebar, /<ContentSkeleton\b[^>]*v-show="loading"/);

    for (const file of listComponents) {
        const source = read(file);
        assert.match(source, /<ContentSkeleton\b[^>]*v-if="loading"/, `${file} is missing its loading skeleton`);
        assert.doesNotMatch(source, /v-loading="loading"/, `${file} still uses the loading mask`);
    }
});

test("dashboard home uses dedicated page and activity skeletons", () => {
    const source = read("src/views/dashboard/index.vue");

    assert.match(source, /<ContentSkeleton v-if="pageLoading" variant="dashboard"/);
    assert.match(source, /<ContentSkeleton v-if="assetLogsLoading" variant="list"/);
    assert.match(source, /pageLoading:\s*true/);
    assert.match(source, /assetLogsLoading:\s*true/);
});

test("dashboard async routes and nested lists use the shared content skeleton", () => {
    const dashboardRoutes = [
        "src/views/dashboard/fav.vue",
        "src/components/dashboard/fav/rss_list.vue",
        "src/components/dashboard/fav/visit_log.vue",
        "src/components/dashboard/fav/wait_list.vue",
        "src/views/dashboard/purchases.vue",
        "src/views/dashboard/frame.vue",
        "src/views/dashboard/theme.vue",
        "src/views/dashboard/emotion.vue",
        "src/views/dashboard/palu.vue",
        "src/views/dashboard/honor.vue",
        "src/views/dashboard/medal.vue",
        "src/views/dashboard/certification.vue",
        "src/views/dashboard/holidayCard.vue",
        "src/views/dashboard/birthdayCard.vue",
        "src/views/dashboard/mall.vue",
        "src/views/dashboard/orders.vue",
        "src/views/dashboard/packet.vue",
        "src/views/dashboard/boxcoin.vue",
        "src/views/dashboard/cny.vue",
        "src/views/dashboard/points.vue",
        "src/views/dashboard/tasks.vue",
        "src/views/dashboard/card.vue",
        "src/views/dashboard/ic.vue",
        "src/views/dashboard/role/BindRole2.vue",
        "src/views/dashboard/role/SyncData.vue",
        "src/views/dashboard/role/ListRole.vue",
        "src/views/dashboard/role/EditRole.vue",
        "src/views/dashboard/role/ViewRole.vue",
        "src/views/dashboard/profile.vue",
        "src/views/dashboard/avatar.vue",
        "src/views/dashboard/pwd.vue",
        "src/views/dashboard/notice/index.vue",
        "src/views/dashboard/notice/email.vue",
        "src/views/dashboard/notice/phone.vue",
        "src/views/dashboard/notice/wechat.vue",
        "src/views/dashboard/connect.vue",
        "src/views/dashboard/config.vue",
        "src/views/dashboard/cooperation.vue",
        "src/views/dashboard/privacy.vue",
        "src/views/dashboard/address.vue",
        "src/views/dashboard/auth.vue",
        "src/views/dashboard/order_detail.vue",
        "src/views/dashboard/msg.vue",
        "src/components/dashboard/msg/CommentDetail.vue",
        "src/components/dashboard/letter/contacts.vue",
        "src/components/dashboard/letter/list.vue",
        "src/components/dashboard/feedback/list.vue",
        "src/components/dashboard/feedback/pending.vue",
        "src/components/dashboard/feedback/erase.vue",
        "src/components/dashboard/feedback/single.vue",
    ];

    for (const file of dashboardRoutes) {
        assert.match(read(file), /<ContentSkeleton\b/, `${file} is missing its loading skeleton`);
    }
});

test("primary publish list routes use content skeletons instead of loading masks", () => {
    const listRoutes = [
        "src/views/publish/cms.vue",
        "src/views/publish/cms_community.vue",
        "src/views/publish/wiki.vue",
        "src/views/publish/bucket.vue",
        "src/views/publish/union.vue",
        "src/views/publish/feedback.vue",
        "src/views/publish/cms_comment.vue",
        "src/views/publish/community_comment.vue",
        "src/views/publish/wiki_comment.vue",
    ];

    for (const file of listRoutes) {
        const source = read(file);
        assert.match(source, /<ContentSkeleton\b[^>]*v-if="loading"/, `${file} is missing its loading skeleton`);
        assert.doesNotMatch(source, /v-loading="loading"/, `${file} still uses the blocking loading mask`);
        assert.match(source, /loading:\s*true/, `${file} does not show a skeleton on its first render`);
    }
});

test("publish draft and navigation counts expose explicit loading skeletons", () => {
    const draft = read("src/views/publish/draft.vue");
    const nav = read("src/components/publish/Nav.vue");

    assert.match(draft, /<ContentSkeleton\b[^>]*v-if="loading"/);
    assert.match(nav, /u-count-skeleton/);
    assert.match(nav, /countLoading/);
});

test("bucket-backed creation lists use shared list or card skeletons", () => {
    const bucketRoutes = [
        "src/bucket/body.vue",
        "src/bucket/calendar.vue",
        "src/bucket/collection.vue",
        "src/bucket/emotion.vue",
        "src/bucket/face.vue",
        "src/bucket/joke.vue",
        "src/bucket/namespace.vue",
    ];

    for (const file of bucketRoutes) {
        const source = read(file);
        assert.match(source, /<ContentSkeleton\b[^>]*v-if="loading"/, `${file} is missing its loading skeleton`);
        assert.doesNotMatch(source, /v-loading="loading"/, `${file} still uses the blocking loading mask`);
        assert.match(source, /loading:\s*true/, `${file} does not show a skeleton on its first render`);
    }
});
