<script lang="ts">
  import Prescription from "./components/Prescription.svelte";
  import Patient from "./components/Patient.svelte";
  import Unlock from "./components/Unlock.svelte";

  import "@iframe-resizer/child";
  import { type Signature, sign, parentSign } from "./lib/crypto";

  const params = new URLSearchParams(window.location.search);

  const caseId = params.get("case") || "";
  const patient = params.get("patient") || "";
  const clinician = params.get("clinician") || "";
  const wrapperKey = params.get("wrapper_key") || "";
  const privateKey = params.get("private_key") || "";

  let locked = !!(wrapperKey && privateKey);
  if (wrapperKey && !privateKey) {
    throw new Error("wrapper key provided without private key");
  }

  let key: CryptoKey | null = null;

  function decryptedPrivateKey(decryptedKey: CryptoKey) {
    key = decryptedKey;
    locked = false;
  }

  async function signPrescription(prescription: string): Promise<Signature> {
    if (!wrapperKey && !privateKey) {
      return parentSign(prescription);
    }

    if (!key) {
      throw new Error("private key not set or decrypted");
    }

    return await sign(key, prescription);
  }

  const drugs = {
    message:
      params.get("drugs.message") ||
      "The medication was chosen based on the patient’s preference",
    selected: (params.get("drugs.selected") || "").split(","),
  };
</script>

{#if locked}
  <Unlock {wrapperKey} {privateKey} {decryptedPrivateKey} />
{/if}
<form class="max-w-3xl m-auto grid gap-y-6 {locked ? 'blur-sm' : ''}">
  <section>
    <div class="w-1/12">
      <a href="https://wellsync.com" target="_blank">
        <img src="/logo.svg" alt="WellSync" class="rounded-md w-full" />
      </a>
    </div>
    <Patient id={patient} />
  </section>

  <Prescription
    patientId={patient}
    clinicianId={clinician}
    preferredDrugs={drugs}
    {signPrescription}
  />
</form>
