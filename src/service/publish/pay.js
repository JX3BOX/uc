import { $pay } from "@jx3box/jx3box-common/js/https";

// 文章中 at 某人
function atAuthors({ sendUserId, accessUserId, postId, postType }){
    return $pay({ mute: true }).get(`/api/horn/${sendUserId}/to/user/article/${postType}/${postId}`, {
        params: {
            accessUserId,
        }
    });
}

export { atAuthors };
