<script lang="ts">
  export let columns: string[];
</script>

<div class=" bg-slate-100 p-3 min-h-full w-full">
  <div class="overflow-auto lg:overflow-visible">
    <table class="table text-slate-900 border-separate space-y-6 text-md w-full">
      <thead class="bg-white text-slate-900">
        <tr>
          {#each columns as column}
            <th class="text-center p-2">{column}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</div>
<style>
  :global(.table) {
    border-spacing: 0 15px;
  }

  :global(.table tr) {
    border-radius: 6px;
    outline: auto;
  }

  :global(tr td:last-child) {
		border-radius: 0 .625rem .625rem 0;
  }

  :global(tr th:first-child) {
    border-radius: .625rem 0 0 .625rem;
  }

  :global(tr td:first-child) {
    border-radius: .625rem 0 0 .625rem;
  }

  :global(tr th:last-child) {
    border-radius: 0 .625rem .625rem 0;
  }
</style>