<script lang="ts">
	let { children } = $props();
</script>

<div class="form-error"></div>
<div class="mt-2 flex flex-col gap-2">
	{@render children?.()}
</div>
