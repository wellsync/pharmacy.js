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
  import { importPrivateKey, signData } from "../lib/crypto";

  export let patientId: string;
  export let clinicianId: string;
  export let preferredDrugId: string = "";

  let loading = false;
  let submitted = false;
  let drugs: Drug[] = [];
  let dosages: Dosage[] = [];

  let selectedDrugId: string = preferredDrugId ?? null;
  let selectedDosageConcentration: string;
  let prescriptionDirections: string;
  let pharmacy: Pharmacy | null;
  let pharmacyError: string;

  let signatureFingerprint: string;

  async function load() {
    drugs = (await getDrugs(patientId)) || [];

    if (!preferredDrugId) {
      selectedDrugId = drugs[0].id!;
    }

    await fetchPharmacy();
  }

  async function submission() {
    loading = true;

    const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC6fY20I4ZnRMZQ
rgvNjc0JtAim3nosUQmEE8dotmiE9Y3vSAs+u3G6/mHLk4ZOvicstnvkGmmkabfs
FOYJsmtg6xQiaKbADYHmK8WGSoJGYTgS8cDmKhmdLgw1gK4/f12PuSHPNh687yAm
3iyYvwLPF9EecKOhwnSU20HOMjtVqOtE5Dh3x1ZYqPkfLWqzj3w844Q9B10HpuNQ
juVS3qkST3Inp7O9ub1bCxwuIn+SiG3NssKRfLqXNLdy8Ghtfzepy0lGO4Jt1hZm
MXqKRAadryOfStJ2A9XQS1HT0/KCo0tHMC7Mv2H+PkOwwmHSJZKXcepy2bnLIYGf
4qHPA4M1AgMBAAECggEAHpMD/uMOH3Mikkqei8IyOeOGwZja7dYRWdKGUFALfbTm
YrLsiQnhIPegn+gdTl6VfJqkYCbGaBqe+TkJ59AVE6wmvmdq4zSztcE6XoRrrE83
CsAQ0ItZbLAGd2UT7Dwc4jnHZbnpOy93FXg6VoaGVt6APd3YreX8CAWUWdJZcPb6
/VvqQMkktLGid4cjwxqfAKAcNeJXtSEp+vlVH+F3k4kY/vtU8C0XvIJx24JmDsJy
RF7+5BMfZao70+e+HCDpkevXVRPd0xNbypVazJ279caRck6RkBYEhuOMxWTdYM3m
sdSpPueN93Lnfua6QMPtBMsN1c4LqXC9sXxOpIdjpwKBgQD3UvqcKVPV1MYpeO/6
9/R89jrMTlKxV9auXVv6PALCJMdQsI6PQpU9XWFDMJZkJb0Ifuz5STwtH5+TneKM
I+rRw/HDfmM9r79FfyHJACuvQK/e16RFOneAAri5t93sUsE+EC1aWmnAGiBXbqJN
DgqMyAIplX67VCnCPAL50TpNMwKBgQDBCEaQyyvtsMEhCR2uY8j6pdqOBbuBrpPR
HXucCn202GHFFuFkJ/0U6etQKHCuf/+P/BPk3wkcHoqJmjCiZ6XSdzQFKDqNv0m5
R8Sk2ksHkbxS5ly0pjdF7NSpBvFxbKs0MF3zfZLC7Qr4czOsqGpSPUX4nwdyy9Ou
/gprzGrd9wKBgGLBvpJGqlQzDyGWSfUjt3uCcr4L9FceJPohC04jUlKljvT4WyR3
SNJlDCZhK1w3+YB/9i4ggSfffb/bBpBA803peQs/127VU4HzntD9AXSMVu2bm9uM
2hTCgXKfKb1o2gLnQMTYX2u2wv1GjwZHugy2/K4QJLe2hqopfmK0mhwjAoGBALqO
7/xCkAsh2BXAhLIleHleT9MRET5tZiklsHCH5yQgOKXNzjoJN9y9kxIec4EC7hDP
VL7PHDPUBJqmrbhYKfg2As21KpoSNQNfrFqTKw5+uB76ysBBIIxxLrrJnhG8L965
nCOWyn+frwmd9WQ6RL+EvpphwEYfXk/y8EltAB/TAoGBAOhReU0+WLMeLAfok/yl
0Vjzwye4/Aj+MnWvDJf2EmT7eP4uW5WTkh3KJN4eaurkyBrPIT0xT2kSwVY1uDei
ZtMLENbhC57DK5sLs9R88MdcPrZecHvkfFiVvlIU0RxYXoN+Dx4M3/3wxNyD2EdZ
ZW2QGU2qkCxID9F4pxD24s3U
-----END PRIVATE KEY-----`;

    const msg = JSON.stringify({
      patientId,
      clinicianId,
      drugId: selectedDrugId,
      dosage: selectedDosageConcentration,
      directions: prescriptionDirections,
      date: new Date().toISOString(),
    });

    const key = await importPrivateKey(privateKey);
    const { signature, fingerprint } = await signData(key, msg);
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
    pharmacy = (await getPharmacy(patientId, selectedDrugId)) ?? null;
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
      {#if preferredDrugId}
        <Alert
          message="The medication was chosen based on the patient’s preference and cannot be changed"
        />
      {/if}
    </Header>

    <div class="grid grid-cols-3 gap-x-6 gap-y-4">
      <div class="col-span-3">
        <label for="country" class="block text-sm/6 font-medium text-gray-900">
          Medication
        </label>
        <div class="mt-2 grid grid-cols-1">
          <Select
            disabled={preferredDrugId != ""}
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
