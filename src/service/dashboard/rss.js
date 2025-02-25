import { $next } from "@jx3box/jx3box-common/js/https";

// 获取我的粉丝
export function getMySubscribers(params) {
    return $next().get(`/api/next2/rss/my-subscribers`, {
        params
    })
}

// 获取我的订阅
export function getMyRss(params) {
    return $next().get(`/api/next2/rss/list`, {
        params
    })
}

// 移除订阅我的用户
export function removeRssUser(user_id) {
    return $next().delete(`/api/next2/rss/my-subscribers/${user_id}`)
}

// 新增订阅
export function addRssUser(user_id,data) {
    return $next().post(`/api/next2/rss/subscribe/author/${user_id}`, data)
}

// 取消订阅
export function cancelRssUser(user_id) {
    return $next().delete(`/api/next2/rss/subscribe/author/${user_id}`)
}
