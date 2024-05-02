<script lang="ts">
	import type { Level } from '$lib/persist.svelte';
	import LevelButton from './LevelButton.svelte';
	const {
		level,
		onclear,
		onskip,
		onfc,
		onfail,
		onreroll,
	}: {
		level: Level;
		onclear: () => void;
		onfc: () => void;
		onskip: () => void;
		onfail: () => void;
		onreroll: () => void;
	} = $props();
</script>

<div class="p-4 relative w-96 bg-zinc-800 rounded-lg shadow-lg">
	<div class="flex items-start gap-2 mb-2">
		<div class="group">
			<a
				href={level.url}
				target="_blank"
				oncontextmenu={(ev) => {
					ev.preventDefault();
					ev.currentTarget.click();
				}}
				class="text-2xl font-bold group-hover:underline"
			>
				{level.name}<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					class="stroke-zinc-200 inline ml-2"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"
					/><path d="m21 3-9 9" /><path d="M15 3h6v6" />
				</svg>
			</a>
			<p class="text-xs text-zinc-400 line-clamp-3">
				{level.authors.join(', ')}
			</p>
		</div>
		{#if level.status === 'in_progress'}
			<LevelButton
				title="Reroll without using a skip (invalid map or already goldened)"
				onclick={onreroll}
				icon="refresh"
				class="ml-auto w-16 shrink-0 whitespace-nowrap"
			>
				Bad map
			</LevelButton>
		{:else}
			<div class="w-16 shrink-0 ml-auto" />
		{/if}
	</div>
	<a
		href={level.url}
		oncontextmenu={(ev) => {
			ev.preventDefault();
			ev.currentTarget.click();
		}}
		target="_blank"
		class="w-full group"
	>
		<img
			src={level.thumbnail}
			alt=""
			class="w-full rounded-xl aspect-video object-cover group-hover:scale-[1.02] transition-transform"
		/>
	</a>
	<div class="flex gap-4 justify-center pt-2">
		{#if level.status === 'in_progress'}
			<LevelButton icon="heart" onclick={onclear}>Clear</LevelButton>
			<LevelButton icon="strawberry" onclick={onfc}>FC</LevelButton>

			{#if level.skips_at_start > 0}
				<LevelButton icon="skip" onclick={onskip} class="text-yellow-200">
					Skip
				</LevelButton>
			{:else}
				<LevelButton icon="skull" onclick={onfail} class="text-red-300">
					Give Up
				</LevelButton>
			{/if}
		{:else if level.status === 'skipped'}
			<LevelButton disabled icon="skip" class="text-yellow-400">
				Skipped
			</LevelButton>
		{:else if level.status === 'cleared'}
			<LevelButton disabled icon="heart">Cleared</LevelButton>
		{:else if level.status === 'full_cleared'}
			<LevelButton disabled class="text-purple-400" icon="strawberry">
				Full Cleared
			</LevelButton>
		{:else if level.status === 'failed'}
			<LevelButton disabled icon="skull" class="text-red-400">
				Gave Up
			</LevelButton>
		{/if}
	</div>
</div>
