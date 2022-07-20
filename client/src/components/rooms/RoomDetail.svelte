<script lang="ts">
  import { getRequest } from "../../request";
  import type { Room, RoomDetail } from "../../types";
  import { onMount } from "svelte";
import Loader from "../Loader.svelte";


  export let room: Room;
  let loading = false;
  let detail = {clients: [], objects: []} as RoomDetail;

  onMount(() => {
    loading = true;
    getRequest<RoomDetail>(`rooms/${room.code}`)
      .then(d => {
        detail = d
        loading = false;
      })
      .catch(error => {
        console.error(error)
        loading = false;
      });
  })

</script>

<div class="col-span-12 grid grid-cols-12 gap-5 p-4 max-h-96 overflow-y-scroll no-scrollbar">
  {#if loading}
    <div class="col-span-12 flex items-center justify-center p-2">
      <Loader />
    </div>
  {:else}
    <div class="col-span-12 sm:col-span-6">
      <div class="mb-3 text-2xl font-bold">Objetos:</div>
      {#if detail.objects && detail.objects.length > 0}
        {#each detail.objects as object }
          <div class="mb-3 rounded-md border-2 text-slate-900 border-slate-900 p-2">
            <p class="text-xl font-bold">{object.type}s</p>
            <p class="text-md">Total: {object.total}</p>
            <p class="text-md">Estado: {object.state}</p>
          </div>
        {/each}
      {:else}
        <div class="mb-3 rounded-md border-2 text-slate-900 border-slate-900 p-2">
          <p class="text-xl font-bol">No hay objetos</p>
        </div>
      {/if}
    </div>
    <div class="col-span-12 sm:col-span-6">
      <div class="mb-3 text-2xl font-bold">Clients:</div>
      {#if detail.clients && detail.clients.length > 0}
        {#each detail.clients as client }
          <div class="mb-3 rounded-md border-2 text-slate-900 border-slate-900 p-2">
            <p class="text-xl font-bold">{client.name}</p>
            <p class="text-md">Total: {client.rut}</p>
            <p class="text-md">Estado: {client.type}</p>
          </div>
        {/each}
      {:else}
        <div class="mb-3 rounded-md border-2 text-slate-900 border-slate-900 p-2">
          <p class="text-xl font-bol">No hay clients</p>
        </div>
      {/if}
    </div>
  {/if}
</div>