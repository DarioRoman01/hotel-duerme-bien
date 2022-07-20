<script lang="ts">
  import { patchRequest } from "../../request";
  import { createEventDispatcher } from "svelte";
  import type { Client } from "../../types";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";
  import Input from "../Input.svelte";

  const dispatchUpdate = createEventDispatcher<{ update: Client }>();
  export let client: Client;
  let reputation = client.reputation.toString();
  let error = "";
  let showError = false;

  const handleSubmit = () => {
    // validate that the reputation is a number
    if (isNaN(Number(reputation))) {
      error = "La reputación debe ser un número";
      showError = true;
      return;
    }

    // validate that the reputation is between 0 and 100
    if (Number(reputation) < 0 || Number(reputation) > 100) {
      error = "La reputación debe estar entre 0 y 100";
      showError = true;
      return;
    }

    // validate that the client name is not empty
    if (client.name.trim() === "") {
      error = "El nombre del cliente no puede estar vacio";
      showError = true;
      return;
    }

    // send the request to the server
    client.reputation = parseInt(reputation);
    patchRequest<Client>(client, `clients`)
      .then(c => dispatchUpdate("update", c))
      .catch(err => {
        error = err.message;
        showError = true;
      });
  }
</script>

<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Input id="updateName" placeholder="Nombre" type="text" bind:value={client.name} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Input id="updateReputation" placeholder="Reputacion" type="text" bind:value={reputation} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Button text="Actualizar" click={handleSubmit}/>
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <ErrorAlert message={error} show={showError} />
  </div>
</div>
