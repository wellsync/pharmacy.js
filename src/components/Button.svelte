<script lang="ts">
  export let type: "submit" | "danger" = "submit";
  export let loading = false;

  const styles = [
    {
      type: "submit",
      background: "bg-green-500",
      hover: "hover:bg-green-600",
    },
    {
      type: "danger",
      background: "bg-red-500",
      hover: "hover:bg-red-600",
    },
  ];

  const style = styles.find((icon) => icon.type === type) || styles[0];
</script>

<button
  on:click
  type="button"
  class="inline-flex items-center rounded-md {style.background} {style.hover} px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
>
  {#if loading}
    <svg
      class="animate-spin mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  {/if}
  <slot />
</button>
