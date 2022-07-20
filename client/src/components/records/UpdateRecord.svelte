<script lang="ts">
  import { patchRequest } from "../../request";
  import { createEventDispatcher } from "svelte";
  import type { RoomRecord } from "../../types";
  import Button from "../Button.svelte";
  import Input from "../Input.svelte";
  import Select from "../Select.svelte";
import ErrorAlert from "../ErrorAlert.svelte";


  const dispatchUpdate = createEventDispatcher<{ update: RoomRecord }>();
  export let record: RoomRecord;
  let error = "";
  let showError = false;
  let state = record.active ? "activa" : "no activa";
  let finish = record.end.replace(' ', 'T').substring(0, record.end.length - 3);

  const handleSubmit = () => {
    // validate that the state is not empty
    if (state.trim() === "") {
      error = "El estado no puede estar vacio";
      showError = true;
      return;
    }

    // validate that the finish date is not empty
    if (finish.trim() === "") {
      error = "La fecha de finalización no puede estar vacia";
      showError = true;
      return;
    }

    // send the request to the server
    record.active = state === "activa";
    record.end = finish.replace('T', ' ');
    record.start = record.start.substring(0, record.start.length - 3);
    
    patchRequest<RoomRecord>(record, `records`)
      .then(r => dispatchUpdate("update", r))
      .catch(err => {
        error = err.message;
        showError = true;
      });
  }

</script>

<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Select title="Estado" selected={state} options={["activa", "no activa"]} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Input id="updateFinish" placeholder="Fecha de finalización" type="datetime-local" bind:value={finish} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2 w-full">
    <Button text="Actualizar" click={handleSubmit} />
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2">
    <ErrorAlert show={showError} message={error} />
  </div>
</div>