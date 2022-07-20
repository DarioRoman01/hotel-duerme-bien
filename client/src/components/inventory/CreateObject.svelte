<script lang="ts">
  // @ts-nocheck
  import Input from "../Input.svelte";
  import { checkValue } from "../../utils";
  import { createEventDispatcher } from "svelte";
  import type { RoomObject } from "../../types";
  import { postRequest } from "../../request";
  import Dropdown from "../Dropdown.svelte";
  import Select from "../Select.svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";

  const options = ['cama', 'espejo', 'velador', 'televisor', 'silla', 'control', 'aire_acondicionado', 'sabanas', 'frasadas', 'toallas', 'almohadas', 'nevera', 'caja_fuerte', 'telefono_servicio']

  let room = "";
  let type = "";
  let state = [10];
  let error = "";
  let showErr = false;

  const dispatch = createEventDispatcher<{ submit: RoomObject }>();

  const handleSubmit = () => {
    showErr = false;

    // check value of all inputs and set error message and show error message if needed
    if(!checkValue(room)) {
      error = "El campo habitación es requerido";
      showErr = true;
    } else if(!checkValue(type)) {
      error = "El campo tipo es requerido";
      showErr = true;
    } else {
      showErr = false;
      error = "";
    }

    // if no error, send request to server
    if(!showErr) {
      const obj = {
        room: room,
        type: type,
        state: state[0]
      };

      postRequest<RoomObject>(obj, 'inventory/create')
      .then(res => dispatch('submit', res))
      .catch(err => {
        error = err.message;
        showErr = true;
      });
    }
  }

</script>

<Dropdown title="Agregar Objeto">
  <!-- input to room  -->
  <div class="mb-3 p-2 w-full">
    <Input id="newRoom" placeholder="Habitacion" bind:value={room} type="text" />
  </div>
  <!-- Select input to orientation options = norte, sur, este, oeste -->
  <div class="p-2 w-full">
    <Select title='Tipo' {options} bind:value={type} />
  </div>
  <div class="mb-3 p-2 w-full">
    <p class="text-sm font-bold p-1">Estado Objeto</p>
    <RangeSlider pips={true} all='label' range bind:values={state} max={10} min={1} step={1} />
  </div>
  <!-- black submit button -->
  <div class="mb-3 p-2 w-full">
    <Button text="Agregar" click={handleSubmit} />
  </div>
  <ErrorAlert show={showErr} message={error} />
</Dropdown>