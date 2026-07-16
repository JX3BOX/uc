import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const revision = read("src/components/publish/publish_revision.vue");
const autoSaveMixin = read("src/utils/autoSaveMixin.js");
const revisionUtils = read("src/utils/publishRevision.js");
const { applyRevisionPost } = await import(`data:text/javascript,${encodeURIComponent(revisionUtils)}`);

assert.match(
    revision,
    /watch:\s*{[\s\S]*index\(\)\s*{[\s\S]*this\.load\(\)/,
    "revision pagination should reload when the bound index changes"
);

assert.match(
    revision,
    /this\.\$router\.push\(\{[\s\S]*path:\s*this\.\$route\.path[\s\S]*mode:\s*"revision"[\s\S]*version_id:\s*item\.id[\s\S]*content_meta_id:\s*item\.link_content_meta_id/,
    "using a revision should keep the current publish route and pass the revision query contract"
);

assert.doesNotMatch(
    revision,
    /this\.postId|const routeName = this\.\$route\.name/,
    "revision navigation should not depend on undeclared postId or an optional route name"
);

assert.match(
    revisionUtils,
    /function parseRevisionContent\(content\)[\s\S]*JSON\.parse\(value\)/,
    "revision loading should support serialized full-post snapshots"
);

assert.match(
    revisionUtils,
    /export function applyRevisionPost\(currentPost = {}, revision = {}\)[\s\S]*ID:\s*currentPost\.ID[\s\S]*link_content_meta_id:\s*currentPost\.link_content_meta_id/,
    "applying a full snapshot should preserve the current post identity"
);

assert.match(
    autoSaveMixin,
    /this\.post = applyRevisionPost\(currentPost, versionRes\.data\?\.data \|\| {}\)/,
    "revision mode should apply the normalized snapshot instead of replacing only post_content"
);

const currentPost = {
    ID: 56934,
    link_content_meta_id: 7001,
    post_title: "当前标题",
    post_content: "当前正文",
    tags: ["战场"],
    post_meta: { content: "当前简介" },
};

assert.deepEqual(
    applyRevisionPost(currentPost, { content: "<p>历史正文</p>" }),
    {
        ...currentPost,
        post_content: "<p>历史正文</p>",
        prev_post: "",
        next_post: "",
    },
    "plain-content revisions should continue to replace only the body"
);

const fullSnapshot = applyRevisionPost(currentPost, {
    content: JSON.stringify({
        ID: 1,
        link_content_meta_id: 2,
        post_title: "历史标题",
        post_content: "历史正文",
        tags: ["竞技场"],
        post_meta: { content: "历史简介" },
    }),
});

assert.equal(fullSnapshot.ID, currentPost.ID, "a revision must not change the current post ID");
assert.equal(
    fullSnapshot.link_content_meta_id,
    currentPost.link_content_meta_id,
    "a revision must not change the current content meta ID"
);
assert.equal(fullSnapshot.post_title, "历史标题");
assert.equal(fullSnapshot.post_content, "历史正文");
assert.deepEqual(fullSnapshot.tags, ["竞技场"]);
assert.deepEqual(fullSnapshot.post_meta, { content: "历史简介" });
