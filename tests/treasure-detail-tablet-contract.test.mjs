import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const treasureDetailStyleSources = [
    "src/views/author/certificate.vue",
    "src/views/author/groupCertificate.vue",
    "src/views/card/Index.vue",
    "src/components/card/birthday/components/machine.vue",
    "src/assets/css/author/birthday.less",
    "src/assets/css/author/birthday2025.less",
    "src/assets/css/author/birthday2026.less",
    "src/components/card/holiday/CardAnniversary.vue",
    "src/components/card/holiday/CardAutumn.vue",
    "src/components/card/holiday/CardChildren.vue",
    "src/components/card/holiday/CardChristmas.vue",
    "src/components/card/holiday/CardDragonBoat.vue",
    "src/components/card/holiday/CardLantern.vue",
    "src/components/card/holiday/CardNewYear.vue",
    "src/components/card/holiday/CardQixi.vue",
    "src/components/card/holiday/CardSpring.vue",
    "src/components/card/holiday/CardSpringTwo.vue",
    "src/components/card/holiday/DefaultTemplate.vue",
    "src/components/card/holiday/DoubleScreen.vue",
    "src/components/card/holiday/OneScreen.vue",
];

const portraitTabletMediaQuery =
    /@media screen and \(max-width: @phone\),\s*screen and \(orientation: portrait\) and \(max-width: @ipad-y\) \{/;

test("collectible detail variants use mobile styles on portrait tablets", () => {
    for (const relativePath of treasureDetailStyleSources) {
        const source = fs.readFileSync(path.resolve(projectRoot, relativePath), "utf8");
        assert.match(source, portraitTabletMediaQuery, `${relativePath} should include the portrait-tablet breakpoint`);
    }
});
