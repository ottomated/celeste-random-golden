export const GET = async ({ url: myUrl }) => {
	const res = await fetch('https://maddie480.ovh/celeste/random-map', {
		headers: {
			'User-Agent': myUrl.hostname,
		},
		redirect: 'manual',
	});
	if (res.status < 300 || res.status > 399) return res;
	const url = res.headers.get('location');
	if (!url) return new Response('No map was returned', { status: 500 });

	const id = url.substring(url.lastIndexOf('/') + 1);

	const query = new URLSearchParams({
		itemid: id,
		itemtype: 'Mod',
		fields: ['name', 'authors', 'screenshots'].join(','),
	});

	const data = await fetch(
		`https://api.gamebanana.com/Core/Item/Data?${query}`,
	).then(
		(r) =>
			r.json() as Promise<[name: string, authors: string, screenshots: string]>,
	);

	const authorCategories = Object.values(JSON.parse(data[1])) as Array<
		[name: string]
	>[];
	const authors = authorCategories.flat().map((a) => a[0]);

	const screenshot = JSON.parse(data[2])[0]._sFile;

	return Response.json({
		url,
		name: data[0],
		authors,
		thumbnail: `https://images.gamebanana.com/img/ss/mods/${screenshot}`,
	});
};
