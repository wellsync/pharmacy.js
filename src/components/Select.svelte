<script lang="ts">
  type Option = {
    id: string;
    value: string;
  };

  export let options: Option[] = [];
  export let disabled = false;
  export let value: any;

  $: if (options.length > 0 && !options.find((option) => option.id === value)) {
    value = options[0].id;
  }
</script>

<select
  id="country"
  name="country"
  autocomplete="country-name"
  class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
  class:cursor-not-allowed={disabled}
  bind:value
  on:change
  on:input
  on:contextmenu
  {disabled}
>
  {#each options as option}
    <option value={option.id}>{option.value}</option>
  {/each}
</select>
<svg
  class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
  viewBox="0 0 16 16"
  fill="currentColor"
  aria-hidden="true"
  data-slot="icon"
>
  <path
    fill-rule="evenodd"
    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
    clip-rule="evenodd"
  />
</svg>
