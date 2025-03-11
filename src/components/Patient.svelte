<script lang="ts">
  import type { Patient } from "../lib/api";
  import Alert from "./Alert.svelte";
  import Header from "./Header.svelte";

  export let patient: Patient;
</script>

<Header title="Patient">
  <Alert message="The patient information is managed externally" />
</Header>

<dl class="mt-4 text-sm/6 grid grid-cols-2 text-gray-500 gap-x-6">
  <div class="grid grid-cols-[repeat(2,auto)] items-center">
    <dt class="font-medium text-gray-900">Name</dt>
    <dd>{patient?.firstName} {patient?.lastName}</dd>
    <dt class="font-medium text-gray-900">DoB</dt>
    <dd class="w-2/3">
      {#if patient?.dateOfBirth}
        {new Date(patient?.dateOfBirth ?? "").toLocaleDateString("en-us")}
      {/if}
    </dd>
    <dt class="font-medium text-gray-900">Phone</dt>
    <dd>{patient?.phone}</dd>
    <dt class="font-medium text-gray-900">Email</dt>
    <dd>
      <a class="underline" href={`mailto:${patient?.email}`}>
        {patient?.email}
      </a>
    </dd>
  </div>

  <div>
    <dt class="font-medium text-gray-900">Address</dt>
    <dd>
      {patient?.addressLineOne}{#if patient?.addressLineTwo}, {patient.addressLineTwo}{/if}
      <br />
      {patient?.city}<br />
      {patient?.administrativeArea}
      {patient?.zip}<br />
    </dd>
  </div>
</dl>
