<script lang="ts">
  import { getPatient, type Patient } from "../lib/api";

  import Alert from "./Alert.svelte";
  import Header from "./Header.svelte";

  export let id: string;
  let loading = true;
  let patient: Patient;

  async function load() {
    patient = await getPatient(id);
    loading = false;
  }

  $: skeletonStyleText = loading ? "bg-slate-500 rounded h-4" : "";

  load();
</script>

<Header title="Patient">
  <Alert message="The patient information is managed externally" />
</Header>

<dl
  class="mt-4 text-sm/6 grid grid-cols-2 text-gray-500 gap-x-6"
  class:animate-pulse={loading}
>
  <div class="grid grid-cols-[repeat(2,auto)] items-center">
    <dt class="font-medium text-gray-900">Name</dt>
    <dd class={skeletonStyleText}>{patient?.firstName} {patient?.lastName}</dd>
    <dt class="font-medium text-gray-900">DoB</dt>
    <dd class="{skeletonStyleText} w-2/3">
      {#if patient?.dateOfBirth}
        {new Date(patient?.dateOfBirth ?? "").toLocaleDateString("en-us")}
      {/if}
    </dd>
    <dt class="font-medium text-gray-900">Phone</dt>
    <dd class={skeletonStyleText}>{patient?.phone}</dd>
    <dt class="font-medium text-gray-900">Email</dt>
    <dd class={skeletonStyleText}>
      <a class="underline" href={`mailto:${patient?.email}`}>
        {patient?.email}
      </a>
    </dd>
  </div>

  <div>
    <dt class="font-medium text-gray-900">Address</dt>
    <dd>
      {#if loading}
        <p class="{skeletonStyleText} mt-1"></p>
        <p class="{skeletonStyleText} mt-2 w-2/3"></p>
        <p class="{skeletonStyleText} mt-2 w-1/3"></p>
      {/if}
      {#if !loading}
        {patient?.addressLineOne}{#if patient?.addressLineTwo}, {patient.addressLineTwo}{/if}
        <br />
        {patient?.city}<br />
        {patient?.administrativeArea}
        {patient?.zip}<br />
      {/if}
    </dd>
  </div>
</dl>
