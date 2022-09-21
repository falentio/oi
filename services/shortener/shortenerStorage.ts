import type { ShortenerUrl } from "./shortenerUrl.ts";

export interface ShortenerStorage {
	create(url: ShortenerUrl): Promise<void>;
	get(slug: string): Promise<ShortenerUrl | null>;
	delete(slug: string): Promise<void>;
}
