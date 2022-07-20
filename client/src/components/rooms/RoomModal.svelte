<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from "svelte";
  import type { ModalEvents, Room } from "../../types";
  import Modal from "../Modal.svelte";
  import DeleteRoom from "./DeleteRoom.svelte";
import RoomDetail from "./RoomDetail.svelte";
  import UpdateRoom from "./UpdateRoom.svelte";

  const dispatch = createEventDispatcher<ModalEvents<Room>>();

  export let action: string;
  export let showModal: boolean;
  export let room: Room;
  let title = "";

  beforeUpdate(() => {
    if (action === "create") {
      title = `Detalle habitación ${room.code}`;
    } else if (action === "update") {
      title = `Actualizar habitación ${room.code}`;
    } else if (action === "delete") {
      title = `Eliminar habitación ${room.code}`;
    }
  })
  
</script>
  
<Modal {title} visible={showModal} on:close={() => dispatch("close")}>
  {#if action === "create"}
    <RoomDetail {room} />
  {:else if action === "update"}
    <UpdateRoom {room} on:update={(e) => dispatch("update", e.detail)} />
  {:else if action === "delete"}
    <DeleteRoom {room} on:close={() => dispatch("close")} on:delete={(e) => dispatch("delete", e.detail)} />
  {/if}
</Modal>