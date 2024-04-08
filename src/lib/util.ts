export function plural(text: string, count: number) {
	return count === 1 ? text : `${text}s`;
}
