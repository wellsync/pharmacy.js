export interface Signature {
    signature: string;
    fingerprint: string;
}

interface SignResponse {
    type: "SIGN_RESPONSE";
    data: { signature: string; fingerprint: string };
    requestId: number;
}

interface SignError {
    type: "SIGN_ERROR";
    data: string;
    requestId: number;
}

type SignMessage = SignResponse | SignError;

export async function parentSign(data: string): Promise<Signature> {
    return new Promise((resolve, reject) => {
        const requestId = Date.now(); // Unique identifier for the request


        const messageHandler = (event: MessageEvent<SignMessage>) => {
            const { type, data, requestId: responseId } = event.data;
            if (responseId !== requestId) return; // Ignore unrelated messages

            if (type === "SIGN_RESPONSE") {
                window.removeEventListener("message", messageHandler);
                resolve(data);
            } else if (type === "SIGN_ERROR") {
                window.removeEventListener("message", messageHandler);
                reject(new Error(data));
            }
        };

        window.addEventListener("message", messageHandler);
        window.parent.postMessage({ type: "SIGN_REQUEST", data, requestId }, "*");
    });
}

export async function decryptPrivateKey(wrapperKey: string, privateKey: string, password: string) {
    const key = await decryptAESGCM(wrapperKey, password);
    const pem = await decryptAESGCM(privateKey, key);

    const content = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "")
        .replace(/\r/g, "");

    const binaryKey = atob(content);
    const binaryKeyBuffer = new Uint8Array(binaryKey.length);
    for (let i = 0; i < binaryKey.length; i++) {
        binaryKeyBuffer[i] = binaryKey.charCodeAt(i);
    }

    return await crypto.subtle.importKey(
        "pkcs8",
        binaryKeyBuffer.buffer,
        {
            name: "RSASSA-PKCS1-v1_5",
            hash: { name: "SHA-256" },
        },
        true,
        ["sign"]
    );
}

async function decryptAESGCM(value: string, password: string): Promise<string> {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const message = Uint8Array.from(atob(value), c => c.charCodeAt(0));

    // NOTE: extract IV and ciphertext
    const iv = message.slice(0, 12);
    const ciphertext = message.slice(12);

    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password.padEnd(32, " ")), // Ensure key is 256-bit
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );

    const decoded = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        ciphertext
    );

    return decoder.decode(decoded);
}

export async function sign(key: CryptoKey, data: string): Promise<Signature> {
    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
        {
            name: "RSASSA-PKCS1-v1_5",
        },
        key,
        encoder.encode(data)
    );

    return {
        signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
        fingerprint: await hash(data),
    };
}

async function hash(value: string): Promise<string> {
    const utf8 = new TextEncoder().encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}
