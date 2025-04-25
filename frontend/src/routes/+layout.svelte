<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { Usuario } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/index/Header.svelte';

	let { children } = $props();

	$effect(() => {
		if (!Usuario.value) return void goto('login');
		goto('/');
	});
</script>

{#if Usuario.value}
	<Header />
{/if}
{@render children()}
