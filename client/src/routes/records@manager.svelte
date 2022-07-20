<script lang="ts">
  import Table from "../components/Table.svelte";
  import { onMount } from "svelte";
  import { getRequest } from "../request";
  import type { RoomRecord } from "../types";
  import RecordsFilters from "../components/records/RecordsFilters.svelte";
  import CreateRecord from "../components/records/CreateRecord.svelte";
  import RecordsModal from "../components/records/RecordsModal.svelte";
  import Icon from "@iconify/svelte";

  const columns = ["Codigo", "Habitacion", "Fecha inicio", "Fecha termino", "Estado", "Responsable", "Acompañantes"];
  let records: RoomRecord[] = [];
  let record = {} as RoomRecord;
  let action = "";
  let visible = false;

  onMount(() => {
    getRequest<RoomRecord[]>("records")
      .then(res => records = res)
      .catch(err => console.log(err));
  });

  const handleActionClick = (r: RoomRecord, act: string) => {
    record = r;
    action = act;
    visible = true;
  };

  const handleDelete = (r: RoomRecord) => {
    const updated = records.filter(record => record.code !== r.code);
    records = [...updated];
    visible = false;
  }

  const handleUpdate = (r: RoomRecord) => {
    const updated = records.map(record => {
      if (record.code === r.code) {
        return r;
      }
      return record;
    });
    records = [...updated];
    visible = false;
  }
</script>

<div class="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9 mt-[6px]">
  <RecordsModal {visible} {record} {action} on:close={() => visible = false} on:delete={e => handleDelete(e.detail)} on:update={e => handleUpdate(e.detail)} />
  <Table {columns} >
    {#each records as record }
      <tr class="bg-slate-100">
        <td class="text-center p-2">{record.code}</td>
        <td class="text-center p-2">{record.room}</td>
        <td class="text-center p-2">{record.start}</td>
        <td class="text-center p-2">{record.end}</td>
        <td class="text-center p-2">{record.active ? 'activa' : 'no activa'}</td>
        <td class="text-center p-2">{record.responsible}</td>
        <td class="text-center p-2">
          {#if record.companions}
            {#each record.companions as companion}
            <p class="">{companion}</p>
            {/each}
          {/if}
        </td>
        <td class="p-3 flex mt-1 justify-center">
          <button on:click={() => handleActionClick(record, "update")} class="mx-2"><Icon icon="bi:pen-fill" /></button>
          <button on:click={() => handleActionClick(record, "delete")} class="mx-2"><Icon icon="bxs:trash-alt" /></button>
        </td>
      </tr>
    {/each}
  </Table>
</div>
<div class="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen mb-1 p-3">
  <RecordsFilters on:submit={e => records = e.detail} />
  <CreateRecord on:submit={e => records = [e.detail, ...records]} />
</div>
