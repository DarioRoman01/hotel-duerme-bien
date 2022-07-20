<script lang="ts">
  import type { Client } from "../../types";
  import { checkValue } from "../../utils";
  import { createEventDispatcher } from "svelte";
  import Dropdown from "../Dropdown.svelte";
  import Input from "../Input.svelte";
  import { postRequest } from "../../request";
  import Select from "../Select.svelte";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";

  let hosted = "";
  let name = "";
  let room = "";
  let error = "";
  let showErr = false;
  
  const dispatch = createEventDispatcher<{submit: Client[]}>();

  //function to create a object with the values of the inputs and send it to the server
  const handleSubmit = () => {
    showErr = false;
    const filters = {
      hosted: hosted != '' ? hosted === 'Hospedado' ? true : false : null,
      name: checkValue(name),
      room: checkValue(room)
    }    

    postRequest<Client[]>(filters, 'clients')
    .then(res => dispatch('submit', res))
    .catch(err => {
      error = err.message;
      showErr = true;
    });
  };
</script>

<Dropdown title="Filtros">
  <!-- input to filter by name  -->
  <div class="mb-3 p-2 w-full">
    <Input id="name" placeholder="Nombre" bind:value={name} type="text" />
  </div>
  <!-- input to filter by room -->
  <div class="mb-3 p-2 w-full">
    <Input id="room" placeholder="Habitacion" bind:value={room} type="text" />
  </div>
  <!-- input to filter by hosted using custom Select component -->
  <div class="mb-3 p-2 w-full">
    <Select title="Hospedado?" options={["Hospedado", "No Hospedado"]} bind:value={hosted} />
  </div>
  <!-- button to submit the values -->
  <div class="mb-3 p-2 w-full">
    <Button text="Filtrar" click={handleSubmit} />
  </div>
  <ErrorAlert show={showErr} message={error} />
</Dropdown>