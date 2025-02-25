import { $node, axios } from "@jx3box/jx3box-common/js/https";
import JX3BOX from "@jx3box/jx3box-common/data/jx3box.json";

const $oss = axios.create({
    baseURL: JX3BOX.__dataPath,
});

function getSkills(params) {
    return $node().get("/skills", {
        params: params,
    });
}

async function getTalents(platform = "std") {
    let res = await $oss.get(`talent/${platform}/talents.json`);
    return res.data;
}

async function getTalents2() {
    let res = await $oss.get("talent2/talent2.json");
    return res.data;
}

export {
    getSkills,
    getTalents,
    getTalents2,
};
