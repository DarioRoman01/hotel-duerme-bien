<script lang="ts">
	import ErrorAlert from '../components/ErrorAlert.svelte';
	import Button from '../components/Button.svelte';
	import Input from '../components/Input.svelte';
	import { postRequest } from '../request';
	import type { StaffUser } from '../types';

	let username = "";
	let password = "";
	let error = "";
	let showError = false;

	const handleLogin = () => {
		postRequest<StaffUser>({name: username, password: password}, 'login')
		.then(user => {
			localStorage.setItem('currentUser', JSON.stringify(user));
			window.location.href = user.role === 'administrador' ? '/users' : '/rooms';
		})
		.catch(err => {
			error = err.message;
			showError = true;
		});
	};
</script>

<div class="min-w-screen min-h-screen flex flex-col justify-center items-center bg-slate-100">
	<div class="p-4 border-2 border-slate-900 rounded-md w-[35%] shadow-2xl">
		<div class="text-center mb-3">
			<p class="text-2xl font-bold text-slate-900">Login</p>
		</div>
		<div class="mb-3">
			<Input id="username" placeholder="Username" bind:value={username} type="text" />
		</div>
		<div class="mb-3">
			<Input id="pwd" placeholder="Password" bind:value={password} type="password" />
		</div>
		<Button text="submit" click={handleLogin} />
		<div class="mt-3">
			<ErrorAlert padding={false} show={showError} message={error} />
		</div>
	</div>
</div>
