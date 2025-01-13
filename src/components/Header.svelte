<script lang="ts">
  export let title: string;
</script>

<div class="border-b border-gray-200 mb-4 py-2 flex items-end">
  <h2 class="text-base/7 font-semibold text-gray-900 flex-1">{title}</h2>
  <slot />
</div>
