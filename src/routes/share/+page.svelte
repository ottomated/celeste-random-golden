<script lang="ts">
	import { plural } from '$lib/util';
	import LevelBox from '$lib/components/LevelBox.svelte';
	import Header from '$lib/components/Header.svelte';
	const { data } = $props();
	const { levels, initial_skips } = data.shareData;

	const cumulativeClears: number[] = [];
	let sum = 0;
	for (const level of levels) {
		if (level.status === 'cleared' || level.status === 'full_cleared') sum++;
		cumulativeClears.push(sum);
	}
</script>

{#snippet skipLine(text: string, plus1 = false)}
	<div class="border-l border-zinc-400 border-dashed h-8 my-1" />
	{#if plus1}
		<p class="text-purple-400 mt-1">+1 SKIP</p>
	{/if}
	<p class="text-sm text-zinc-400 uppercase">{text}</p>
	<div class="border-l border-zinc-400 border-dashed h-8 my-1" />
{/snippet}

<main class="flex items-center flex-col max-w-screen-lg mx-auto p-8">
	<Header />
	<p class="text-black bg-zinc-500 px-2 py-1 rounded-full">Begin</p>
	{#if levels.length > 0}
		{@render skipLine(
			`Start, ${initial_skips} ${plural('skip', initial_skips)}`,
		)}
	{/if}
	{#each levels as level, i (level.url)}
		{#if level.status !== 'error' && level.status !== 'loading'}
			<LevelBox {level} />
		{/if}
		{#if i < levels.length - 1}
			{@const skips = levels[i + 1]!.skips_at_start}
			{@const clears = cumulativeClears[i]!}
			{@render skipLine(
				`${clears} ${plural('clear', clears)}, ${skips} ${plural('skip', skips)}`,
				level.status === 'full_cleared',
			)}
		{/if}
	{/each}
	{#if levels[levels.length - 1]?.status === 'failed'}
		{@const clears = cumulativeClears[cumulativeClears.length - 1] ?? 0}
		<div class="border-l border-zinc-400 border-dashed h-8 mt-1" />
		<div class="text-center text-zinc-200 uppercase my-1">
			<p class="text-red-400">Game Over!</p>
			<p class="tabular-nums">Score: {clears} {plural('clear', clears)}.</p>
		</div>
		<a href="/" class="btn">Play</a>
	{/if}
	<div class="h-[300px]" />
</main>
