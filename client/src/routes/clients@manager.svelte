<script lang="ts">
  import type { Client } from "../types";
  import { getRequest } from "../request";
  import { onMount } from "svelte";
  import Table from "../components/Table.svelte";
  import ClientsFilters from "../components/clients/ClientsFilters.svelte";
  import CreateClient from "../components/clients/CreateClient.svelte";
  import Icon from "@iconify/svelte";
  import ClientsModal from "../components/clients/ClientsModal.svelte";

  let columns = ["Rut", "Nombre", "Reputacion", "Tipo", "Habitacion"];
  let clients: Client[] = [];
  let client = {} as Client;
  let action = "";
  let visible = false;

  onMount(() => {
    getRequest<Client[]>("clients")
      .then(res => clients = res)
      .catch(err => console.log(err));
  });

  const handleActionClick = (c: Client, act: string) => {
    client = c;
    action = act;
    visible = true;
  };

  const handleDelete = (c: Client) => {
    const updated = clients.filter(client => client.rut !== c.rut);
    clients = [...updated];
    visible = false;
  }

  const handleUpdate = (c: Client) => {
    const updated = clients.map(client => {
      if (client.rut === c.rut) {
        return c;
      }
      return client;
    });
    clients = [...updated];
    visible = false;
  }
</script>

<div class="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9 mt-[6px]">
  <ClientsModal {client} {action} {visible} on:close={() => visible = false} on:delete={e => handleDelete(e.detail)} on:update={e => handleUpdate(e.detail)} />
  <Table {columns} >
    {#each clients as client }
      <tr class="bg-slate-100">
        <td class="text-center p-2">{client.rut}</td>
        <td class="text-center p-2">{client.name}</td>
        <td class="text-center p-2">{client.reputation}</td>
        <td class="text-center p-2">{client.type}</td>
        <td class="text-center p-2">{client.room}</td>
        <td class="p-3 flex mt-1 justify-center">
          <button on:click={() => handleActionClick(client, "update")} class="mx-2"><Icon icon="bi:pen-fill" /></button>
          <button on:click={() => handleActionClick(client, "delete")} class="mx-2"><Icon icon="bxs:trash-alt" /></button>
        </td>
      </tr>
    {/each}
  </Table>
</div>
<div class="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen mb-1 p-3">
  <ClientsFilters on:submit={e => clients = e.detail } />
  <CreateClient on:submit={e => clients = [e.detail, ...clients]} />
</div>