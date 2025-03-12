<script lang="ts">
  import "@iframe-resizer/child";

  import PatientComponent from "./components/Patient.svelte";
  import PrescriptionComponent from "./components/Prescription.svelte";
  import { getPatient, getClinic, type Patient, type Clinic } from "./lib/api";

  const params = new URLSearchParams(window.location.search);

  let patient: Patient | undefined;
  let clinic: Clinic | undefined;

  const externalClinicId = params.get("clinic") || "";
  const caseId = params.get("case") || "";
  const externalPatientId = params.get("patient") || "";
  const clinician = params.get("clinician") || "";

  const drugs = {
    message:
      params.get("drugs.message") ||
      "The medication was chosen based on the patient’s preference",
    selected: (params.get("drugs.selected") || "").split(","),
  };

  async function load() {
    patient = await getPatient(externalPatientId);
    clinic = await getClinic(externalClinicId);
  }

  load();
</script>

{#if patient?.id && clinic?.id}
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
        {caseId}
        clinicId={clinic.id}
        patientId={patient.id}
        clinicianId={clinician}
        preferredDrugs={drugs}
      />
    </form>
  </main>
{/if}
