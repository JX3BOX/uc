import { $server }  from "./axios";

function getPosts(params) {
    return $server.get("post/list", {
        params: params,
    });
}

function checkUser(uid, status) {
    return $server.post("user/admin", {
        ID: uid,
        user_status: status,
    });
}

export { getPosts, checkUser };
