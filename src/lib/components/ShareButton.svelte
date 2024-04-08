<script lang="ts">
	import type { Level } from '$lib/persist.svelte';
	import { plural } from '$lib/util';

	const { ...data }: { levels: Level[] } = $props();

	let copied = $state(false);
</script>

<button
	class="btn"
	class:text-green-400={copied}
	onclick={() => {
		const url = new URL(location.href);
		url.pathname = '/share';
		url.searchParams.set('data', btoa(JSON.stringify(data)));
		const totalClears = data.levels.filter(
			(l) => l.status === 'cleared' || l.status === 'full_cleared',
		).length;
		navigator.clipboard.writeText(
			`[${totalClears} ${plural('clear', totalClears)}](${url.href})`,
		);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 5000);
	}}
>
	{#if copied}
		Copied share markdown!
	{:else}
		Share
	{/if}
</button>
