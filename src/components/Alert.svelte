<script lang="ts">
  export let type: "success" | "info" | "error" | "signed" = "info";
  export let message: string;

  const icons = [
    {
      type: "info",
      svg: `<svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" /></svg>`,
      color: {
        background: "bg-blue-50",
        icon: "text-blue-400",
        text: "text-blue-700",
      },
    },
    {
      type: "error",
      svg: `<svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" /></svg>`,
      color: {
        background: "bg-red-50",
        icon: "text-red-400",
        text: "text-red-700",
      },
    },
    {
      type: "success",
      svg: `<svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon"><path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" /></svg>`,
      color: {
        background: "bg-green-50",
        icon: "text-green-400",
        text: "text-green-700",
      },
    },
    {
      type: "signed",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5"><path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" /></svg>`,
      color: {
        background: "bg-green-50",
        icon: "text-green-400",
        text: "text-green-700",
      },
    },
  ];

  const icon = icons.find((icon) => icon.type === type) || icons[0];
</script>

<div class="rounded-md {icon.color.background} p-2">
  <div class="flex items-center">
    <span class={icon.color.icon}>
      {@html icon.svg}
    </span>
    <div class="ml-3 flex-1 md:flex md:justify-between">
      <p class="text-xs {icon.color.text}">
        {message}
      </p>
    </div>
  </div>
</div>
