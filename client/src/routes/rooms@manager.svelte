<script lang="ts">
  import Table from "../components/Table.svelte";
  import RoomFilters from "../components/rooms/RoomFilters.svelte";
  import CreateRoom from "../components/rooms/CreateRoom.svelte";
  import { onMount } from "svelte";
  import { getRequest } from "../request";
  import type { Room } from "../types";
  import Icon from '@iconify/svelte';
  import RoomModal from "../components/rooms/RoomModal.svelte";

  const columns = ["Codigo", "Capacidad", "Orientacion", "Estado", "Inventario", "Acciones"];
  let rooms: Room[] = [];
  let room: Room = {} as Room;
  let action = "";
  let showModal: boolean = false;

  onMount(() => {
    getRequest<Room[]>("rooms")
      .then(res => rooms = res)
      .catch(err => console.log(err));
  });

  // handle the actions click section setting the action, rooom and showing the modal
  const handleActionCLick = (act: string, r: Room) => {
    room = r;
    action = act;
    showModal = true;
  };

  // delete the delete room in the rooms array to avoid calling the api again
  const handleDelete = (r: Room) => {
    const updated = rooms.filter(room => room.code !== r.code);
    rooms = [...updated];
    showModal = false;
  }

  // update the updated room in the rooms array to avoid calling the api again
  const handleUpdate = (r: Room) => {
    const updated = rooms.map(room => {
      if (room.code === r.code) {
        return r;
      }
      return room;
    });
    rooms = [...updated];
    showModal = false;
  };
</script>

<div class="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9 mt-[6px]">
  <RoomModal {room} {action} {showModal} on:close={() => showModal = false} on:delete={(e) => handleDelete(e.detail)} on:update={(e) => handleUpdate(e.detail)} />
  <Table {columns} >
    {#each rooms as room }
      <tr class="bg-slate-100">
        <td class="text-center p-2">{room.code}</td>
        <td class="text-center p-2">{room.capacity}</td>
        <td class="text-center p-2">{room.orientation}</td>
        <td class="text-center p-2">{room.occupancy}</td>
        <td class="text-center p-2">{room.inventory_state}</td>
        <td class="p-3 flex mt-1 justify-center">
          <button on:click={() => handleActionCLick('create', room)} class="mx-2"><Icon icon="fa-solid:eye" /></button>
          <button on:click={() => handleActionCLick('update', room)} class="mx-2"><Icon icon="bi:pen-fill" /></button>
          <button on:click={() => handleActionCLick('delete', room)}  class="mx-2"><Icon icon="bxs:trash-alt" /></button>
        </td>
      </tr>
    {/each}
  </Table>
</div>
<div class="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen mb-1 p-3">
  <RoomFilters on:submit={e => rooms = e.detail} />
  <CreateRoom on:submit={e => rooms = [e.detail, ...rooms]} />
</div>
