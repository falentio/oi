import { random } from "./utils.ts";

export class ShortenerUrl {
	private target: string;
	private slug: string;
	private createdAt: number;

	constructor(
		target: string,
		slug = random(8),
		createdAt = new Date().getTime(),
	) {
		this.target = target;
		this.slug = slug;
		this.createdAt = createdAt;
	}

	getTarget(): string {
		return this.target;
	}

	getSlug(): string {
		return this.slug;
	}

	getCreatedAt(): number {
		return this.createdAt;
	}
}
