import {
	ShortenerHandler,
	ShortenerStorageDeta,
} from "./services/shortener/shortener.ts";

const shortenerStorage = new ShortenerStorageDeta(
	Deno.env.get("DETABASE_KEY")!,
	Deno.env.get("DETABASE_NAME") ?? "oi-shortener",
);

export const shortenerHandler = new ShortenerHandler(shortenerStorage);
