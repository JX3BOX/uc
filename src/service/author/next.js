import { $next } from "./axios";

function getPapers(params) {
    return $next().get("api/question/user-exam-paper", {
        params: params,
    });
}

function getQuestions(params) {
    return $next().get("api/question/public-list", {
        params: params,
    });
}

function getFaceList(params){
    return $next().get("api/face", {
        params: params,
    });
}

function getBodyList(params){
    return $next().get("api/pvxbody", {
        params: params,
    });
}

export { getPapers, getQuestions,getFaceList,getBodyList };
