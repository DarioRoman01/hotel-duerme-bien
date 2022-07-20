<script lang="ts">
  import type { ModalEvents, RoomRecord } from "src/types";
  import { beforeUpdate, createEventDispatcher } from "svelte";
  import Modal from "../Modal.svelte";
  import UpdateRecord from "./UpdateRecord.svelte";
  import DeleteRecord from "./DeleteRecord.svelte";

  const dispatch = createEventDispatcher<ModalEvents<RoomRecord>>();
  export let visible: boolean;
  export let action: string;
  export let record: RoomRecord;
  let title = "";
  
  beforeUpdate(() => {
    title = action === "update" ? `Actualizar actualizar registro ${record.code}` : `Eliminar registro ${record.code}`;
  })
</script>

<Modal {title} {visible} on:close={() => dispatch("close")}>
  {#if action === "update"}
    <UpdateRecord {record} on:update={(e) => dispatch("update", e.detail)} />
  {:else}
    <DeleteRecord {record} on:close={() => dispatch("close")} on:delete={(e) => dispatch("delete", e.detail)} />
  {/if}
</Modal>
