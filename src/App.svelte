<script lang="ts">
  const params = new URLSearchParams(window.location.search);

  const caseId = params.get("case") || "";
  const patient = params.get("patient") || "";
  const clinician = params.get("clinician") || "";

  const drugs = {
    message:
      params.get("drugs.message") ||
      "The medication was chosen based on the patient’s preference",
    selected: (params.get("drugs.selected") || "").split(","),
  };

  import "@iframe-resizer/child";

  import Patient from "./components/Patient.svelte";
  import Prescription from "./components/Prescription.svelte";
</script>

<main>
  <form class="max-w-3xl m-auto grid gap-y-6">
    <section>
      <div class="w-1/12">
        <a href="https://wellsync.com" target="_blank">
          <img src="/logo.svg" alt="WellSync" class="rounded-md w-full" />
        </a>
      </div>
      <Patient id={patient} />
    </section>

    <Prescription
      {caseId}
      patientId={patient}
      clinicianId={clinician}
      preferredDrugs={drugs}
    />
  </form>
</main>

<style lang="postcss">
</style>
