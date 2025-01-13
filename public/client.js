(function (global) {
  async function loadScriptAsync(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.type = "text/javascript";
      script.async = true;

      // Resolve the promise when the script is loaded
      script.onload = () => {
        console.log(`Script loaded: ${src}`);
        resolve();
      };

      // Reject the promise if there's an error loading the script
      script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
        reject(new Error(`Failed to load script: ${src}`));
      };

      // Append the script to the document head
      document.head.appendChild(script);
    });
  }

  class PharmacyOrder {
    _privateKey;
    _iframe;

    constructor(elementSelector, session, options) {
      const widget = new URL("https://pharmacy.js.wellsync.io");

      widget.searchParams.append("session", session);
      widget.searchParams.append("clinic", options.clinic);
      widget.searchParams.append("clinician", options.clinician);
      widget.searchParams.append("patient", options.patient);

      if (options.drug) {
        widget.searchParams.append("drug", options.drug);
      }

      this._iframe = document.createElement("iframe");
      this._iframe.frameBorder = 0;
      this._iframe.width = "100%";
      this._iframe.src = widget.href;

      window.addEventListener("message", this.handleMessage.bind(this), false);

      this._init(elementSelector, options);
    }

    async _init(elementSelector, options) {
      await loadScriptAsync(
        "https://cdn.jsdelivr.net/npm/@iframe-resizer/parent@5.3.2"
      );

      this._privateKey = await this._importPrivateKey(options.privateKey);

      let target = document.querySelector(elementSelector);
      if (!target) {
        throw new Error(
          "Element not found to mount the pharmacy order widget."
        );
      }

      target.appendChild(this._iframe);
      iframeResize({ license: "GPLv3", waitForLoad: true }, this._iframe);
    }

    async _importPrivateKey(pemKey) {
      const pemContents = pemKey
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\n/g, "")
        .replace(/\r/g, "");

      const binaryKey = atob(pemContents);
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

    async handleMessage(event) {
      if (!this._privateKey) {
        console.error("Private key not initialized.");
        return;
      }

      const { type, data, requestId } = event.data;

      if (type === "SIGN_REQUEST" && data) {
        try {
          const signedResponse = await this.sign(data);
          console.log(signedResponse);
          event.source.postMessage(
            {
              type: "SIGN_RESPONSE",
              data: signedResponse,
              requestId,
            },
            event.origin
          );
        } catch (error) {
          console.error("Error signing data:", error);
          event.source.postMessage(
            {
              type: "SIGN_ERROR",
              error: error.message,
              requestId,
            },
            event.origin
          );
        }
      }
    }

    async sign(data) {
      if (!this._privateKey) {
        throw new Error("Private key not initialized.");
      }

      const encoder = new TextEncoder();
      const signature = await crypto.subtle.sign(
        {
          name: "RSASSA-PKCS1-v1_5",
        },
        this._privateKey,
        encoder.encode(data)
      );

      return {
        signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
        fingerprint: await this.hash(data),
      };
    }

    async hash(string) {
      const utf8 = new TextEncoder().encode(string);
      const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    }
  }
  // Attach the class to the global object (e.g., `window` in browsers)
  global.PharmacyOrder = PharmacyOrder;
})(window);
