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

export async function signData(data: string): Promise<{ signature: string; fingerprint: string }> {
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
