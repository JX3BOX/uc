import { $cms } from "@jx3box/jx3box-common/js/api";

// 加载
function pull(id) {
    return $cms().get(`/api/cms/post/${id}/query`);
}

// 发布
function push(kw1, kw2) {
    if (arguments.length > 1) {
        return $cms().put(`/api/cms/post/${kw1}`, kw2);
    } else {
        return $cms().post(`/api/cms/post`, kw1);
    }
}

// 管理发布
function pushAdmin(kw1, kw2) {
    return $cms().put(`/api/cms/manage/post/${kw1}`, kw2);
}

// 删除
function del(id) {
    return $cms().delete(`/api/cms/post/${id}`);
}

// 统计
function getMyPostsCount() {
    return $cms().get(`/api/cms/posts/user/my/count`);
}

// 列表
function getMyPosts(params) {
    return $cms().get(`/api/cms/posts/my`, {
        params,
    });
}

// 获取全部列表
function getAllPosts(params) {
    return $cms().get(`/api/cms/posts`, {
        params,
    });
}

// 通用上传
function upload(formData) {
    return $cms().post(`/api/cms/upload`, formData);
}

// 面包屑
function getBreadCrumb(key) {
    return $cms().get(`/api/cms/breadcrumb/${key}`);
}

// 获取post_meta
function getPostMeta(id, key) {
    return $cms().get(`/api/cms/post/${id}/meta/${key}`);
}

// 设置post_meta
function setPostMeta(id, key, value) {
    return $cms().post(`/api/cms/post/${id}/meta/${key}`, { val: value });
}

// 获取技改历史
function getChangelog(params) {
    return $cms().get(`/api/cms/pve/skill/changelog`, { params });
}

function getHasteRecommend(mount, client = "std") {
    return $cms().get(`/api/cms/app/pz/haste/${mount}`, {
        params: {
            client,
        },
    });
}

// 获取自定义主题
function getTopicBucket(params) {
    return $cms().get(`/api/cms/topic/bucket`, { params });
}

// 获取config
function getConfig(key) {
    return $cms().get(`/api/cms/config`, {
        params: {
            key,
        },
    });
}

// 获取design_task
function getDesignTask(params) {
    return $cms().get(`/api/cms/design/task/log`, { params });
}

function getUpcomingDesignTask(params) {
    return $cms().get(`/api/cms/design/task/upcoming`, { params });
}

// 获取当前用户的装扮库存
function getOwnedDecorations(params) {
    return $cms({ mute: true }).get(`/api/cms/user/decoration`, { params });
}

// 获取文章当前装扮
function getPostDecoration(postId, decorationType) {
    return $cms({ mute: true }).get(`/api/cms/post/${postId}/decoration/${decorationType}`);
}

// 独立设置文章装扮，不参与文章保存事务
function setPostDecoration(postId, decorationType, slug) {
    return $cms({ mute: true }).put(`/api/cms/post/${postId}/decoration/${decorationType}`, { slug });
}

export {
    pull,
    push,
    del,
    getMyPostsCount,
    getMyPosts,
    getAllPosts,
    upload,
    getBreadCrumb,
    getPostMeta,
    setPostMeta,
    getChangelog,
    getHasteRecommend,
    getTopicBucket,
    getConfig,
    getDesignTask,
    getUpcomingDesignTask,
    getOwnedDecorations,
    getPostDecoration,
    setPostDecoration,
    pushAdmin,
};
