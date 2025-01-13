<script lang="ts">
  const params = new URLSearchParams(window.location.search);

  const patient = params.get("patient") || "";
  const clinician = params.get("clinician") || "";
  const drug = params.get("drug") || "";

  import "@iframe-resizer/child";

  import Logo from "./assets/logo.svg";
  import Patient from "./components/Patient.svelte";
  import Prescription from "./components/Prescription.svelte";
</script>

<main>
  <form class="max-w-3xl m-auto grid gap-y-6">
    <section>
      <img src={Logo} alt="WellSync" class="rounded-md w-1/12" />
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
