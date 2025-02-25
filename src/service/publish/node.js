import { $node } from "@jx3box/jx3box-common/js/https";

function getSkill(query, params) {
    let condition = isNaN(query) ? "name" : "id";
    return $node().get(`/skill/${condition}/${query}`, {
        params: params,
    }).then(res => {
        return res.data;
    }).catch((err) => {
        console.log(err);
    });
}

function getSkillList(params) {
    return $node().get(`/skill`, {
        params: params,
    })
}

function getMobileForceSkillList(force_id) {
    return $node().get("/v2/kungfu/panel", {
        params: {
            mount_id: force_id,
            client: 'wujie'
        },
    });
}

export { getSkill, getSkillList, getMobileForceSkillList };


export function getKungfuPanel(params) {
    return $node().get("/v2/kungfu/panel", {
        params,
    });
}
