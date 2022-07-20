<script lang="ts">
  import Input from "../Input.svelte";
  import { checkValue } from "../../utils";
  import { createEventDispatcher } from 'svelte';
  import type { Room } from "../../types";
  import { postRequest } from "../../request";
  import Dropdown from "../Dropdown.svelte";
  import Select from "../Select.svelte";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";

  const dispatch = createEventDispatcher<{submit: Room}>();
  let id = "";
  let capacity = "";
  let orientation = "";

  let error = "";
  let showErr = false;

  const handleSubmit = () => {
    showErr = false;

    // check if the capacity is a number
    if (Number.isNaN(parseInt(capacity))) {
      error = "Capacidad debe ser un numero";
      showErr = true;
      return;
    }

    // check value of all inputs and set error message and show error message if needed
    if (!checkValue(id)) {
      error = "El id es requerido";
      showErr = true;
    } else if (!checkValue(capacity)) {
      error = "La capacidad es requerida";
      showErr = true;
    } else if (!checkValue(orientation)) {
      error = "La orientación es requerida";
      showErr = true;
    } else {
      showErr = false;
      error = "";
    }

    // if no error, send request to server
    if (!showErr) {
      const room = {
        code: checkValue(id),
        capacity: parseInt(capacity),
        orientation: checkValue(orientation)
      };

      postRequest<Room>(room, 'rooms/create')
      .then(res => dispatch('submit', res))
      .catch(err => {
        error = err.message;
        showErr = true;
      });
    }
  }
</script>

<Dropdown title="Crear Habitacion">
  <div class="mb-3 p-2 w-full">
    <Input id="roomId" placeholder="Habitacion" bind:value={id} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="newcapacity" placeholder="Capacidad" bind:value={capacity} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Select title='Orientacion' options={['norte', 'sur', 'este', 'oeste']} bind:value={orientation} />
  </div>
  <!-- black submit button -->
  <div class="mb-3 p-2 w-full">
    <Button text="Agregar" click={handleSubmit} />
  </div>
  <ErrorAlert show={showErr} message={error} />
</Dropdown>