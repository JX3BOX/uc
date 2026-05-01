import { getCountries, getCountryCallingCode, parsePhoneNumberFromString } from "libphonenumber-js";

const regionNames =
    typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
        ? new Intl.DisplayNames(["zh-CN"], { type: "region" })
        : null;

function maskSegment(value) {
    const text = String(value || "").trim();
    if (!text) {
        return "";
    }
    if (text.length <= 4) {
        return text;
    }
    if (text.length <= 6) {
        return `${text.slice(0, 2)}***${text.slice(-2)}`;
    }
    if (text.length <= 8) {
        return `${text.slice(0, 3)}***${text.slice(-2)}`;
    }
    return `${text.slice(0, 3)}****${text.slice(-4)}`;
}

export const PHONE_COUNTRY_OPTIONS = getCountries()
    .map((iso2) => ({
        iso2,
        name: regionNames?.of(iso2) || iso2,
        callingCode: getCountryCallingCode(iso2),
    }))
    .sort((a, b) => {
        if (a.iso2 === "CN") return -1;
        if (b.iso2 === "CN") return 1;
        return a.name.localeCompare(b.name, "zh-CN");
    });

export function normalizeBindPhone(phone, country = "CN") {
    const value = String(phone || "").trim();
    if (!value) {
        return "";
    }

    const phoneNumber = value.startsWith("+")
        ? parsePhoneNumberFromString(value)
        : parsePhoneNumberFromString(value, country || "CN");

    return phoneNumber?.isValid() ? phoneNumber.number : "";
}

export function normalizeStoredPhone(phone) {
    const value = String(phone || "").trim();
    if (!value) {
        return "";
    }

    return normalizeBindPhone(value, value.startsWith("+") ? undefined : "CN");
}

export function detectPhoneCountry(phone) {
    const normalized = normalizeStoredPhone(phone);
    if (!normalized) {
        return "CN";
    }

    return parsePhoneNumberFromString(normalized)?.country || "CN";
}

export function maskPhone(phone) {
    const value = String(phone || "").trim();
    if (!value) {
        return "";
    }

    const normalized = normalizeStoredPhone(value);
    const phoneNumber = normalized ? parsePhoneNumberFromString(normalized) : null;
    if (phoneNumber?.isValid()) {
        const prefix = `+${phoneNumber.countryCallingCode}`;
        const national = maskSegment(phoneNumber.nationalNumber);
        return national ? `${prefix} ${national}` : prefix;
    }

    const digits = value.replace(/\D/g, "");
    if (digits.length >= 7) {
        return maskSegment(digits);
    }

    return value;
}
