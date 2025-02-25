import { $cms } from '@jx3box/jx3box-common/js/https';

function getMyCalendar(params){
    return $cms().get(`/api/cms/calendar/mine`, {
        params
    })
}

export {
    getMyCalendar
}
