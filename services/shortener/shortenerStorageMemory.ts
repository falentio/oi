import type { ShortenerStorage } from "./shortenerStorage.ts";
import { ShortenerError } from "./shortenerError.ts";
import { ShortenerUrl } from "./shortenerUrl.ts";

export class ShortenerStorageMemory implements ShortenerStorage {
	private maxLength: number;
	private urls: ShortenerUrl[];

	constructor(maxLength: number = 2000) {
		this.maxLength = maxLength;
		this.urls = [];
	}

	create(url: ShortenerUrl) {
		this.urls.push(url);
		if (this.urls.length >= this.maxLength) {
			this.urls.splice(0, this.maxLength * 0.1 | 0);
		}
		return Promise.resolve();
	}

	get(slug: string) {
		const url = this.urls.find((i) => i.getSlug() === slug) || null;
		return Promise.resolve(url);
	}

	delete(slug: string) {
		this.urls = this.urls.filter((i) => i.getSlug() !== slug);
		return Promise.resolve();
	}
}
