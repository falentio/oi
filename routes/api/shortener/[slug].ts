import type { Handlers } from "$fresh/server.ts";
import { shortenerHandler } from "~/singleton.ts";

export const handler: Handlers = {
	DELETE(req, ctx) {
		const slug = ctx.params.slug
		return shortenerHandler.delete(slug)
	},
}