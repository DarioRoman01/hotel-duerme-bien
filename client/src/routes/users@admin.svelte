<script lang="ts">
  import Icon from "@iconify/svelte";
  import { getRequest } from "../request";
  import type { StaffUser } from "src/types";
  import { onMount } from "svelte";
  import Table from "../components/Table.svelte";
  import CreateUser from "../components/staff/CreateUser.svelte";
  import UsersModal from "../components/staff/UsersModal.svelte";


  let columns = ["Codigo", "Nombre", "Rol", "Acciones"];
  let users: StaffUser[] = [];
  let user = {} as StaffUser;
  let visible = false;

  const handleActionClick = (u: StaffUser) => {
    user = u;
    visible = true;
  };

  onMount(() => {
    getRequest<StaffUser[]>("staff")
    .then(res => users = res)
    .catch(err => console.log(err));
  })

  const handleDelete = (u: StaffUser) => {
    const filtered = users.filter(user => user.code !== u.code);
    users = [...filtered];
    visible = false;
  }
</script>

<div class="flex justify-center min-h-fit sm:min-h-screen col-span-12 row-span-5 sm:col-span-9 sm:row-span-9 mt-[6px]">
  <UsersModal {visible} {user} on:close={() => visible = false} on:delete={e => handleDelete(e.detail)} />
  <Table {columns} >
    {#each users as user }
      <tr class="bg-slate-100">
        <td class="text-center p-2">{user.code}</td>
        <td class="text-center p-2">{user.name}</td>
        <td class="text-center p-2">{user.role}</td>
        <td class="p-3 flex mt-1 justify-center">
          <button on:click={() => handleActionClick(user)} class="mx-2"><Icon icon="bxs:trash-alt" /></button>
        </td>
      </tr>
    {/each}
  </Table>
</div>
<div class="bg-contrast col-span-12 row-span-4 sm:col-span-3 sm:row-span-9 min-h-screen mb-1 p-3">
  <CreateUser on:submit={e => users = [e.detail, ...users]} />
</div>