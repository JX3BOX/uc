import axios from "axios";
import User from "@jx3box/jx3box-common/js/user";
import { __cms } from "@jx3box/jx3box-common/data/jx3box.json";

const $ = axios.create({
    withCredentials : true,
    headers: {},
    baseURL: process.env.VUE_APP_CMS_API,
});

setTimeout(() => {
    $.defaults.headers.common['user-device-fingerprint'] = User.getDeviceFingerprint();
}, 1500);

import Vue from "vue";
import { Message, Notification } from "element-ui";
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

function installInterceptors(target){
    target['interceptors']['response'].use(
        function(response) {
            return response;
        },
        function(err) {
            console.log(err)
            return Promise.reject(err);
        }
    );
}
installInterceptors(axios)
installInterceptors($)

// cms通用请求接口
function $cms(options) {
    let domain = (options && options.domain) || __cms;
    let config = {
        // 同时发送cookie和basic auth
        withCredentials: true,
        baseURL: domain,
        // baseURL: process.env.NODE_ENV === "production" ? domain : "/",
        headers: Object.assign({}, options.headers || {}),
    };

    // 创建实例
    const ins = axios.create(config);

    // 指定拦截器
    installInterceptors(ins);

    return ins;
}

export { $, axios, $cms };
