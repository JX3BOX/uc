import { $team, $pay, $next } from "@jx3box/jx3box-common/js/https";

// 获取个人团队成绩证书列表
function teamCertificationRecordList(params) {
    return $team().get("/api/team/team-certification-record/list", { params });
}

// 获取个人节日贺卡列表
function getHolidayCard(params) {
    return $pay().get("/api/event/trigger/history", { params });
}

// 获取个人生日贺卡列表
function getBirthdayCard(params) {
    return $next().get("/api/next2/birthday-event/my/list", { params });
}

export { teamCertificationRecordList, getHolidayCard, getBirthdayCard };
