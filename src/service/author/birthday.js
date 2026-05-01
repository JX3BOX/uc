import { $next } from "@jx3box/jx3box-common/js/api";

export function getBirthdayDetail(id) {
    return $next().get(`/api/next2/birthday-event/my/item/${id}`);
}
