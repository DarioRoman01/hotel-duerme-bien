<script lang="ts">
  // @ts-nocheck
  import Dropdown from "../Dropdown.svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import Input from "../Input.svelte";
  import Select from "../Select.svelte";
  import { checkValue } from "../../utils";
  import type { RoomObject } from "../../types";
  import { createEventDispatcher } from "svelte";
  import { postRequest } from "../../request";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";

  let type = ""
  let room = "";
  let minMax = [1, 10];
  let error = "";
  let showErr = false;

  const options = ['cama', 'espejo', 'velador', 'televisor', 'silla', 'control', 'aire_acondicionado', 'sabanas', 'frasadas', 'toallas', 'almohadas', 'nevera', 'caja_fuerte', 'telefono_servicio']
  const dispatch = createEventDispatcher<{ submit: RoomObject[] }>();

  const handleSubmit = () => {
    const filters = {
      type: checkValue(type),
      room: checkValue(room),
      min: minMax[0] === 1 ? null : minMax[0],
      max: minMax[1] === 10 ? null : minMax[1]
    };

    postRequest<RoomObject[]>(filters, "inventory")
      .then(res => dispatch("submit", res))
      .catch(err => {
        showErr = true;
        error = err.message;
      });
  }
</script>

<Dropdown title={'filtros'}>
  <!-- input to filter by room -->
  <div class="mb-3 p-2 w-full">
    <Input id="room" placeholder="Habitacion" bind:value={room} type="text" />
  </div>
  <div class="p-2 w-full">
    <Select title='Tipo' {options} bind:value={type} />
  </div>
  <div class="mb-3 p-2 w-full">
    <p class="text-sm font-bold p-1">Estado Inventario</p>
    <RangeSlider pips={true} all='label' range bind:values={minMax} max={10} min={1} step={1} />
  </div>
  <!-- button to submit the values -->
  <div class="mb-3 p-2 w-full">
    <Button text="Agregar" click={handleSubmit} />
  </div>
  <ErrorAlert show={showErr} message={error} />
</Dropdown>