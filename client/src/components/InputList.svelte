<script lang="ts">
import { createEventDispatcher } from "svelte";
import { fly } from 'svelte/transition'
import Button from "./Button.svelte";
import Dropdown from "./Dropdown.svelte";


  const dispatch = createEventDispatcher<{ change: string[] }>();

  let inputsValues: string[] = [];

  const addInputValue = () => {
    inputsValues = [...inputsValues, ""];
  }

  const removeInputValue = (index: number) => {
    inputsValues = [...inputsValues.slice(0, index), ...inputsValues.slice(index + 1)];
    dispatch('change', inputsValues);
  }

  const handleInput = (event: any, index: number) => {
    inputsValues[index] = event.target.value;
    dispatch('change', inputsValues);
  }
</script>

<Dropdown title="Acompañantes" padding={false}>
  <div class="w-full p-2 overflow-hidden">
    {#each inputsValues as inputsValue, idx }
      <div class="w-full flex items-center gap-2" in:fly='{{duration: 500, x: 100}}' out:fly='{{duration: 500, x: 100}}'>
        <div class="relative flex-initial w-10/12 ">
          <input
          type="text"
          id={`input-${idx}`}
          value={inputsValue}
          on:input={(e) => handleInput(e, idx)}
          class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-slate-900 border-0 border-b-2 border-slate-900 appearance-none focus:outline-none focus:ring-0 peer"
          placeholder=" "
          />
          <label class="font-bold absolute text-sm text-slate-900 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4" for={`input-${idx}`}>Rut</label>
        </div>
        <div class="flex-none mt-4">
          <Button click={() => removeInputValue(idx)} text="Remove" />
        </div>
      </div>
    {/each}
    <div class="w-full mt-4">
      <Button click={addInputValue} text="Agregar" />
    </div>
  </div>
</Dropdown>