import { PageProps } from "$fresh/server.ts";
import type { Handlers } from "$fresh/server.ts";
import { shortenerHandler } from "~/singleton.ts";

export const handler: Handlers = {
	async GET(req, ctx) {
		const slug = ctx.params.slug as string
		const response = await shortenerHandler.get(slug)
		if (response.status === 404) {
			const response = await ctx.render()
			return new Response(response.body, { 
				headers: response.headers,
				status: 404,
			})
		}
		return response
	},
}

export default function NotFound(props: PageProps) {
	return <section class="flex-auto">
		<h1 class="text-5xl font-bold"> 404 Not Found </h1>
	</section>;
}
