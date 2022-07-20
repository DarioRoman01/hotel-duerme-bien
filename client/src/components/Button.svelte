<script lang="ts">
  export let text: string;
  export let click: () => void;
</script>

<button type="button" on:click={click} class="bg-slate-900 hover:bg-slate-700 text-slate-100 transition-all rounded-md p-2 font-bold w-full active:transform active:translate-y-1">
  {text}
</button>

