<script lang="ts">
  import Nav from "../components/Nav.svelte";
  import "../app.css";
  import { beforeUpdate } from "svelte";
  import type { StaffUser } from "../types";

  let location = '/';
  beforeUpdate(() => {
    const currentUser: StaffUser = JSON.parse(localStorage.getItem('currentUser')!);
    if (currentUser.role != 'gerente') window.location.href = '/';
    location = window.location.pathname.replace('/', '');
  });

  let currentUserType = 'manager';
</script>

<div class="manager">
  <div class="min-w-screen min-h-screen overflow-hidden">
    <div class="grid grid-cols-12 grid-rows-12 min-w-full">
      <div class="row-span-3 col-span-12 h-16">
        <Nav {location} {currentUserType} />
      </div>
      <slot></slot>
    </div>
  </div>
</div>