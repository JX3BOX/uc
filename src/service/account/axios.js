import axios from "axios";
import User from "@jx3box/jx3box-common/js/user";
import { $cms as commonCms } from "@jx3box/jx3box-common/js/api.js";

const $ = axios.create({
    withCredentials : true,
    headers: {},
    baseURL: process.env.VUE_APP_CMS_API,
});

setTimeout(() => {
    $.defaults.headers.common['user-device-fingerprint'] = User.getDeviceFingerprint();
}, 1500);

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
    return commonCms({
        ...(options || {}),
        interceptor: false,
    });
}

export { $, axios, $cms };
