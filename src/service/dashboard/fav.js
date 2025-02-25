import { $next } from "@jx3box/jx3box-common/js/https";
function getMyFavs(params) {
    return $next()
        .get(`/api/article/favorites/my`, {
            params,
        })
        .then((res) => {
            return res.data.data;
        });
}

function delFav(id) {
    return $next().delete(`api/article/favorites/my/${id}`);
}

function getVisitHistory(params) {
    return $next().get(`api/next2/userdata/visit-history/list`, {
        params,
    });
}

function deleteVisitHistory(id){
    return $next().delete(`api/next2/userdata/visit-history/item/${id}`,);
}

function getWaitWatch(params) {
    return $next().get(`api/next2/userdata/favorite/list`, {
        params,
    });
}

function deleteWaitWatch(id){
    return $next().delete(`api/next2/userdata/favorite/item/${id}`,);
}

function getRssList(params) {
    return $next().get(`api/next2/rss/list`, {
        params,
    });
}

function deleteRss(id){
    return $next().delete(`api/next2/rss/subscribe/${id}`,);
}

export { getMyFavs, delFav,getVisitHistory,getWaitWatch,deleteVisitHistory,deleteWaitWatch, getRssList, deleteRss };
