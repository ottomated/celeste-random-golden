import { browser } from '$app/environment';

export type Level = {
	url: string;
	name: string;
	authors: string[];
	thumbnail: string;

	skips_at_start: number;
	status: 'in_progress' | 'cleared' | 'full_cleared' | 'skipped' | 'failed';
};
type LevelOrError =
	| Level
	| {
			status: 'error';
			message: string;
			skips_at_start: number;
			url: string;
	  }
	| {
			status: 'loading';
			url: string;
			skips_at_start: number;
	  };

export function persist_state<T>(key: string, initial_value: T) {
	let state = $state(initial_value);

	if (browser) {
		const stored = localStorage.getItem(key);
		if (stored) {
			try {
				state = JSON.parse(stored);
			} catch (_) {
				localStorage.removeItem(key);
			}
		}
	}

	return {
		get value() {
			return state;
		},
		set value(new_value: T) {
			state = new_value;
			localStorage.setItem(key, JSON.stringify(state));
		},
	};
}

export function persist_levels() {
	let levels = $state<Array<LevelOrError>>([]);
	if (browser) {
		const stored = localStorage.getItem('levels');
		if (stored) {
			try {
				levels = JSON.parse(stored);
			} catch (_) {
				localStorage.removeItem('levels');
			}
		}
	}

	$effect(() => {
		localStorage.setItem(
			'levels',
			JSON.stringify(levels.filter((l) => l.status !== 'loading')),
		);
	});

	return {
		push(level: LevelOrError) {
			levels.push(level);
		},
		pop() {
			return levels.pop();
		},
		get length() {
			return levels.length;
		},
		get last() {
			return levels[levels.length - 1];
		},
		get array() {
			return levels;
		},
		set_last(level: LevelOrError) {
			if (levels.length === 0) return;
			levels[levels.length - 1] = level;
		},
		i(i: number) {
			return levels[i];
		},
		set_i(i: number, level: LevelOrError) {
			levels[i] = level;
		},
		clear() {
			levels = [];
		},
	};
}
