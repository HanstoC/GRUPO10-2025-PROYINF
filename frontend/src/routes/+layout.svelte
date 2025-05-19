<script lang="ts">
	import { Usuario } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';

	import '../app.css';
	import 'iconify-icon';

	let { children } = $props();

	$effect.pre(() => {
		if (!Usuario.value) return void goto('login');
		goto('/');
	});
</script>

<link rel="preload" href="/login-bg.png" as="image" />
<Loader />
{#if Usuario.value}
	<Header />
{/if}
<div
	class={`flex ${Usuario.value ? 'h-[calc(100%-3.5rem)]' : 'h-full'} flex-col items-center gap-2 overflow-auto`}
>
	{@render children()}
</div>
