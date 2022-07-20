<script lang="ts">
  import { slide } from 'svelte/transition';
  let show = false;
  export let title: string;
  export let padding: boolean = true;
</script>

<div class={`flex flex-col justify-center items-center ${padding ? 'p-5' : ''}`}>
  <div class="mb-3 w-full">
    <div class="relative inline-block rounded-md border-2 border-slate-900 w-full">
      <div class="w-full">
        <button type="button" on:click={() => show = !show} class="inline-flex font-bold justify-between w-full  shadow-sm px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
          {title}
          <svg class={`arrow-icon ${show ? 'open' : ''}  -mr-1 ml-2 h-5 w-5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      {#if show}
        <div in:slide="{{duration: 500}}" out:slide="{{duration: 500}}">
          <slot />
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .arrow-icon{
  transform: rotate(0deg);
  transition: transform 500ms linear;
  }

  .open{
    transform: rotate(180deg);
    transition: transform 500ms linear;
  }
</style>