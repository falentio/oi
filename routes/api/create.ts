import type { Handlers } from "$fresh/server.ts";
import { shortenerHandler } from "~/singleton.ts";

export const handler: Handlers = {
	async POST(req, ctx) {
		const { target, slug } = await req.json().catch(e => ({}))
		if (!target) {
			return new Response("target field is required", {
				status: 400,
			})
		}
		return shortenerHandler.create(target, slug)
	}
}