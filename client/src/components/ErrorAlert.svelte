<script lang="ts">
  import { fade } from 'svelte/transition';
  export let message: string;
  export let show: boolean;
  export let padding: boolean = true;
</script>

{#if show}
  <div in:fade='{{duration: 500}}' out:fade='{{duration: 500}}' class={`${padding ? "p-2 w-full" : ""} w-full`}>
    <p class="text-sm font-bold p-2 bg-red-600 text-slate-100 rounded-md">{message}</p>
  </div>
{/if}