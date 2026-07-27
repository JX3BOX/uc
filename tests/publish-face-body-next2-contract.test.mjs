import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = path.resolve(import.meta.dirname, "..");

function read(relativePath) {
    return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

test("face and body create, update, and delete use the unified next2 prefix", () => {
    const faceService = read("src/service/publish/face.js");
    const bodyService = read("src/service/publish/body.js");

    assert.match(faceService, /post\("\/api\/next2\/face", data\)/);
    assert.match(faceService, /put\(`\/api\/next2\/face\/\$\{id\}`, data\)/);
    assert.match(faceService, /delete\(`\/api\/next2\/face\/\$\{id\}`\)/);
    assert.match(bodyService, /post\("\/api\/next2\/pvxbody", data\)/);
    assert.match(bodyService, /put\(`\/api\/next2\/pvxbody\/\$\{id\}`, data\)/);
    assert.match(bodyService, /delete\(`\/api\/next2\/pvxbody\/\$\{id\}`\)/);
});

test("face and body forms submit a public or private status", () => {
    for (const file of ["src/post/face.vue", "src/post/body.vue"]) {
        const source = read(file);

        assert.match(source, /v-model="post\.status"/);
        assert.match(source, /status:\s*1/);
        assert.match(source, /\.\.\.this\.post/);
    }
});

test("face and body buckets expose delete instead of online and offline actions", () => {
    for (const file of ["src/bucket/face.vue", "src/bucket/body.vue"]) {
        const source = read(file);

        assert.match(source, /icon="Delete"/);
        assert.doesNotMatch(source, /handleOnline|handleOffline/);
    }
});
