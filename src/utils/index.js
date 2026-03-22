import { pickBy } from "lodash";

function removeEmpty(obj) {
    return pickBy(obj, (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && value !== null && Object.keys(value).length === 0) return false;
        return true; // 保留其它情况，包括 0, false 等
    });
}

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((resolve, reject) => {
            document.execCommand("copy") ? resolve() : reject();
            textArea.remove();
        });
    }
}

export { removeEmpty, copyText };
