# Pharmacy.js HTML Example

This folder contains a minimal **pure HTML** usage example for `PharmacyOrder`.

## Files

- `index.html` - Simple example that mounts the pharmacy widget into `#order`.
- `sample-public-key.pem` - Sample placeholder public key corresponding to the sample private key structure.

## How to use

1. Open `example/index.html`.
2. Replace placeholder values in the `new PharmacyOrder(...)` call:
   - `apiKey` used by `createSession(...)`
   - `case` (external ID)
   - `clinic` (external ID)
   - `clinician` (external ID)
   - `patient` (external ID)
   - `environment` (`dev`, `stg`, or `prd`)
   - `privateKey` (PEM format)
   - optional `drugs`

## Notes

- This example follows the same pattern as the working app usage: script in `<head>` + `DOMContentLoaded` + `new PharmacyOrder(...)`.
- This example loads the widget client from `https://pharmacy.js.wellsync.io/client.js` (no relative paths).
- This example includes a pure JS `createSession(apiKey, environment)` helper in `index.html` that calls `POST /v1/sessions` and passes the returned `access_token` into `new PharmacyOrder(...)`.
- `index.html` includes a **valid sample PKCS#8 private key** placeholder so local loading works. Replace it with your real key before production use.
- `sample-public-key.pem` is the matching public key for the sample private key.
- The private key must be a valid PKCS#8 PEM key:

```pem
-----BEGIN PRIVATE KEY-----
...
-----END PRIVATE KEY-----
```
