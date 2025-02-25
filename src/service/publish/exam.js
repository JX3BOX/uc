import { $next } from "@jx3box/jx3box-common/js/https";

function getQuestion(id) {
    return $next().get("/api/question/" + id);
}

function createQuestion(data) {
    return $next().post("/api/question/create", data);
}

function updateQuestion(id, data) {
    return $next().put("/api/question/" + id + "/update", data);
}

function createPaper(data) {
    return $next().post("/api/question/" + "exam-paper", data);
}

function updatePaper(id, data) {
    return $next().put("/api/question/" + "exam-paper/" + id, data);
}

function getPaper(id) {
    return $next().get("/api/question/" + "exam-paper/" + id);
}

function getQuestions(query) {
    return $next().get("/api/question/" + "my-list", {
        params: query,
    });
}

function getPapers(query) {
    return $next().get("/api/question/exam-paper?my", {
        params: query,
    });
}

function deleteQuestion(id){
    return $next().delete(`/api/question/my/${id}`)
}

function deletePaper(id){
    return $next().delete(`/api/question/exam-paper/my/${id}`)
}

export {
    getQuestion,
    createQuestion,
    updateQuestion,
    getQuestions,
    createPaper,
    updatePaper,
    getPaper,
    getPapers,
    deleteQuestion,
    deletePaper
};
