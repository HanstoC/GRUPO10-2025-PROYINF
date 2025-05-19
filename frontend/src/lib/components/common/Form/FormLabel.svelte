<script lang="ts">
	let { children } = $props();
</script>

<label class="font-medium">
	{@render children?.()}
</label>
