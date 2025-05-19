<script lang="ts">
	import { type HTMLAttributes } from 'svelte/elements';

	let { children, error, ...props }: HTMLAttributes<HTMLFormElement> & { error?: string } =
		$props();

	$effect(() => {
		if (error) {
		}
	});
</script>

<form {...props}>
	{@render children?.()}
</form>
