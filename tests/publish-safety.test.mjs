import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { createRequire } from "node:module";
import { createRenderer, h, reactive, nextTick } from "vue";
import lodash from "lodash";

const require = createRequire(import.meta.url);
const { parse } = require("@babel/parser");
const root = new URL("../", import.meta.url);
const noop = () => {};
const empty = (v) => !v || (typeof v === "object" && !Object.keys(v).length);
const user = { getInfo: () => ({ uid: 42 }) };
// Execute production Options API methods/watchers, replacing only external dependencies.
function load(file, dependencies = {}) {
    let source = fs.readFileSync(new URL(file, root), "utf8");
    if (source.includes("<script>")) source = source.split("<script>")[1].split("</script>")[0];
    const ast = parse(source, { sourceType: "module" });
    const context = { console, setInterval, clearInterval, sessionStorage: { removeItem: noop, setItem: noop } };
    for (const node of ast.program.body) {
        if (node.type === "ImportDeclaration") {
            for (const spec of node.specifiers) context[spec.local.name] = {};
        }
    }
    Object.assign(context, { lodash, cloneDeep: lodash.cloneDeep, User: user, isEmptyMeta: empty }, dependencies);
    source = source.replace(/^import[\s\S]*?;\s*$/gm, "")
        .replace("export default", "globalThis.result =")
        .replace(/export const (\w+) =/, "globalThis.result =");
    vm.runInNewContext(source, context, { filename: file });
    return context.result;
}
const renderer = createRenderer({
    createElement: () => ({ children: [] }), createText: () => ({}), createComment: () => ({}),
    insert: (child, parent) => parent.children.push(child), remove: noop, patchProp: noop,
    setText: noop, setElementText: noop, parentNode: noop, nextSibling: noop,
});
function mount(options, props) {
    let instance;
    const component = { ...options, render: () => h("div") };
    const app = renderer.createApp({ render: () => h(component, { ...props(), ref: (v) => instance = v }) });
    app.config.globalProperties.$t = (key) => key;
    app.config.globalProperties.$message = Object.assign(noop, { warning: noop });
    app.mount({ children: [] });
    return { get instance() { return instance; }, unmount: () => app.unmount() };
}
function contextFor(options, extra = {}) {
    const ctx = { ...options.data?.(), $route: { params: {}, query: {} }, $t: (k) => k, ...extra };
    for (const [key, fn] of Object.entries(options.methods || {})) ctx[key] = fn.bind(ctx);
    for (const [key, fn] of Object.entries(options.computed || {})) {
        if (typeof fn === "function" && !(key in extra)) Object.defineProperty(ctx, key, { get: () => fn.call(ctx), configurable: true });
    }
    return ctx;
}

test("new macro sync preserves server ID and the submitted effective visibility", async () => {
    let synced;
    const page = load("src/post/macro.vue", {
        push: async () => ({ data: { data: { ID: 123, visible: 0 } } }),
        syncRedis: async (data) => { synced = data; },
    });
    const ctx = contextFor(page, { id: 0 });
    Object.assign(ctx, { checkMacro: () => true, build: noop, atUser: noop, setHasRead: noop,
        setCommentConfig: noop, afterPublish: async () => {}, done: noop });
    await ctx.publish("publish", true);
    assert.equal(synced.ID, 123);
    assert.equal(synced.visible, 1);
});

test("macro edit sync falls back to the existing ID when update returns no ID", async () => {
    let synced;
    const page = load("src/post/macro.vue", {
        push: async () => ({ data: { data: {} } }), syncRedis: async (data) => { synced = data; },
    });
    const ctx = contextFor(page, { id: 54 });
    Object.assign(ctx, { checkMacro: () => true, build: noop, atUser: noop, setHasRead: noop,
        setCommentConfig: noop, afterPublish: async () => {}, done: noop });
    await ctx.publish("publish", true);
    assert.equal(synced.ID, 54);
});

for (const type of ["bps", "pvp"]) {
    test(`${type} preserves loaded clients for articles, drafts and revisions`, async () => {
        const page = load(`src/post/${type}.vue`);
        for (const mode of ["", "draft", "revision"]) {
            const ctx = { post: {}, $store: { state: { client: "std" } },
                $route: { params: { id: 8 }, query: { mode } },
                loadData: async function () { this.post = { ID: 8, client: "origin" }; }, autoSave: noop };
            await page.methods.init.call(ctx);
            assert.equal(ctx.post.client, "origin");
        }
    });
}

for (const type of ["macro", "bps", "pvp", "fb", "tool"]) {
    test(`${type} collection failure retains ID, retries update, and preserves success ordering`, async () => {
        let fail = true;
        const requests = [], events = [];
        const page = load(`src/post/${type}.vue`, {
            push: async (...args) => { requests.push(args); return { data: { data: { ID: 99, post_collection: 7 } } }; },
            appendToCollection: async () => { events.push("collection"); if (fail) throw Error("offline"); },
            syncRedis: async () => {}, setPostMeta: noop,
        });
        const mixin = load("src/utils/cmsMetaMixin.js");
        const ctx = contextFor(page, { canManagePostCollection: true, isChangelog: false, $message: { warning: noop } });
        Object.assign(ctx, Object.fromEntries(Object.entries(mixin.methods).map(([k, fn]) => [k, fn.bind(ctx)])));
        Object.assign(ctx, { checkMacro: () => true, build: noop, atUser: noop, setHasRead: noop,
            setCommentConfig: noop, syncPalu: async () => { events.push(`palu:${ctx.id}`); }, done: () => events.push("done") });
        ctx.post.post_collection = 7;
        ctx.post.tags = ["战场"];
        ctx.post.post_meta.content = "摘要";
        await assert.rejects(() => ctx.publish("draft", false));
        assert.equal(ctx.id, 99);
        assert.equal(ctx.post.post_author, 42);
        assert.equal(events.includes("done"), false);
        if (type === "tool") assert.equal(events[0], "palu:0", "ID must not reset the card before its first save");
        fail = false;
        await ctx.publish("draft", false);
        assert.equal(requests[0].length, 1);
        assert.equal(requests[1][0], 99);
        assert.equal(events.at(-1), "done");
        for (const allowed of [false, true]) {
            ctx.canManagePostCollection = allowed;
            const count = events.length;
            await ctx.afterPublish({ ID: 99, post_collection: allowed ? "" : 7 });
            assert.equal(events.length, count, "readonly and unbound posts must not append");
        }
    });
}

test("resource uploads stay attached to the same item and latest request", async () => {
    const pending = [];
    const options = load("src/components/publish/publish_tool_source.vue", {
        FormData: class { append() {} }, upload: () => new Promise((resolve) => pending.push(resolve)),
    });
    const view = mount(options, () => ({}));
    const ctx = view.instance;
    try {
        const a = { name: "A", file: "" }, b = { name: "B", file: "" };
        ctx.data = { data: [a, b] };
        const event = { target: { files: [{ name: "file.zip" }] } };
        const first = ctx.uploadSource(event, 0);
        ctx.data.data.splice(0, 1);
        pending.shift()({ data: { data: ["a.zip"] } }); await first;
        await Promise.resolve(); assert.equal(b.file, "");
        const old = ctx.uploadSource(event, 0), recent = ctx.uploadSource(event, 0);
        pending[1]({ data: { data: ["new.zip"] } }); await recent; await Promise.resolve();
        pending[0]({ data: { data: ["old.zip"] } }); await old; await Promise.resolve();
        assert.equal(b.file, "new.zip");
        pending.length = 0; ctx.data.data = [a, b];
        const moved = ctx.uploadSource(event, 1); ctx.data.data.splice(0, 1);
        pending[0]({ data: { data: ["moved.zip"] } }); await moved;
        assert.equal(b.file, "moved.zip", "removing an earlier slot must not discard a valid upload");
    } finally { view.unmount(); }
});

test("resource uploads remain independent and ignore replaced form data", async () => {
    const pending = [];
    const options = load("src/components/publish/publish_tool_source.vue", {
        FormData: class { append() {} }, upload: () => new Promise((resolve) => pending.push(resolve)),
    });
    const state = reactive({ meta: { data: [{ file: "" }, { file: "" }] } });
    const view = mount(options, () => ({ modelValue: state.meta, "onUpdate:modelValue": (v) => state.meta = v }));
    const event = { target: { files: [{ name: "file.zip" }] } };
    try {
        const first = view.instance.uploadSource(event, 0);
        const second = view.instance.uploadSource(event, 1);
        pending[1]({ data: { data: ["second.zip"] } }); await second;
        pending[0]({ data: { data: ["first.zip"] } }); await first;
        await nextTick();
        assert.deepEqual(state.meta.data.map((item) => item.file), ["first.zip", "second.zip"]);
        const stale = view.instance.uploadSource(event, 0);
        const previous = state.meta;
        state.meta = { data: [{ file: "loaded.zip" }] };
        await nextTick();
        pending[2]({ data: { data: ["stale.zip"] } }); await stale;
        await nextTick();
        assert.equal(state.meta.data[0].file, "loaded.zip");
        assert.equal(previous.data[0].file, "first.zip");
    } finally { view.unmount(); }
});

test("uploaded tool resource reaches the publish payload through v-model", async () => {
    let submitted;
    const page = load("src/post/tool.vue", {
        push: async (payload) => {
            submitted = JSON.parse(JSON.stringify(payload));
            return { data: { data: { ID: 123 } } };
        },
    });
    const ctx = contextFor(page, { id: 0, removeBase64Img: (value) => value });
    Object.assign(ctx, { atUser: noop, setHasRead: noop, syncPalu: async () => {},
        setCommentConfig: noop, afterPublish: async () => {}, done: noop });
    ctx.post = reactive(ctx.post);
    const options = load("src/components/publish/publish_tool_source.vue", {
        FormData: class { append() {} },
        upload: async () => ({ data: { data: ["https://example.com/tool.zip"] } }),
    });
    const view = mount(options, () => ({
        modelValue: ctx.post.post_meta,
        "onUpdate:modelValue": (value) => ctx.post.post_meta = value,
    }));
    try {
        ctx.post.post_meta.data[0].mode = "1";
        await view.instance.uploadSource({ target: { files: [{ name: "tool.zip" }] } }, 0);
        await nextTick();
        await ctx.publish("publish", true);
        assert.equal(submitted.post_meta.data[0].file, "https://example.com/tool.zip");
    } finally { view.unmount(); }
});

for (const fails of [false, true]) {
    test(`tool update waits for replacement upload${fails ? " and stops on upload failure" : " before submitting both download fields"}`, async () => {
        const requests = [];
        let resolveUpload, rejectUpload;
        const page = load("src/post/tool.vue", {
            push: async (id, payload) => {
                requests.push({ id, payload: JSON.parse(JSON.stringify(payload)) });
                return { data: { data: { ID: id } } };
            },
        });
        const ctx = contextFor(page, { id: 123, removeBase64Img: (value) => value });
        Object.assign(ctx, { atUser: noop, setHasRead: noop, syncPalu: async () => {},
            setCommentConfig: noop, afterPublish: async () => {}, done: noop });
        ctx.post = reactive({ ...ctx.post, ID: 123, post_meta: {
            down: "old.zip", data: [{ name: "tool", mode: "1", file: "old.zip" }],
        } });
        const options = load("src/components/publish/publish_tool_source.vue", {
            FormData: class { append() {} },
            upload: () => new Promise((resolve, reject) => { resolveUpload = resolve; rejectUpload = reject; }),
        });
        const view = mount(options, () => ({ modelValue: ctx.post.post_meta,
            "onUpdate:modelValue": (value) => ctx.post.post_meta = value }));
        ctx.$refs = { toolSource: view.instance };
        try {
            const event = { target: { files: [{ name: "tool.zip" }], value: "tool.zip" } };
            const uploading = view.instance.uploadSource(event, 0);
            const saving = ctx.publish("publish", true);
            const uploadResult = uploading.catch((error) => error);
            const saveResult = saving.catch((error) => error);
            await nextTick();
            const earlyRequestCount = requests.length;
            if (fails) rejectUpload(new Error("upload failed"));
            else resolveUpload({ data: { data: ["new.zip"] } });
            await uploadResult;
            const result = await saveResult;
            assert.equal(earlyRequestCount, 0, "must not send the old URL while a replacement is uploading");
            assert.equal(ctx.processing, false);
            assert.equal(event.target.value, "", "same file can be selected again");
            if (fails) {
                assert.equal(requests.length, 0);
                assert.equal(result.message, "upload failed");
                assert.equal(ctx.post.post_meta.data[0].file, "old.zip");
            } else {
                assert.equal(requests.length, 1);
                assert.equal(requests[0].id, 123);
                assert.equal(requests[0].payload.post_meta.data[0].file, "new.zip");
                assert.equal(requests[0].payload.post_meta.down, "new.zip");
            }
        } finally { view.unmount(); }
    });
}

test("legacy download conversion does not undo editing or overwrite modern resource data", async () => {
    const options = load("src/components/publish/publish_tool_source.vue");
    const state = reactive({ meta: { down: "old.zip", data: [{ name: "A", mode: "0", file: "" }] } });
    const view = mount(options, () => ({ modelValue: state.meta, "onUpdate:modelValue": (v) => state.meta = v }));
    try {
        await nextTick(); assert.equal(state.meta.data[0].file, "old.zip");
        state.meta.data[0].file = "new.zip"; state.meta.data[0].mode = "0";
        await nextTick(); assert.equal(state.meta.data[0].file, "new.zip"); assert.equal(state.meta.data[0].mode, "0");
        state.meta.data[0].file = ""; await nextTick(); assert.equal(state.meta.data[0].file, "");
        assert.equal(state.meta.down, "", "legacy field must reflect clearing the primary download");
        state.meta = JSON.parse(JSON.stringify(state.meta));
        await nextTick(); assert.equal(state.meta.data[0].file, "", "saved empty links must not be resurrected");
        state.meta = { down: "old.zip", data: [{ file: "modern.zip", mode: "0" }] };
        await nextTick(); assert.equal(state.meta.data[0].file, "modern.zip");
    } finally { view.unmount(); }
});

test("dungeon client switch resets dependent choices, but loaded snapshots are preserved", async () => {
    const bus = require("mitt")();
    const maps = {
        fbmap_std: { Standard: { dungeon: { A: { boss: ["a"], maps: [] } } } },
        fbmap_origin: { Origin: { dungeon: { B: { boss: ["b"], maps: [] } } } },
    };
    const options = load("src/components/publish/publish_fb.vue", { ...maps, Bus: bus });
    const state = reactive({ client: "std", meta: { fb_zlp: "Standard", fb_name: "A", fb_boss: ["a"], fb_level: ["hard"] } });
    const view = mount(options, () => ({ client: state.client, modelValue: state.meta, "onUpdate:modelValue": (v) => state.meta = v }));
    try {
        await nextTick(); assert.equal(state.meta.fb_boss[0], "a");
        state.client = "origin"; bus.emit("changeClient", "origin"); await nextTick();
        assert.equal(state.meta.fb_name, "B"); assert.equal(state.meta.fb_boss.length, 0); assert.equal(state.meta.fb_level.length, 0);
        state.client = "std";
        state.meta = { fb_zlp: "Historical", fb_name: "Historical dungeon", fb_boss: ["saved"], fb_level: ["saved"] };
        await nextTick(); assert.equal(state.meta.fb_name, "Historical dungeon"); assert.equal(state.meta.fb_boss[0], "saved");
    } finally { view.unmount(); }
});

test("structured drafts are backed up without creating drafts for untouched defaults", async () => {
    const options = load("src/utils/autoSaveMixin.js", { settings: { localDuration: 30000 } });
    const writes = [];
    const ctx = { id: 0, isNewPost: true, $t: (k) => k,
        db: { setItem: async (key, value) => writes.push({ key, value }) } };
    for (const type of ["macro", "pvp", "tool"]) {
        ctx.post = load(`src/post/${type}.vue`).data().post;
        options.methods.createLocalDraft.call(ctx); assert.equal(writes.length, 0);
    }
    ctx.post.post_meta.data[0].file = "tool.zip";
    options.methods.createLocalDraft.call(ctx); await Promise.resolve(); assert.equal(writes.length, 1);
    ctx.post = load("src/post/macro.vue").data().post; ctx.post.post_meta.data[0].macro = "/cast skill";
    options.methods.createLocalDraft.call(ctx); await Promise.resolve(); assert.equal(writes.length, 2);
    ctx.post = load("src/post/pvp.vue").data().post; ctx.post.post_meta.content = "摘要";
    options.methods.createLocalDraft.call(ctx); await Promise.resolve(); assert.equal(writes.length, 3);
});

test("autosave initialization replaces its timer and preview modes stop it", () => {
    const active = new Set();
    let next = 0;
    const options = load("src/utils/autoSaveMixin.js", {
        settings: { localDuration: 30000 },
        setInterval: () => { active.add(++next); return next; }, clearInterval: (id) => active.delete(id),
    });
    const ctx = { id: 0, isDraft: false, isRevision: false, createLocalDraft: noop };
    options.methods.autoSave.call(ctx); options.methods.autoSave.call(ctx);
    assert.equal(active.size, 1);
    ctx.isDraft = true; options.methods.autoSave.call(ctx); assert.equal(active.size, 0);
    ctx.isDraft = false; options.methods.autoSave.call(ctx);
    options.beforeUnmount.call(ctx); assert.equal(active.size, 0);
});

test("retaining a saved new post keeps author collection rights without granting admin or collaborator rights", () => {
    const mixin = load("src/utils/cmsMetaMixin.js");
    const ctx = { post: { ID: "", post_content: "unsaved body" }, $t: (key) => key, $message: { warning: noop } };
    Object.defineProperty(ctx, "id", { get: () => Number(ctx.post.ID) || 0 });
    mixin.methods.retainSavedPost.call(ctx, { ID: 81, post_content: "older server snapshot" });
    assert.equal(ctx.post.post_content, "unsaved body");
    assert.equal(mixin.computed.canManagePostCollection.call(ctx), true);
    ctx.from = "admin"; assert.equal(mixin.computed.canManagePostCollection.call(ctx), false);
    ctx.from = ""; ctx.post.post_author = 17;
    mixin.methods.retainSavedPost.call(ctx, { ID: 81 });
    assert.equal(ctx.post.post_author, 17);
    assert.equal(mixin.computed.canManagePostCollection.call(ctx), false);
});

test("legacy prop and old down-only payload still initialize resource controls", async () => {
    const options = load("src/components/publish/publish_tool_source.vue");
    const state = reactive({ value: { down: "legacy.zip" } });
    const view = mount(options, () => ({ value: state.value, onUpdate: (v) => state.value = v }));
    try {
        await nextTick(); assert.equal(state.value.data[0].file, "legacy.zip");
        state.value.data[0].file = "replacement.zip";
        await nextTick(); assert.equal(state.value.data[0].file, "replacement.zip");
        assert.equal(state.value.down, "replacement.zip");
    } finally { view.unmount(); }
});
