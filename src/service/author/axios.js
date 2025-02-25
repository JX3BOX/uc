import { $https, $next, $helper, $team, $pay } from "@jx3box/jx3box-common/js/https.js";
const $server = $https("server", {
    proxy: false,
});
export { $helper, $server, $next, $team, $pay };
