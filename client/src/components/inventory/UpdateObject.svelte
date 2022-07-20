<script lang="ts">
  import { patchRequest } from "../../request";
  import { createEventDispatcher } from "svelte";
  import type { RoomObject } from "../../types";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";
  import Input from "../Input.svelte";
  import Select from "../Select.svelte";

  const options = ['cama', 'espejo', 'velador', 'televisor', 'silla', 'control', 'aire_acondicionado', 'sabanas', 'frasadas', 'toallas', 'almohadas', 'nevera', 'caja_fuerte', 'telefono_servicio'];

  const dispatchUpdate = createEventDispatcher<{ update: RoomObject }>();
  export let object: RoomObject;
  let state = object.state.toString();
  let error = "";
  let showError = false;

  const handleSubmit = () => {
    // validate that the object state is not empty
    if (state.trim() === "") {
      error = "El estado del objeto no puede estar vacio";
      showError = true;
      return;
    }

    // validate that the state is a number
    if (isNaN(Number(state))) {
      error = "El estado del objeto debe ser un número";
      showError = true;
      return;
    }

    // validate that the state is between 0 and 10
    if (Number(state) < 0 || Number(state) > 10) {
      error = "El estado del objeto debe estar entre 0 y 10";
      showError = true;
      return;
    }

    // validate that the object type is not empty
    if (object.type.trim() === "") {
      error = "El tipo del objeto no puede estar vacio";
      showError = true;
      return;
    }

    object.state = parseInt(state);
    // send the request to the server
    patchRequest<RoomObject>(object, `inventory`)
      .then(obj => dispatchUpdate("update", obj))
      .catch(err => {
        error = err.message;
        showError = true;
      });
  }
</script>

<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Select {options} selected={object.type} title="Tipo" bind:value={object.type} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Input id="updateState" placeholder="Estado" type="text" bind:value={state} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Button text="Actualizar" click={handleSubmit} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <ErrorAlert show={showError} message={error} />
  </div>
</div>