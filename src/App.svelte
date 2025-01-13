<script lang="ts">
  const params = new URLSearchParams(window.location.search);

  const patient = params.get("patient") || "";
  const clinician = params.get("clinician") || "";
  const drug = params.get("drug") || "";

  import "@iframe-resizer/child";

  import Patient from "./components/Patient.svelte";
  import Prescription from "./components/Prescription.svelte";
</script>

<main>
  <form class="max-w-3xl m-auto grid gap-y-6">
    <section>
      <a href="https://wellsync.com" target="_blank">
        <img src="/logo.svg" alt="WellSync" class="rounded-md w-1/12" />
      </a>
      <Patient id={patient} />
    </section>

    <Prescription
      patientId={patient}
      clinicianId={clinician}
      preferredDrugId={drug}
    />
  </form>
</main>

<style lang="postcss">
</style>
