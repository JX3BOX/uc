import { publicKey } from '@/assets/data/account/pwd_rsa';

const ENCRYPT_VERSION = 2;

function getWebCrypto() {
    return globalThis.crypto?.subtle ? globalThis.crypto : null;
}

function pemToArrayBuffer(pem = "") {
    const base64 = pem
        .replace(/-----BEGIN PUBLIC KEY-----/g, "")
        .replace(/-----END PUBLIC KEY-----/g, "")
        .replace(/\s/g, "");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";

    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

export const encryptPassword = async function(password = "") {
    const crypto = getWebCrypto();

    if (!password || !publicKey || !crypto) {
        return {
            encrypted: false,
            value: password,
        };
    }

    try {
        const key = await crypto.subtle.importKey(
            "spki",
            pemToArrayBuffer(publicKey),
            {
                name: "RSA-OAEP",
                hash: "SHA-256",
            },
            false,
            ["encrypt"]
        );
        const encrypted = await crypto.subtle.encrypt(
            {
                name: "RSA-OAEP",
            },
            key,
            new TextEncoder().encode(password)
        );

        return {
            encrypted: true,
            version: ENCRYPT_VERSION,
            value: arrayBufferToBase64(encrypted),
        };
    } catch (e) {
        return {
            encrypted: false,
            value: password,
        };
    }
}
