<script lang="ts">
	import Error from '$lib/components/Error.svelte';
	import LevelBox from '$lib/components/LevelBox.svelte';
	import LevelButton from '$lib/components/LevelButton.svelte';
	import {
		persist_state,
		persist_levels,
		type Level,
	} from '$lib/persist.svelte';
	import ShareButton from '$lib/components/ShareButton.svelte';
	import { plural } from '$lib/util';
	import Loading from '$lib/components/Loading.svelte';
	import Header from '$lib/components/Header.svelte';

	let initial_skips = persist_state('initial_skips', 1);

	const levels = persist_levels();

	const deltaSkips = {
		full_cleared: 1,
		skipped: -1,
	};

	let cancelAdd: AbortController | null = null;

	async function addLevel(skips: number) {
		levels.push({
			url: crypto.randomUUID(),
			status: 'loading',
			skips_at_start: skips,
		});
		cancelAdd?.abort();
		cancelAdd = new AbortController();
		const res = await fetch('/api/random');
		if (cancelAdd.signal.aborted) {
			return;
		}
		if (!res.ok) {
			const { message, details } = await res.json().catch(() => ({
				message: 'Unexpected error',
				details: 'API returned invalid JSON',
			}));
			levels.set_last({
				url: crypto.randomUUID(),
				status: 'error',
				message,
				details,
				skips_at_start: skips,
			});
			return;
		}
		const data = await res.json<Level>();
		if (cancelAdd.signal.aborted) {
			return;
		}
		levels.set_last({
			...data,

			skips_at_start: skips,
			status: 'in_progress',
		});
	}
	async function reroll() {
		const error = levels.pop();
		return addLevel(error?.skips_at_start ?? initial_skips.value);
	}

	function getDeltaSkip(status: Level['status']) {
		return deltaSkips[status as keyof typeof deltaSkips] ?? 0;
	}

	async function nextLevel(status: Level['status']) {
		const lastLevel = levels.last;
		if (lastLevel?.status !== 'in_progress') return;
		lastLevel.status = status;
		const skipDelta = getDeltaSkip(status);
		await addLevel(lastLevel.skips_at_start + skipDelta);
	}
	async function gameOver() {
		const level = levels.last;
		if (!level) return;
		level.status = 'failed';
	}
	const cumulativeClears = $derived.by(() => {
		const cum: number[] = [];
		let sum = 0;
		for (const level of levels.array) {
			if (level.status === 'cleared' || level.status === 'full_cleared') sum++;
			cum.push(sum);
		}
		return cum;
	});

	function undo() {
		cancelAdd?.abort();
		if (levels.last?.status === 'failed') {
			levels.last.status = 'in_progress';
			return;
		}
		levels.pop();
		const lastLevel = levels.last;
		if (!lastLevel) return;
		lastLevel.status = 'in_progress';
	}

	let container: HTMLElement;
	$effect(() => {
		levels.last;
		const last = container?.lastElementChild as HTMLElement;
		if (last) last.scrollIntoView({ behavior: 'smooth' });
	});
</script>

<svelte:window
	onkeydown={(ev) => {
		if (ev.key === 'z' && (ev.ctrlKey || ev.metaKey)) undo();
	}}
/>
{#if levels.length > 0}
	<div class="fixed text-zinc-50 bottom-0 left-0 m-2">
		{#if levels.last.status === 'in_progress'}
			<LevelButton icon="skull" onclick={gameOver} class="text-red-300">
				Give Up Early
			</LevelButton>
		{/if}
		<p>
			<kbd>CTRL</kbd> + <kbd>Z</kbd> to undo
		</p>
	</div>
{/if}

{#snippet skipLine(text: string, deltaSkips = 0)}
	<div class="border-l border-zinc-400 border-dashed h-8 my-1" />
	{#if deltaSkips > 0}
		<p class="text-purple-400 mt-1">+{deltaSkips} {plural('SKIP', deltaSkips).toUpperCase()}</p>
	{:else if deltaSkips < 0}
		<p class="text-yellow-400 mt-1">{deltaSkips} {plural('SKIP', deltaSkips).toUpperCase()}</p>
	{/if}
	<p class="text-sm text-zinc-400 uppercase">{text}</p>
	<div class="border-l border-zinc-400 border-dashed h-8 my-1" />
{/snippet}

<main
	bind:this={container}
	class="flex items-center flex-col max-w-screen-lg mx-auto p-8"
>
	<Header />
	<label>
		Start with skips:
		<select
			disabled={levels.length > 0}
			class="bg-zinc-700 px-2 py-1"
			bind:value={initial_skips.value}
		>
			{#each Array.from({ length: 11 }, (_, i) => i) as i}
				<option value={i}>{i}</option>
			{/each}
		</select>
	</label>

	<button
		class="btn mt-2"
		disabled={levels.length > 0}
		onclick={() => addLevel(initial_skips.value)}
	>
		Begin
	</button>
	{#if levels.length > 0}
		{@render skipLine(
			`Start, ${initial_skips.value} ${plural('skip', initial_skips.value)}`,
		)}
		{#each levels.array as level, i (level.url)}
			{#if level.status === 'error'}
				<Error {level} onretry={reroll} />
			{:else if level.status === 'loading'}
				<Loading />
			{:else}
				<LevelBox
					{level}
					onreroll={reroll}
					onclear={() => nextLevel('cleared')}
					onfc={() => nextLevel('full_cleared')}
					onskip={() => nextLevel('skipped')}
					onfail={gameOver}
				/>
			{/if}
			{#if i < levels.length - 1}
				{@const               skips = levels.i(i + 1)!.skips_at_start}
				{@const               clears = cumulativeClears[i]!}
				{@render skipLine(
					`${clears} ${plural('clear', clears)}, ${skips} ${plural('skip', skips)}`,
					getDeltaSkip(level.status),
				)}
			{/if}
		{/each}
		{#if levels.last?.status === 'failed'}
			{@const clears = cumulativeClears[cumulativeClears.length - 1] ?? 0}
			<div class="border-l border-zinc-400 border-dashed h-8 mt-1" />
			<div class="text-center text-zinc-200 uppercase my-1">
				<p class="text-red-400">Game Over!</p>
				<p class="tabular-nums">Score: {clears} {plural('clear', clears)}.</p>
			</div>
			<button
				class="btn my-2"
				onclick={() => {
					levels.clear();
				}}
			>
				Play Again
			</button>
			<ShareButton levels={levels.array} initial_skips={initial_skips.value} />
		{/if}
	{/if}
	<div class="h-[300px]" />
</main>
