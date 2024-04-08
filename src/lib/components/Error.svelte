<script lang="ts">
	import LevelButton from './LevelButton.svelte';

	const {
		level,
		onretry,
	}: { level: { message: string }; onretry: () => void } = $props();
</script>

<div class="p-4 bg-zinc-800 rounded-lg shadow-lg">
	<p class="font-bold text-red-600">Error</p>
	<p class="text-white">{level.message}</p>
	<LevelButton onclick={onretry} icon="refresh" class="mx-auto mt-8">
		Retry
	</LevelButton>
</div>
