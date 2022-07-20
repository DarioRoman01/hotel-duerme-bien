<script lang="ts">
  export let placeholder: string;
  export let value: string;
  export let type: string;
  export let id: string;

  const handleInput = (event: any) => {
    value = event.target.value;
  };

</script>

<div class="relative">
  <input {type} {value} on:input={handleInput} {id} class="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-slate-900 border-0 border-b-2 border-slate-900 appearance-none focus:outline-none focus:ring-0 peer" placeholder=" " />
  <label for={id} class="font-bold absolute text-sm text-slate-900 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4">{placeholder}</label>
</div>