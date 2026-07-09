import User from "@jx3box/jx3box-common/js/user";

function ensureDeviceFingerprint() {
    const cache = User.getDeviceFingerprint();
    if (cache) return Promise.resolve(cache);

    return new Promise((resolve) => {
        const result = User.generateFingerprint((fingerprint) => {
            resolve(fingerprint || User.getDeviceFingerprint() || "");
        });

        if (result) {
            resolve(result);
        }
    });
}

async function getDeviceFingerprintHeader() {
    const fingerprint = await ensureDeviceFingerprint();

    return {
        "user-device-fingerprint": fingerprint,
    };
}

export { ensureDeviceFingerprint, getDeviceFingerprintHeader };
