<script lang="ts">
  import Alert from "./Alert.svelte";
  import Header from "./Header.svelte";
  import Select from "./Select.svelte";
  import Button from "./Button.svelte";

  import {
    getDrugs,
    getPharmacy,
    type Drug,
    type Pharmacy,
    type Dosage,
  } from "../lib/api";
  import Empty from "./Empty.svelte";
  import { signData } from "../lib/crypto";

  export let caseId: string;
  export let clinicId: string;
  export let patientId: string;
  export let clinicianId: string;

  type PreferredDrugs = {
    message: string;
    selected: string[];
  };

  // NOTE: we only support a single drug selection at the moment
  export let preferredDrugs: PreferredDrugs;

  let loading = false;
  let submitted = false;
  let drugs: Drug[] = [];
  let dosages: Dosage[] = [];

  let selectedDrugId: string = preferredDrugs?.selected[0] ?? null;
  let selectedDosageConcentration: string;
  let prescriptionDirections: string;
  let pharmacy: Pharmacy | null;
  let pharmacyError: string;

  let signatureFingerprint: string;

  async function load() {
    drugs = (await getDrugs(patientId)) || [];

    if (!preferredDrugs.selected) {
      selectedDrugId = drugs[0].id!;
    }

    await fetchPharmacy();
  }

  async function submission() {
    loading = true;

    const msg = JSON.stringify({
      patientId,
      clinicianId,
      drugId: selectedDrugId,
      dosage: selectedDosageConcentration,
      directions: prescriptionDirections,
      date: new Date().toISOString(),
    });

    const { signature, fingerprint } = await signData(msg);
    console.log(signature, fingerprint);

    signatureFingerprint = fingerprint;
    submitted = true;
    loading = false;
  }

  $: drugOptions = drugs.map((drug) => ({
    id: drug.id!,
    value: drug.name!,
  }));

  $: dosages = drugs.find((drug) => drug.id == selectedDrugId)?.dosages || [];

  $: dosageOptions = dosages
    .sort((left, right): number => {
      return left.concentrationLvl! - right.concentrationLvl!;
    })
    .map((dosage) => ({
      id: dosage.concentration!,
      value: dosage.concentration!,
    }));

  $: dosage = dosages.find(
    (dosage) => dosage.concentration == selectedDosageConcentration
  );

  $: prescriptionDirections = dosage?.directions ?? "";

  async function fetchPharmacy() {
    pharmacyError = "";
    pharmacy = (await getPharmacy(clinicId, patientId, selectedDrugId)) ?? null;
    if (!pharmacy) {
      pharmacyError =
        "We were unable to find a mail order pharmacy for the given patient and selected medication";
    }
    // TODO: show error if no pharmacy is found
  }

  load();
</script>

<section>
  {#if !submitted}
    <Header title="Prescription">
      {#if preferredDrugs}
        <Alert message={preferredDrugs.message} />
      {/if}
    </Header>

    <div class="grid grid-cols-3 gap-x-6 gap-y-4">
      <div class="col-span-3">
        <label for="country" class="block text-sm/6 font-medium text-gray-900">
          Medication
        </label>
        <div class="mt-2 grid grid-cols-1">
          <Select
            options={drugOptions}
            bind:value={selectedDrugId}
            on:change={fetchPharmacy}
          />
        </div>
      </div>
      <div class="col-span-1">
        <label for="country" class="block text-sm/6 font-medium text-gray-900">
          Dosage
        </label>
        <div class="mt-2 grid grid-cols-1">
          <Select
            options={dosageOptions}
            bind:value={selectedDosageConcentration}
          />
        </div>
      </div>
      <div class="col-span-2 flex flex-col">
        <label for="country" class="block text-sm/6 font-medium text-gray-900">
          Direction
        </label>
        <div
          class="mt-2 text-sm text-gray-500 flex-1 flex flex-col justify-center"
        >
          <textarea
            rows="4"
            class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            bind:value={prescriptionDirections}
            >{prescriptionDirections}</textarea
          >
        </div>
      </div>
    </div>
  {/if}

  {#if submitted}
    <table class="w-full text-left">
      <thead class="bg-white">
        <tr class="border-b">
          <th
            scope="col"
            class="relative isolate py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Medication
          </th>
          <th
            scope="col"
            class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
            >Dosage</th
          >
          <th
            scope="col"
            class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell"
            >Direction</th
          >
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="relative py-4 pr-3 text-sm font-medium text-gray-900">
            {drugs.find((drug) => drug.id == selectedDrugId)?.name}
          </td>
          <td class="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
            {dosage?.concentration}
          </td>
          <td class="hidden px-3 py-4 text-sm text-gray-500 md:table-cell">
            {prescriptionDirections}
          </td>
        </tr>
      </tbody>
    </table>
  {/if}
</section>

<section>
  <Header title="Pharmacy">
    {#if pharmacy}
      <Alert
        message="A mail order pharmacy is automatically selected based on the patient profile and selected medication"
        type="success"
      />
    {/if}
  </Header>

  {#if pharmacyError}
    <div class="mt-4">
      <Alert
        message="{pharmacyError}. If you think this is a bug please contact support@wellsync.com"
        type="error"
      />
    </div>
  {/if}

  {#if !pharmacy && !pharmacyError}
    <Empty
      message="A mail order pharmacy will automatically be selected based on the patient profile and selected medication."
    />
  {/if}

  {#if pharmacy}
    <dl class="mt-4 text-sm/6 grid grid-cols-2 text-gray-500 gap-x-6">
      <div class="grid grid-cols-[repeat(2,auto)] items-center">
        <dt class="font-medium text-gray-900">Name</dt>
        <dd>{pharmacy?.name}</dd>
        <dt class="font-medium text-gray-900">Phone</dt>
        <dd>{pharmacy?.phone}</dd>
        <dt class="font-medium text-gray-900">Fax</dt>
        <dd>{pharmacy?.fax}</dd>
        <dt class="font-medium text-gray-900">Email</dt>
        <dd>
          <a class="underline" href="mailto:{pharmacy?.email}">
            {pharmacy?.email}
          </a>
        </dd>
      </div>

      <div>
        <dt class="font-medium text-gray-900">Address</dt>
        <dd>
          {pharmacy?.addressLineOne}{#if pharmacy?.addressLineTwo}, {pharmacy.addressLineTwo}{/if}
          <br />
          {pharmacy?.city}<br />
          {pharmacy?.administrativeArea}
          {pharmacy?.zip}<br />
        </dd>
      </div>
    </dl>
  {/if}
</section>

<div class="mt-2">
  {#if !submitted}
    <Button on:click={submission} {loading}>Submit Order</Button>
  {/if}

  {#if submitted}
    <Alert
      message="The prescription has been successfully submitted and securely signed. Signature: {signatureFingerprint.slice(
        0,
        10
      )}"
      type="signed"
    />
  {/if}
</div>
