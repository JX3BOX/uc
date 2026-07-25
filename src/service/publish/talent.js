import { $cms } from "@jx3box/jx3box-common/js/api";

export function getTalentPresets(params) {
    return $cms().get("/api/cms/app/talents", {
        params,
    });
}
