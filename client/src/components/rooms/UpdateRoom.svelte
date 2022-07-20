<script lang="ts">
import { patchRequest } from "../../request";

  import { createEventDispatcher } from "svelte";
  import type { Room } from "../../types";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";
  import Input from "../Input.svelte";
  import Select from "../Select.svelte";
  
  export let room: Room;
  let capacity = room.capacity.toString();
  const dispatch = createEventDispatcher<{ update: Room }>();
  let error = "";
  let showError = false;

  const handleSubmit = () => {
    showError = false;
    // validate that the capacity is a number
    if (isNaN(parseInt(capacity))) {
      error = "Capacidad debe ser un numero";
      showError = true;
      return;
    }
    
    // validate that the room occupancy is not empty
    if (room.occupancy === "") {
      error = "El estado del inventario no puede estar vacio";
      showError = true;
      return;
    }

    // validate that the room orientation is not empty
    if (room.orientation === "") {
      error = "La orientacion no puede estar vacia";
      showError = true;
      return;
    }

    room.capacity = parseInt(capacity);

    // send the update request
    patchRequest<Room>(room, "rooms")
      .then(res => dispatch("update", res))
      .catch(err => {
        showError = true;
        error = err.message;
      });
  };
</script>


<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Input id="updateCapacity" placeholder="Capacidad" type="text" bind:value={capacity} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Select selected={room.occupancy} title="Estado" options={["libre", "ocupada", "reservada"]} bind:value={room.occupancy} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Select selected={room.orientation} title="Orientacion" options={["norte", "sur", "este", "oeste"]} bind:value={room.orientation} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Button text="Actualizar" click={handleSubmit} />
  </div>
</div>
<div class="col-span-12">
  <ErrorAlert show={showError} message={error} />
</div>