<script lang="ts">
  import { deleteRequest } from "../../request";
  import { createEventDispatcher } from "svelte";
  import type { ModalEvents, RoomRecord} from "../../types";
  import Button from "../Button.svelte";
  import ErrorAlert from "../ErrorAlert.svelte";

  const dispatch = createEventDispatcher<ModalEvents<RoomRecord>>();
  export let record: RoomRecord;
  let error = "";
  let showError = false;

  const handleDelete = () => {
    deleteRequest<any>(`records/${record.code}`)
      .then(_ => dispatch("delete", record))
      .catch(err => {
        error = err.message;
        showError = true;
      });
  }
</script>

<div class="col-span-12 mb-4">
  <div class="text-xl font-bold text-center">
    <span class="text-slate-900">Esta seguro de eliminar el registro {record.code} ?</span>
  </div>
</div>
<div class="col-span-12">
  <div class="flex flex-col gap-5 items-center justify-around w-full p-2">
    <div class="w-1/5">
      <button type="button" on:click={handleDelete} class="bg-red-700 hover:bg-red-600 text-slate-100 transition-all rounded-md p-2 font-bold w-full active:transform active:translate-y-1">
        Eliminar
      </button>
    </div>
    <div class="w-1/5">
      <Button text="Cancelar" click={() => dispatch("close")} />
    </div>
  </div>
</div>
<div class="col-span-12">
  <div class="mb-3 p-2">
    <ErrorAlert message={error} show={showError} />
  </div>
</div>