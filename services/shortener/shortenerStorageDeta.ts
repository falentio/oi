import type { ShortenerStorage } from "./shortenerStorage.ts"
import { ShortenerUrl } from "./shortenerUrl.ts"
import { ShortenerError } from "./shortenerError.ts"
import { Detabase, DetabaseError } from "deta"

export class ShortenerStorageDeta implements ShortenerStorage {
	private base: Detabase

	constructor(key: string, name: string) {
		const id = key.split("_")[0]
		if (!id) {
			throw new Error("invalid Detabase key")
		}
		this.base = new Detabase({
			projectId: id,
			apikey: key,
			baseName: name,
		});
	}

	async create(url: ShortenerUrl) {
		const body = {
			createdAt: url.getCreatedAt(),
			target: url.getTarget(),
			key: url.getSlug(),
		}
		await this.base
			.insert(body)
			.catch(async e => {
				if (!(e instanceof DetabaseError)) {
					throw e
				}

				console.log(await e.response.text())
				console.log("create" , e.response.status)
				throw new ShortenerError(`failed to create url with slug ${body.slug}`)
			});
	}

	async get(slug: string) {
		try {
			const { createdAt, target } = await this.base.get(slug)
			return new ShortenerUrl(target, slug, createdAt);
		} catch (e) {
			if (!(e instanceof DetabaseError)) {
				throw e
			}
			try {
				if (e.response.status === 404) {
					return null
				}
				throw new ShortenerError(`failed to create url with slug`)
			} finally {
				await e.response.arrayBuffer()
			}
		};
	}

	async delete(slug: string) {
		await this.base.delete(slug);
	}
}
