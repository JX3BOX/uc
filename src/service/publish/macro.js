import { $next } from "@jx3box/jx3box-common/js/https";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import dateFormat from "@/utils/dateFormat";
import xfmap from "@jx3box/jx3box-data/data/xf/xf.json";

function syncRedis(data) {
    let redisData = transferForRedis(data);
    console.log("正在执行redis同步作业:", redisData);
    return $next({mute:true}).post("/api/macro/publish", redisData);
}

function transferForRedis(data) {
    let author = data.author;
    let pid = data.ID;

    let _ = {
        author: author,
        user_id: ~~data.post_author || 0,
        post_id: pid,
        post_status: data.post_status,
        data: {},
        lang: data.lang || 'cn',
        original: !!data.original,
        client : data.client
    };

    let xf = xfmap[data.post_subtype]["id"] + "";

    data.post_meta.data.forEach((item, i) => {
        // 描述处理
        let desc = "";

        // 奇穴
        desc += "【奇穴】";
        let talent = "";
        try {
            talent = item.talent && JSON.parse(item.talent);
            desc += talent.sq;
        } catch (e) {
            console.log("奇穴编码解析失败", e);
        }

        // 时间
        desc += "\n【最后更新于】";
        desc += dateFormat(new Date());

        // 来源
        desc += "\n【来源】JX3BOX";

        // 名字
        if (!item.name) item.name = Date.now();

        _.data[item.name] = {
            author: author,
            key: item.name,
            version: Date.now(),
            icon: ~~item.icon || 13,
            xf: xf || 0,

            data: item.macro,
            desc: desc,

            about: __Root + "macro/" + pid,
            client : data.client
        };
    });

    return _;
}

export { syncRedis };
