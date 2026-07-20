import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("wiki comments link to the matching wiki type", () => {
    const source = read("src/views/publish/wiki_comment.vue");

    assert.match(source, /:href="commentLink\(comment\)"/);
    assert.match(source, /return getLink\(comment\?\.type, comment\?\.source_id\)/);
    assert.doesNotMatch(source, /'cj\/view\/' \+ comment\.source_id/);
});

test("wiki management guards routes and stale asynchronous work", () => {
    const router = read("src/pages/publish/router.js");
    const list = read("src/views/publish/wiki.vue");
    const knowledge = read("src/post/knowledge.vue");

    assert.match(router, /\/wiki\/:type\(achievement\|item\|quest\|knowledge\|skill\)/);
    assert.doesNotMatch(list, /achievement_comment/);
    assert.match(list, /const requestId = \+\+this\.requestId/);
    assert.match(list, /if \(requestId !== this\.requestId\) return/);
    assert.match(list, /\.finally\(done\)/);
    assert.match(knowledge, /this\.id[\s\S]*wiki\.update\(this\.id/);
    assert.match(knowledge, /: wiki\.post\(\{ type: "knowledge"/);
});

test("publish gear selector skips empty IDs and forwards remote search", () => {
    const source = read("src/components/publish/publish_pz.vue");

    assert.match(source, /this\.list\.map\(\(item\) => item\.id\)\.filter\(Boolean\)/);
    assert.match(source, /if \(!ids\.length\) \{[\s\S]*this\.selectedOptions = \[\][\s\S]*return;/);
    assert.match(source, /getMyPzList\(\{ ids: ids\.join\(","\) \}\)/);
    assert.match(source, /this\.loadOptions\(\{ \.\.\.this\.params, search: keywords \|\| undefined \}\)/);
});

test("publish form controls use Element Plus 3 value semantics", () => {
    const files = [
        "src/components/publish/publish_tags.vue",
        "src/components/publish/publish_topic_bucket.vue",
        "src/post/collection.vue",
        "src/post/body.vue",
        "src/post/pvp.vue",
        "src/views/publish/draft.vue",
    ];

    for (const file of files) {
        const source = read(file);
        assert.doesNotMatch(
            source,
            /<el-(?:checkbox|radio)\b[^>]*(?::label|\slabel)=/,
            `${file} still uses the deprecated label-as-value API`
        );
    }
});

test("live publish-list searches share a 300ms debounce", () => {
    const mixin = read("src/mixins/publishListSearch.js");
    const liveSearchRoutes = [
        "src/views/publish/cms.vue",
        "src/views/publish/cms_community.vue",
        "src/views/publish/bucket.vue",
        "src/views/publish/cms_comment.vue",
        "src/views/publish/community_comment.vue",
        "src/bucket/body.vue",
        "src/bucket/collection.vue",
        "src/bucket/emotion.vue",
        "src/bucket/joke.vue",
    ];

    assert.match(mixin, /debounce\(\(value\) => \{/);
    assert.match(mixin, /}, 300\)/);
    assert.match(mixin, /this\.page = 1/);
    assert.match(mixin, /this\.updateRequestSearch\?\.cancel\(\)/);

    for (const file of liveSearchRoutes) {
        const source = read(file);
        assert.match(source, /import publishListSearch from "@\/mixins\/publishListSearch"/);
        assert.match(source, /mixins: \[publishListSearch\]/);
        assert.match(source, /this\.requestSearch/);
    }

    for (const file of ["src/bucket/calendar.vue", "src/bucket/face.vue"]) {
        assert.match(read(file), /v-model\.lazy="search"/, `${file} must keep its change-only search behavior`);
    }
});

test("publish API lists expose a shared failure state and retry action", () => {
    const entry = read("src/pages/publish/index.js");
    const errorComponent = read("src/components/publish/PublishListError.vue");
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
        "src/bucket/body.vue",
        "src/bucket/calendar.vue",
        "src/bucket/collection.vue",
        "src/bucket/emotion.vue",
        "src/bucket/face.vue",
        "src/bucket/joke.vue",
        "src/bucket/namespace.vue",
    ];

    assert.match(entry, /import PublishListError from "@\/components\/publish\/PublishListError\.vue"/);
    assert.match(entry, /app\.component\("PublishListError", PublishListError\)/);
    assert.match(errorComponent, /role="alert"/);
    assert.match(errorComponent, /aria-live="polite"/);
    assert.match(errorComponent, /@click="\$emit\('retry'\)"/);

    for (const file of listRoutes) {
        const source = read(file);
        assert.match(source, /<PublishListError\b[^>]*@retry=/, `${file} has no retry action`);
        assert.match(source, /loadError:\s*false/, `${file} has no explicit failure state`);
        assert.match(source, /\.catch\(\(\) => \{/, `${file} does not handle request failures`);
        assert.match(source, /!loading && !loadError/, `${file} leaves pagination visible after a failure`);
    }
});
