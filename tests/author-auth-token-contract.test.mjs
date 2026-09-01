import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function readSource(relativePath) {
    return fs.readFileSync(path.resolve(projectRoot, relativePath), "utf8");
}

async function loadAuthTokenUtils() {
    const source = readSource("src/utils/auth-token.js");
    return import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
}

test("URL token replaces a stale author session token", async () => {
    const { getUrlAuthToken, syncUrlAuthToken } = await loadAuthTokenUtils();
    const values = new Map([["__token", "stale-token"]]);
    const storage = {
        getItem: (key) => values.get(key) || null,
        setItem: (key, value) => values.set(key, value),
    };

    assert.equal(getUrlAuthToken("?client=std&__token=current-token&__env=app"), "current-token");
    assert.equal(
        syncUrlAuthToken({
            search: "?client=std&__token=current-token&__env=app",
            storage,
        }),
        "current-token"
    );
    assert.equal(storage.getItem("__token"), "current-token");
});

test("author bootstrap syncs URL auth before creating the app", () => {
    const source = readSource("src/pages/author/index.js");
    const syncIndex = source.indexOf("syncUrlAuthToken();");
    const createIndex = source.indexOf("const app = createApp(App);");

    assert.ok(syncIndex >= 0);
    assert.ok(createIndex > syncIndex);
});

test("certificate request explicitly uses the route token and rejects business errors", () => {
    const viewSource = readSource("src/views/author/certificate.vue");
    const serviceSource = readSource("src/service/author/cms.js");

    assert.match(viewSource, /getCertification\(this\.id, this\.urlAuthToken\)/);
    assert.match(serviceSource, /username: token/);
    assert.match(serviceSource, /code !== 0 && code !== 200/);
    assert.match(serviceSource, /throw createCertificationResponseError\(response\)/);
});
