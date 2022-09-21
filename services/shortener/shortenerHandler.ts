import type { ShortenerStorage } from "./shortenerStorage.ts";
import { ShortenerUrl } from "./shortenerUrl.ts";
import { ShortenerError } from "./shortenerError.ts";
import { createResponse } from "./utils.ts";

export class ShortenerHandler {
	private storage: ShortenerStorage;

	constructor(storage: ShortenerStorage) {
		this.storage = storage;
	}

	async get(slug: string): Promise<Response> {
		const url = await this.storage.get(slug);
		if (!url) {
			return createResponse<string>(
				`url with slug "${slug}" was not found`,
				404,
			);
		}
		const location = url.getTarget();
		return createResponse<string>(location, 307, {
			"cache-control": "public, max-age=300",
			location,
		});
	}

	async head(slug: string): Promise<Response> {
		const url = await this.storage.get(slug);
		if (!url) {
			return createResponse<string>("not found", 404);
		}
		return createResponse<string>("", 200);
	}

	async create(target: string, slug?: string) {
		const url = new ShortenerUrl(target, slug);
		if (await this.storage.get(url.getSlug()) !== null) {
			return createResponse<string>(`slug "${slug}" already exists`, 400);
		}
		await this.storage.create(url);
		return createResponse<{ slug: string }>({ slug: url.getSlug() }, 201, {
			"content-type": "application/json"
		});
	}

	async delete(slug: string): Promise<Response> {
		await this.storage.delete(slug);
		return createResponse<string>(`successful deleteing url with slug "${slug}"`)
	}
}
