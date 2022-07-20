<script lang="ts">
  import { getRequest } from '../request';
  import { fade, fly, slide } from 'svelte/transition';

  let openDesktopNav = false;
  let openMobileNav = false;
  let toggleDesktopProfile;
  const toggleDesktopNav = () => { openDesktopNav = !openDesktopNav }
  const toggleMobileNav = () => { openMobileNav = !openMobileNav }

  export let location: string;
  export let currentUserType: string;

  const logout = () => {
    getRequest('logout')
    .then(_ => {
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    })
    .catch(err => console.log(err));
  }
</script>


<nav class="relative rounded-lg shadow elevation-3">
  <div class="px-4 mx-auto sm:px-6 lg:px-8 bg-slate-100 text-slate-900 border-b-2 border-slate-900">
    <div class="flex justify-between h-16">
        <div class="flex items-center mr-2 -ml-2 md:hidden">
          <button on:click={ toggleMobileNav } class="inline-flex items-center justify-center p-2 transition duration-150 ease-in-out transform rounded-md text-five hover:text-link hover:scale-125 active:scale-125 focus:outline-none focus:text-link">
            <svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path class={`${openMobileNav ? 'hidden' : 'inline-flex'}`} stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path class={`${openMobileNav ? 'inline-flex' : 'hidden'}`} stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="flex">
          <div class="flex justify-center items-center flex-shrink-0">
            <div class="hover:pulse-once">
              <img class="h-6 w-auto" src="../static/logo-2.png" alt="Workflow">
            </div>
          </div>
  
          <div class="hidden md:ml-6 md:flex md:items-center">
            {#if currentUserType === 'admin'}
              <a href="/users" class="text-slate-900 font-bold px-3 py-2 text-sm">
                Users
              </a>
            {:else}
              <a href="/rooms" class={`text-slate-900 ${location === 'rooms' ? 'font-bold' : 'hover:bg-slate-300 font-medium'} px-3 py-2 rounded-md text-sm `} aria-current="page">Habitaciones</a>
  
              <a href="/clients" class={`text-slate-900 ${location === 'clients' ? 'font-bold' : 'hover:bg-slate-300 font-medium'} px-3 py-2 rounded-md text-sm`}>Clientes</a>
  
              <a href="/inventory" class={`text-slate-900 ${location === 'inventory' ? 'font-bold' : 'hover:bg-slate-300 font-medium'} px-3 py-2 rounded-md text-sm`}>Inventario</a>
  
              <a href="/records" class={`text-slate-900 ${location === 'records' ? 'font-bold' : 'hover:bg-slate-300 font-medium'} px-3 py-2 rounded-md text-sm`}>Historial</a>
            {/if}
        </div>
        </div>
      <div class="flex items-center">
        <div class="md:ml-4 md:flex-shrink-0 md:flex md:items-center">
          <button class="hidden md:block p-1 text-gray-400 transition duration-150 ease-in-out border-2 border-transparent rounded-full hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100">
            <svg class="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <div class="relative ml-3">
            <button bind:this={ toggleDesktopProfile } on:click={ toggleDesktopNav } class="flex text-sm transition duration-150 ease-in-out border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300">
              <span class="relative inline-block">
                <img class="w-9 h-9 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                <span class="absolute top-0 right-0 block w-3 h-3 text-white bg-green-400 rounded-full shadow-solid"></span>
              </span>
            </button>
            {#if openDesktopNav }
              <div in:fly="{{ x: 900, duration: 500 }}" out:fade={{ duration: 75 }} class="absolute z-10 right-0 w-48 mt-2 origin-top-right rounded-md">
                <div class="py-1 bg-white rounded-md elevation-5">
                  <a href="." class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100">Your Profile</a>
                  <a href="." class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100">Settings</a>
                  <a href="." on:click={logout} class="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100">Sign out</a>
                </div>
              </div>
            {/if}
            </div>
        </div>
      </div>
    </div>
    {#if openMobileNav}
      <div in:slide="{{duration: 500}}" out:slide="{{duration: 500}}" class="px-2 pt-2 pb-3 max-w-mobilenav bg-slate-100 z-10 text-slate-900">
        {#if currentUserType === 'admin'}
          <a href="/users" class="text-slate-900 font-bold px-3 py-2 text-sm block">
            Users
          </a>
        {:else}
          <a href="/rooms" class={`text-slate-900 block ${location === 'rooms' ? 'font-bold' : 'hover:bg-slate-300 font-medium'} px-3 py-2 rounded-md text-base `} aria-current="page">Habitaciones</a>
    
          <a href="/clients" class={`text-slate-900 block ${location === 'clients' ? 'font-bold' : 'hover:bg-slate-300 font-medium'} px-3 py-2 rounded-md text-base`}>Clientes</a>
    
          <a href="/inventory" class={`text-slate-900 block ${location === 'inventory' ? 'font-bold' : 'hover:bg-slate-300 font-medium'} px-3 py-2 rounded-md text-base`}>Inventario</a>
    
          <a href="/records" class={`text-slate-900 block ${location === 'records' ? 'font-bold' : 'hover:bg-slate-300 font-medium'} px-3 py-2 rounded-md text-base`}>Historial</a>
        {/if}
      </div>
    {/if}
  </div>
</nav>