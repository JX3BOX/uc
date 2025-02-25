import { $next } from "@jx3box/jx3box-common/js/https";

const __ipay = 'https://ipay.jx3box.com'

export function $ipay(options) {
    let _options = (options && Object.assign(options, { domain: __ipay })) || { domain: __ipay };
    return $next(_options);
}

