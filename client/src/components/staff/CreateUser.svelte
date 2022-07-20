<script lang="ts">
  import Dropdown from "../Dropdown.svelte";
  import { postRequest } from "../../request";
  import type { StaffUser } from "../../types";
  import Input from "../../components/Input.svelte";
import { createEventDispatcher } from "svelte";
import Select from "../Select.svelte";
import ErrorAlert from "../ErrorAlert.svelte";
import Button from "../Button.svelte";

  const dispatch = createEventDispatcher<{submit: StaffUser}>();
  let username = "";
  let password = "";
  let passwordConfirmation = "";
  let role = "";
  let error = "";
  let showError = false;

  const handleSubmit = () => {
    showError = false;
    // validate the form is filled out
    if (username === "" || password === "" || passwordConfirmation === "" || role === "") {
      error = "Todos los campos son obligatorios";
      showError = true;
      return;
    }

    // validate the passwords match
    if (password !== passwordConfirmation) {
      error = "Las contraseñas no coinciden";
      showError = true;
      return;
    }

    // validate the password is at least 6 characters long
    if (password.length < 6) {
      error = "La contrase  debe tener al menos 6 caracteres";
      showError = true;
      return;
  }

    // send the request
    postRequest<StaffUser>({name: username, password: password, role: role}, 'staff/create')
      .then(user => dispatch("submit", user))
      .catch(err => {
        error = err.message;
        showError = true;
      });
  };
</script>

<Dropdown title="Crear usuario">
  <div class="mb-3 p-2 w-full">
    <Input id="username" placeholder="Username" bind:value={username} type="text" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="pwd" placeholder="Password" bind:value={password} type="password" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Input id="pwdConfirmation" placeholder="Confirmar password" bind:value={passwordConfirmation} type="password" />
  </div>
  <div class="mb-3 p-2 w-full">
    <Select title="Rol" options={["administrador", "gerente"]} bind:value={role} />
  </div>
  <div class="mb-3 p-2 w-full">
    <Button click={handleSubmit} text="agregar" />
  </div>
  <ErrorAlert message={error} show={showError} />
</Dropdown>