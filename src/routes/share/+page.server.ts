export const load = async ({ url }) => {
	if (!url.searchParams.has('data')) return;
	try {
		const shareData = JSON.parse(atob(url.searchParams.get('data')!));
		return {
			shareData,
		};
	} catch (_) {
		/*ignore*/
	}
};
