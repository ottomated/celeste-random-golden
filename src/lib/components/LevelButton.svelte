<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const {
		children,
		icon,
		class: class_,
		...props
	}: {
		children: Snippet;
		icon: keyof typeof icons;
	} & SvelteHTMLElements['button'] = $props();

	const icons = {
		heart:
			'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
		strawberry:
			'M17 7l3.5-3.5M17 2v5h5M2.1 17.1a4 4 0 0 0 4.8 4.8l9-2.1a6.32 6.32 0 0 0 2.9-10.9L15 5.2A6.5 6.5 0 0 0 4.1 8.3zM8.5 9.5h.01M12.5 8.5h.01M7.5 13.5h.01M11.5 12.5h.01M15.5 11.5h.01M6.5 17.5h.01M10.5 16.5h.01M14.5 15.5h.01',
		skip: 'M5 4l10 8-10 8V4zM19 5v14',
		skull: '',
		refresh: '',
	};
</script>

<button
	class="{class_} flex min-w-12 uppercase items-center py-0.5 px-1 enabled:hover:bg-white/10 enabled:active:bg-white/20 rounded-lg transition-colors flex-col text-xs"
	{...props}
>
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		{#if icon === 'skull'}
			<circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path
				d="M8 20v2h8v-2"
			/><path d="m12.5 17-.5-1-.5 1h1z" /><path
				d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"
			/>
		{:else if icon === 'refresh'}
			<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path
				d="M21 3v5h-5"
			/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path
				d="M8 16H3v5"
			/>
		{:else}
			<path d={icons[icon]} />
		{/if}
	</svg>
	{@render children()}
</button>
