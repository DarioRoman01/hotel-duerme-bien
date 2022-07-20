<script lang="ts">
  import Icon from "@iconify/svelte";
  import { scale } from 'svelte/transition'
  import { createEventDispatcher } from "svelte";

  export let title: string;
  export let visible: boolean;
  const dispatchClose = createEventDispatcher<{close: any}>();

  const handleClose = () => {
    dispatchClose("close", true)
  };
</script>

{#if visible}
  <div class="modal fixed top-0 left-0 z-40 w-full h-full flex justify-center items-center">
    <div in:scale='{{duration: 200}}' out:scale='{{duration: 200}}' class="fixed overflow-x-hidden overflow-y-auto w-9/12 h-fit z-50 rounded-md bg-gray-100 text-secondary grid grid-cols-12">
      <div class="col-span-12 row-span-1 flex justify-between items-center p-4">
        <div>
          <h1 class="text-xl text-bold">{title}</h1>
        </div>
        <div>
          <button on:click={handleClose} class="h-auto text-xl text-slate-900 font-bold py-2 px-4 rounded">
            <Icon icon="bi:x-circle-fill"/>
          </button>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
{/if}

<style>
  .modal {
    background: rgba(0, 0, 0, 0.6);
  }
</style>