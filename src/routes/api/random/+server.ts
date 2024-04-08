export const GET = async ({ url: myUrl }) => {
	const res = await fetch('https://maddie480.ovh/celeste/random-map', {
		headers: {
			'User-Agent': myUrl.hostname,
		},
		redirect: 'manual',
	});
	const url = res.headers.get('location');
	if (res.status < 300 || res.status > 399 || !url) {
		return Response.json(
			{
				message: "Maddie's API is down",
				details: `${res.status} ${res.statusText} -> ${url} (${await res.text()})`,
			},
			{ status: 500 },
		);
	}

	const id = url.substring(url.lastIndexOf('/') + 1);
	console.log(id);

	const query = new URLSearchParams({
		itemid: id,
		itemtype: 'Mod',
		fields: ['name', 'authors', 'screenshots'].join(','),
	});

	const gbRes = await fetch(
		`https://gamebanana.com/apiv11/Mod/${id}/ProfilePage`,
	);
	if (!gbRes.ok) {
		return Response.json(
			{
				message: `Failed to fetch data from GameBanana (${gbRes.status} ${gbRes.statusText})`,
				details: await gbRes.text(),
			},
			{ status: 500 },
		);
	}
	const txt = await gbRes.text();
	let data: {
		_sName: string;
		_aCredits: Array<{
			_aAuthors: Array<{ _sName: string }>;
		}>;
		_aPreviewMedia: {
			_aImages: Array<{
				_sBaseUrl: string;
				_sFile: string;
			}>;
		};
	};

	try {
		data = JSON.parse(txt);
	} catch (e) {
		return Response.json(
			{
				message: 'Failed to parse GameBanana response',
				details: String(e),
			},
			{ status: 500 },
		);
	}
	try {
		const allAuthors = Object.values(data._aCredits)
			.map((c) => c._aAuthors)
			.flat()
			.map((a) => a._sName);
		const authors = [...new Set(allAuthors)];

		const img = data._aPreviewMedia._aImages[0];

		const thumbnail = img
			? `${img._sBaseUrl}/${img._sFile}`
			: '/placeholder.svg';

		return Response.json({
			url,
			name: data._sName,
			authors,
			thumbnail,
		});
	} catch (e) {
		console.error(e);
		return Response.json(
			{
				message: `Failed to parse GameBanana data`,
				details: String(e),
			},
			{
				status: 500,
			},
		);
	}
	// const gbRes = await fetch(
	// 	`https://api.gamebanana.com/Core/Item/Data?${query}`,
	// );
	// if (!gbRes.ok) {
	// 	return Response.json(
	// 		{
	// 			message: `Failed to fetch data from GameBanana (${gbRes.status} ${gbRes.statusText})`,
	// 			details: await gbRes.text(),
	// 		},
	// 		{ status: 500 },
	// 	);
	// }
	// let data: [name: string, authors: string, screenshots: string];
	// const txt = await gbRes.text();
	// try {
	// 	data = JSON.parse(txt);
	// } catch (e) {
	// 	return Response.json(
	// 		{
	// 			message: 'Failed to parse GameBanana response',
	// 			details: String(e),
	// 		},
	// 		{ status: 500 },
	// 	);
	// }
	// try {
	// 	const authorCategories = Object.values(JSON.parse(data[1])) as Array<
	// 		[name: string]
	// 	>[];
	// 	const authors = [...new Set(authorCategories.flat().map((a) => a[0]))];

	// 	const screenshot = JSON.parse(data[2])[0]._sFile;
	// 	return Response.json({
	// 		url,
	// 		name: data[0],
	// 		authors,
	// 		thumbnail: `https://images.gamebanana.com/img/ss/mods/${screenshot}`,
	// 	});
	// } catch (e) {
	// 	console.error(e);
	// 	return Response.json(
	// 		{
	// 			message: `Failed to parse GameBanana data`,
	// 			details: String(e),
	// 		},
	// 		{
	// 			status: 500,
	// 		},
	// 	);
	// }
};
