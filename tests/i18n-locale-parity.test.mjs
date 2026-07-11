import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const ROOT = path.resolve(import.meta.dirname, "..");
const LOCALE_ROOT = path.join(ROOT, "src/locale");
const SOURCE_ROOT = path.join(ROOT, "src");
const LOCALES = ["zh-CN", "zh-TW", "en-US", "vi"];

function readModule(file) {
    const source = fs.readFileSync(file, "utf8").replace(/^export default\s+/, "module.exports = ");
    const context = { module: { exports: {} } };
    vm.runInNewContext(source, context, { filename: file });
    return context.module.exports;
}

function flatten(value, prefix = "", output = new Set()) {
    Object.entries(value || {}).forEach(([key, child]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (child && typeof child === "object" && !Array.isArray(child)) {
            flatten(child, fullKey, output);
        } else {
            output.add(fullKey);
        }
    });
    return output;
}

function flattenValues(value, prefix = "", output = new Map()) {
    Object.entries(value || {}).forEach(([key, child]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (child && typeof child === "object" && !Array.isArray(child)) {
            flattenValues(child, fullKey, output);
        } else {
            output.set(fullKey, child);
        }
    });
    return output;
}

function placeholders(value) {
    return [...String(value ?? "").matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((match) => match[1]).sort();
}

function listFiles(directory, extensions) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) return listFiles(file, extensions);
        return extensions.has(path.extname(entry.name)) ? [file] : [];
    });
}

function loadLocale(locale) {
    const directory = path.join(LOCALE_ROOT, locale);
    return Object.fromEntries(
        fs
            .readdirSync(directory)
            .filter((file) => file.endsWith(".js"))
            .map((file) => {
                const moduleName = path.basename(file, ".js");
                return [moduleName, readModule(path.join(directory, file))];
            })
    );
}

test("all application locale modules have matching keys", () => {
    const messages = Object.fromEntries(LOCALES.map((locale) => [locale, loadLocale(locale)]));
    const expectedModules = Object.keys(messages[LOCALES[0]]).sort();

    LOCALES.slice(1).forEach((locale) => {
        assert.deepEqual(Object.keys(messages[locale]).sort(), expectedModules, `${locale} module list differs`);
    });

    expectedModules.forEach((moduleName) => {
        const expectedKeys = [...flatten(messages[LOCALES[0]][moduleName])].sort();
        const expectedValues = flattenValues(messages[LOCALES[0]][moduleName]);
        LOCALES.slice(1).forEach((locale) => {
            assert.deepEqual(
                [...flatten(messages[locale][moduleName])].sort(),
                expectedKeys,
                `${locale}/${moduleName}.js keys differ`
            );
            const localeValues = flattenValues(messages[locale][moduleName]);
            expectedValues.forEach((value, key) => {
                assert.deepEqual(
                    placeholders(localeValues.get(key)),
                    placeholders(value),
                    `${locale}/${moduleName}.js placeholder mismatch at ${key}`
                );
            });
        });
    });
});

test("all statically referenced application translation keys exist", () => {
    const messages = loadLocale("zh-CN");
    const availableKeys = new Set(
        Object.entries(messages).flatMap(([moduleName, value]) =>
            [...flatten(value)].map((key) => `${moduleName}.${key}`)
        )
    );
    const missing = [];
    const keyPatterns = [
        /\$t\(\s*["'`]([a-zA-Z][a-zA-Z0-9_-]*(?:\.[a-zA-Z0-9_-]+)+)["'`]/g,
        /\bkeypath=["']([a-zA-Z][a-zA-Z0-9_-]*(?:\.[a-zA-Z0-9_-]+)+)["']/g,
        /["'](pages(?:\.[a-zA-Z0-9_-]+)+)["']/g,
    ];

    listFiles(SOURCE_ROOT, new Set([".js", ".vue"])).forEach((file) => {
        const source = fs.readFileSync(file, "utf8");
        keyPatterns.forEach((keyPattern) => {
            for (const match of source.matchAll(keyPattern)) {
                const key = match[1];
                if (!availableKeys.has(key)) {
                    missing.push(`${path.relative(ROOT, file)}: ${key}`);
                }
            }
        });
    });

    assert.deepEqual(missing, []);
});
