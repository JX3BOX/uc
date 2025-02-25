import { $pay } from "./axios";

function getHolidayCard(params) {
    return $pay().get("/api/event/trigger/history", {params});
}

export { getHolidayCard };
