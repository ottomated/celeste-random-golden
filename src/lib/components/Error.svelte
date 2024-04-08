<script lang="ts">
	import LevelButton from './LevelButton.svelte';

	const {
		level: error,
		onretry,
	}: { level: { message: string; details?: string }; onretry: () => void } =
		$props();
</script>

<div class="p-4 bg-zinc-800 max-w-96 rounded-lg shadow-lg">
	<p class="font-bold text-red-600">Error</p>
	<p class="text-white">{error.message}</p>
	{#if error.details}
		<details>
			<summary>Details</summary>
			<p class="font-mono text-sm">
				{error.details}
			</p>
		</details>
	{/if}
	<LevelButton onclick={onretry} icon="refresh" class="mx-auto mt-8">
		Retry
	</LevelButton>
</div>
