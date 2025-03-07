function setCookie(key, val, expires) {
    document.cookie = key + "=" + val + "; " + "Max-Age=" + expires;
}
function delCookie(key, val) {
    document.cookie = key + "=" + val + "; " + "Max-Age=0";
}
function getCookie(key) {
    key = key + "=";
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(key) == 0)
            return cookie.slice(key.length, key.length);
    }
    return "";
}

module.exports = {
    get: getCookie,
    set: setCookie,
    del: delCookie,
}
