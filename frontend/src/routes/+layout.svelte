<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import { Usuario } from '$lib/auth.svelte';
	import { goto } from '$app/navigation';
	import Header from '$lib/components/index/Header.svelte';

	let { children } = $props();

	$effect.pre(() => {
		if (!Usuario.value) return void goto('login');
		goto('/');
	});
</script>

<link rel="preload" href="/login-bg.jpg" as="image" />
<div id="main-index">
	{#if Usuario.value}
		<Header />
	{/if}
	{@render children()}
</div>

<style>
	#main-index {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: #ddd;
	}
</style>
