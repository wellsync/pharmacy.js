export async function importPrivateKey(pemKey: string): Promise<CryptoKey> {
    // Remove the PEM header, footer, and line breaks
    const pemContents = pemKey
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "")
        .replace(/\r/g, "");

    // Decode Base64 to ArrayBuffer
    const binaryKey = atob(pemContents);
    const binaryKeyBuffer = new Uint8Array(binaryKey.length);
    for (let i = 0; i < binaryKey.length; i++) {
        binaryKeyBuffer[i] = binaryKey.charCodeAt(i);
    }

    // Import the private key into Web Crypto
    const privateKey = await crypto.subtle.importKey(
        "pkcs8", // Format of the private key
        binaryKeyBuffer.buffer, // The ArrayBuffer containing the key
        {
            name: "RSASSA-PKCS1-v1_5", // Algorithm
            hash: { name: "SHA-256" }, // Hash function
        },
        true, // Whether the key is extractable
        ["sign"] // Usages
    );

    return privateKey;
}

export async function signData(privateKey: CryptoKey, data: string): Promise<{ signature: string; fingerprint: string }> {
    const encoder = new TextEncoder();
    const signature = await crypto.subtle.sign(
        {
            name: "RSASSA-PKCS1-v1_5",
        },
        privateKey, // The imported private key
        encoder.encode(data) // The data to sign
    );

    return {
        signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
        fingerprint: await hash(data)
    };
}


async function hash(string: string): Promise<string> {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}