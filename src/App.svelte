<script lang="ts">
  import "@iframe-resizer/child";

  import PatientComponent from "./components/Patient.svelte";
  import PrescriptionComponent from "./components/Prescription.svelte";
  import {
    getClinic,
    getClinician,
    getPatient,
    type Clinic,
    type Clinician,
    type Patient,
  } from "./lib/api";

  const params = new URLSearchParams(window.location.search);

  let clinic: Clinic | undefined;
  let clinician: Clinician | undefined;
  let patient: Patient | undefined;

  const caseExternalId = params.get("case") || "";
  const clinicExternalId = params.get("clinic") || "";
  const clinicianExternalId = params.get("clinician") || "";
  const patientExternalId = params.get("patient") || "";

  const drugs = {
    message:
      params.get("drugs.message") ||
      "The medication was chosen based on the patient’s preference",
    selected: (params.get("drugs.selected") || "").split(","),
  };

  async function load() {
    patient = await getPatient(patientExternalId);
    clinician = await getClinician(clinicianExternalId);
    clinic = await getClinic(clinicExternalId);
  }

  load();
</script>

{#if patient?.id && clinic?.id && clinician?.id}
  <main>
    <form class="max-w-3xl m-auto grid gap-y-6">
      <section>
        <div class="w-1/12">
          <a href="https://wellsync.com" target="_blank">
            <img src="/logo.svg" alt="WellSync" class="rounded-md w-full" />
          </a>
        </div>
        <PatientComponent {patient} />
      </section>

      <PrescriptionComponent
        {caseExternalId}
        clinicId={clinic.id}
        clinicianId={clinician.id}
        patientId={patient.id}
        preferredDrugs={drugs}
      />
    </form>
  </main>
{/if}
