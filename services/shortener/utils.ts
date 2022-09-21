const vowel = "aiueo";
const consonant = "bcdfghjklmnpqrstvwxyz";

export function random(l: number): string {
	let result = "";
	let i = 0;

	if (Math.random() > 0.5) {
		i++;
	}

	while (result.length < l) {
		const c = [vowel, consonant][i++ % 2] as string;
		result += c[Math.random() * c.length | 0] || "";
	}

	return result;
}

export function createResponse<T>(
	body: T,
	status = 200,
	headers: Record<string, string> = {},
) {
	return new Response(stringify(body), {
		status,
		headers: {
			"cache-control": "private, no-store, max-age=0",
			...headers,
		},
	});
}

export function stringify(s: unknown) {
	if (s instanceof Object || Array.isArray(s)) {
		return JSON.stringify(s)
	}
	return s + ""
}