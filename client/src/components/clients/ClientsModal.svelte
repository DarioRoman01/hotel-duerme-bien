<script lang="ts">
  import { beforeUpdate, createEventDispatcher } from "svelte";
  import type { Client, ModalEvents } from "../../types";
  import Modal from "../Modal.svelte";
  import UpdateClient from "./UpdateClient.svelte";
  import DeleteClient from "./DeleteClient.svelte";

  const dispatch = createEventDispatcher<ModalEvents<Client>>();
  
  export let client: Client;
  export let action: string;
  export let visible: boolean;
  let title = "";

  beforeUpdate(() => {
    if (action === "update") {
      title = `Actualizar cliente ${client.rut}`;
    } else {
      title = `Eliminar cliente ${client.rut}`;
    }
  })
</script>

<Modal {title} {visible} on:close={() => dispatch("close")}>
  {#if action === "update"}
    <UpdateClient {client} on:update={(e) => dispatch("update", e.detail)} />
  {:else}
    <DeleteClient {client} on:close={() => dispatch("close")} on:delete={(e) => dispatch("delete", e.detail)} />
  {/if}
</Modal>