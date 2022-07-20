<script lang="ts">
  import { postRequest } from "../../request";
  import Dropdown from "../Dropdown.svelte";
  import Input from "../Input.svelte";
  import type { Client } from "../../types";
  import { createEventDispatcher } from "svelte";
  import { checkValue, validateRut } from "../../utils";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";

  const dispatch = createEventDispatcher<{ submit: Client }>();
  let name = "";
  let rut = "";

  let error = "";
  let showErr = false;

  // function that create a object with the values of the inputs and send it to the server
  const handleSubmit = () => {
    // check the value of the rut and the name 
    showErr = false;
    if (!checkValue(name)) {
      error = "El nombre es requerido";
      showErr = true;
    } else if (!checkValue(rut)) {
      error = "El rut es requerido";
      showErr = true;
    } else if (!validateRut(rut)) {
      error = "El rut no es valido debe tener puntos y guion";
      showErr = true;
    } else {
      showErr = false;
      error = "";
    }

    // if no error, send request to server
    if (!showErr) {
      postRequest<Client>({name: name, rut: rut}, "clients/create")
      .then(res => dispatch("submit", res))
      .catch(err => {
        error = err.message;
        showErr = true;
      });
    }
  };

</script>

<Dropdown title="Agregar Cliente">
  <div class="mb-3 p-2 w-full">
    <Input id="name" placeholder="Nombre" bind:value={name} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="rut" placeholder="Rut" bind:value={rut} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Button text="Agregar" click={handleSubmit} />
  </div>
  <ErrorAlert show={showErr} message={error} />
</Dropdown>