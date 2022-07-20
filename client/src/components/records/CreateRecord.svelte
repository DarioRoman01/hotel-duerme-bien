<script lang="ts">
  import Button from "../Button.svelte";
  import Dropdown from "../Dropdown.svelte";
  import Input from "../Input.svelte";
  import InputList from "../InputList.svelte";
  import { checkValue, validateRut } from "../../utils";
  import type { RoomRecord } from "../../types";
  import { createEventDispatcher } from "svelte";
  import { postRequest } from "../../request";
import ErrorAlert from "../ErrorAlert.svelte";

  const dispatch = createEventDispatcher<{ submit: RoomRecord }>();
  let responsible = "";
  let start = "";
  let finish = "";
  let room = "";
  let companions: string[] = [];
  let error = "";
  let showErr = false;

  const handleSubmit = () => {
    showErr = false;

    // validate that the companions list is not empty and that all the ruts are valid if the companions list is empty set companions to null
    let ruts = companions.length > 0 ? companions : null;

    // validate all the companions ruts and set error message and show error message if needed
    if (ruts) {
      ruts.forEach(rut => {
        if (!validateRut(rut)) {
          error = "Rut invalido el rut debe contener puntos y guion";
          showErr = true;
        }
      });
    }

    // validate that responsible, finish and room are not empty
    if (!checkValue(responsible)) {
      error = "El responsable es requerido";
      showErr = true;
    } else if (!checkValue(finish)) {
      error = "La fecha de finalización es requerida";
      showErr = true;
    } else if (!checkValue(room)) {
      error = "La habitación es requerida";
      showErr = true;
    }

    // if no error, send request to server
    if (!showErr) {
      const record = {
        responsible: responsible,
        start: start === '' ? null : start.replace('T', ' '),
        end: finish.replace('T', ' '),
        room: room,
        companions: ruts
      };

      postRequest<RoomRecord>(record, "records/create")
        .then(res => dispatch("submit", res))
        .catch(err => {
          error = err.message;
          showErr = true;
        });
    }
  }
</script>

<Dropdown title="Agregar registro">
  <div class="mb-3 p-2 w-full">
    <Input id="responsible" placeholder="Responsable" bind:value={responsible} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="room" placeholder="Habitacion" bind:value={room} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="start" placeholder="Fecha Inicio" bind:value={start} type="datetime-local" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="finish" placeholder="Fecha Fin" bind:value={finish} type="datetime-local" />
  </div>
  <div class="mb-3 p-2 w-full">
    <InputList on:change={e => companions = e.detail} />
  </div>
  <div class="mb-3 p-2 w-full">
    <Button text="Registrar" click={handleSubmit} />
  </div>
  <ErrorAlert show={showErr} message={error} />
</Dropdown>