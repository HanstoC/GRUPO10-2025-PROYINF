<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';

	import '../app.css';
	import 'iconify-icon';

	import { page } from '$app/state';
	import { LINKS } from '$lib/global/links';
	import { AuthService } from '$lib/api/auth';

	let { children } = $props();
	const hasHeader = $derived(page.url.pathname !== LINKS.LOGIN);

	$effect.pre(() => {
		if (page.url.pathname.match(/login|logout/g)) return;
		let timeout = setTimeout(() => AuthService.checkLogged(), 200);
		return () => {
			clearTimeout(timeout);
		};
	});
</script>

<link rel="preload" href="/login-bg.png" as="image" />
<link rel="preload" href="/resultados-bg.jpg" as="image" />
<link rel="preload" href="/ensayos-bg.jpg" as="image" />

<Loader />
{#if hasHeader}
	<Header />
{/if}
<div
	class={`flex ${hasHeader ? 'h-[calc(100%-3.5rem)]' : 'h-full'} flex-col items-center gap-2 overflow-auto`}
>
	{@render children()}
</div>
