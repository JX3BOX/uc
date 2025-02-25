import { $next, $cms } from "@jx3box/jx3box-common/js/https";
import { __Root } from "@jx3box/jx3box-common/data/jx3box.json";
import axios from 'axios';

// 上传
function uploadData(formdata) {
    return $cms().post("/api/cms/upload/jx3dat", formdata);
}
const pull = process.env.NODE_ENV === "production" ? 'https://pull.jx3box.com/' : "/"   //西山居服务器
// const pull = 'https://pull.jx3box.com/'
function uploadHub(formdata) {
    return axios.post(pull + "api/plugins/my-team-mon/v2", formdata,{
        withCredentials : true
    });
}

// 云端
function syncRedis(data) {
    let redisData = transferForRedis(data);
    console.log("正在执行redis同步作业:", redisData);
    return $next({mute:true}).post("/api/plugins/jx3dat/publish", redisData)
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
        lang: data.lang || "cn",
        original: !!data.original,
        client : data.client
    };

    data.post_meta.data.forEach((item, i) => {
        item.name = item.name || Date.now();

        let version = item._version || Date.now();
        if (item.pop) {
            version = Date.now(); //如果提醒，直接使用新版本号
        } else {
            version = ~~version + 0.1; //如果不提醒，对旧版本+补丁
        }

        _.data[item.name] = {
            author: author,
            key: item.name,
            data_url: item.file,
            about: __Root + "jx3dat/" + pid,
            name: item.desc,
            version_str: version + "",
            version: Date.now(),
            _version: Date.now(),
            status: !!item.status,
            client : data.client
        };
    });

    return _;
}

const uploadLanrenFile = (formData) => {
    return axios.post(pull + 'api/plugins/lanren-file', formData, {
        withCredentials: true
    })
}

export { uploadHub, uploadData, syncRedis, uploadLanrenFile };
