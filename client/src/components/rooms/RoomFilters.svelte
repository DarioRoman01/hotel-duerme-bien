<script lang="ts">
  // @ts-nocheck
  import Input from "../Input.svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { createEventDispatcher } from 'svelte';
  import { postRequest } from "../../request";
  import type { Room } from "../../types";
  import { checkValue } from '../../utils'
  import Dropdown from "../Dropdown.svelte";
  import Select from "../Select.svelte";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";

  const dispatch = createEventDispatcher<{submit: Room[]}>();
  let capacity = "";
  let state = "";
  let orientation = "";
  let minMax = [1, 10];

  let error = "";
  let showErr = false;

  const handleSubmit = () => {
    showErr = false;
    const filters = {
      estado: checkValue(state),
      orientacion: checkValue(orientation),
      capacidad: checkValue(capacity),
      min: minMax[0] === 1 ? null : minMax[0],
      max: minMax[1] === 10 ? null : minMax[1]
    };

    postRequest<Room[]>(filters, 'rooms')
    .then(res => dispatch('submit', res))
    .catch(err => {
      showErr = true;
      error = err.message;
    });
  }
</script>

<Dropdown title="Filtros">
  <div class="mb-3 p-2 w-full">
    <Input id="capacity" placeholder="Capacidad" bind:value={capacity} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Select title="Estado" options={["libre", "ocupada", "reservada"]} bind:value={state}  />
  </div>
  <div class="mb-3 p-2 w-full">
    <Select title='Orientacion' options={['norte', 'sur', 'este', 'oeste']} bind:value={orientation} />
  </div>
  <div class="mb-3 p-2 w-full">
    <p class="text-sm font-bold p-1">Estado Inventario</p>
    <RangeSlider pips={true} all='label' range bind:values={minMax} max={10} min={1} step={1} />
  </div>
  <!-- black submit button -->
  <div class="mb-3 p-2 w-full">
    <Button text="Filtrar" click={handleSubmit} />
  </div>
  <ErrorAlert show={showErr} message={error} />
</Dropdown>

<!-- <style>
  :global(.rangeSlider){
    background-color: brown;
    color: yellowgreen;
  }
</style> -->