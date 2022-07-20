<script lang="ts">
  import type { RoomObject } from "../types";
  import Table from "../components/Table.svelte";
  import { onMount } from "svelte";
  import { getRequest } from "../request";
  import ObjectFilters from "../components/inventory/ObjectFilters.svelte";
  import CreateObject from "../components/inventory/CreateObject.svelte";
  import ObjectsModal from "../components/inventory/ObjectsModal.svelte";
  import Icon from "@iconify/svelte";

  let columns = ["Codigo", "Habitacion", "Estado", "Tipo", "Acciones"];
  let objects: RoomObject[] = [];
  let object = {} as RoomObject;
  let visible = false;
  let action = "";

  onMount(() => {
    getRequest<RoomObject[]>("inventory")
      .then(res => objects = res)
      .catch(err => console.log(err));
  });

  const handleActionClick = (o: RoomObject, act: string) => {
    object = o;
    action = act;
    visible = true;
  };

  const handleDelete = (o: RoomObject) => {
    const updated = objects.filter(object => object.code !== o.code);
    objects = [...updated];
    visible = false;
  }

  const handleUpdate = (o: RoomObject) => {
    const updated = objects.map(object => {
      if (object.code === o.code) {
        return o;
      }
      return object;
    });
    objects = [...updated];
    visible = false;
  }

</script>

<div class="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9 mt-[6px]">
  <ObjectsModal {visible} {object} {action} on:close={() => visible = false} on:delete={e => handleDelete(e.detail)} on:update={e => handleUpdate(e.detail)} />
  <Table {columns} >
    {#each objects as object }
      <tr class="bg-slate-100">
        <td class="text-center p-2">{object.code}</td>
        <td class="text-center p-2">{object.room}</td>
        <td class="text-center p-2">{object.state}</td>
        <td class="text-center p-2">{object.type}</td>
        <td class="p-3 flex mt-1 justify-center">
          <button on:click={() => handleActionClick(object, "update")} class="mx-2"><Icon icon="bi:pen-fill" /></button>
          <button on:click={() => handleActionClick(object, "delete")} class="mx-2"><Icon icon="bxs:trash-alt" /></button>
        </td>
      </tr>
    {/each}
  </Table>
</div>
<div class="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen mb-1 p-3">
  <ObjectFilters on:submit={e => objects = e.detail} />
  <CreateObject on:submit={e => objects = [e.detail, ...objects]} />
</div>