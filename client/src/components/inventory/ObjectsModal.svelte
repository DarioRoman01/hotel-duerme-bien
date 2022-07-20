<script lang="ts">
  import type { ModalEvents, RoomObject } from "../../types";
  import { beforeUpdate, createEventDispatcher } from "svelte";
  import Modal from "../Modal.svelte";
  import UpdateObject from "./UpdateObject.svelte";
  import DeleteObject from "./DeleteObject.svelte";

  const dispatch = createEventDispatcher<ModalEvents<RoomObject>>();
  
  export let object: RoomObject;
  export let visible: boolean;
  export let action: string;
  let title = "";

  beforeUpdate(() => {
    title = action === "update" ? `Actualizar ${object.type} ${object.code}` : `Eliminar ${object.type} ${object.code}`;
  })
</script>

<Modal {title} {visible} on:close={() => dispatch("close")}>
  {#if action === "update"}
    <UpdateObject {object} on:update={(e) => dispatch("update", e.detail)} />
  {:else}
    <DeleteObject {object} on:close={() => dispatch("close")} on:delete={(e) => dispatch("delete", e.detail)} />
  {/if}
</Modal>