<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { postRequest } from "../../request";
  import type { RoomRecord } from "../../types";
  import { checkValue } from "../../utils";
  import Button from "../Button.svelte";
  import Dropdown from "../Dropdown.svelte";
  import Input from "../Input.svelte";
  import Select from "../Select.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";

  const dispatch = createEventDispatcher<{ submit: RoomRecord[] }>();
  let startDate = "";
  let endDate = "";
  let room = "";
  let state = "";
  let error = "";
  let showErr = false;

  // function call handleSubmit that console.logs the values of the inputs
  const handleSubmit = () => {
    showErr = false;
    const filters = {
      start: checkValue(startDate),
      finish: checkValue(endDate),
      room: checkValue(room),
      state: state != "" ? state === 'activa' ? true : false : null,
    };

    postRequest<RoomRecord[]>(filters, "records")
      .then(res => dispatch("submit", res))
      .catch(err => {
        error = err.message;
        showErr = true;
      });
  };
</script>

<Dropdown title="Filtros">
  <div class="mb-3 p-2 w-full">
    <Input id="room" placeholder="Habitacion" bind:value={room} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="startDate" placeholder="Fecha Inicio" bind:value={startDate} type="date" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="endDate" placeholder="Fecha Fin" bind:value={endDate} type="date" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Select title="Estado" options={["activa", "no activa"]} bind:value={state} />
  </div>
  <div class="mb-3 p-2 w-full">
    <Button text="Filtrar" click={handleSubmit} />
  </div>
  <ErrorAlert show={showErr} message={error} />
</Dropdown>

