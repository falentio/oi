import { assertEquals, assertNotEquals } from "std/testing/asserts.ts";
import {
	ShortenerError,
	ShortenerHandler,
	ShortenerStorageMemory,
	ShortenerStorageDeta,
	ShortenerUrl,
} from "./shortener.ts";

Deno.test("shortener", {}, async (t) => {
	await t.step("url", async (t) => {
		await t.step("random slug should be unique", () => {
			const a = new ShortenerUrl("https://foo")
			const b = new ShortenerUrl("https://foo")
			assertNotEquals(a.getSlug(), b.getSlug())
		})
	})
	
	await t.step("memory storage", async (t) => {
		const storage = new ShortenerStorageMemory();

		await t.step("should null when not exists", async () => {
			const result = await storage.get("non exists key")
			assertEquals(null, result);
		})

		await t.step("should able to create", async () => {
			const url = new ShortenerUrl("https://foo.example");
			await storage.create(url);
			const res = await storage.get(url.getSlug());
			assertNotEquals(res, null)
			assertEquals(res.getSlug(), url.getSlug());
			assertEquals(res.getTarget(), url.getTarget());
			assertEquals(res.getCreatedAt(), url.getCreatedAt());
		})

		await t.step("should able to delete", async () => {
			const url = new ShortenerUrl("https://foo.example");
			await storage.create(url);
			await storage.delete(url.getSlug())
			const res = await storage.get(url.getSlug())
			assertEquals(res, null)
		})
	});

	await t.step("deta storage", async (t) => {
		const storage = new ShortenerStorageDeta(
			Deno.env.get("DETABASE_KEY")!,
			Deno.env.get("DETABASE_NAME") ?? "oi-shortener-testing",
		);

		await t.step("should null when not exists", async () => {
			const result = await storage.get("non exists key")
			assertEquals(null, result);
		})

		await t.step("should able to create", async () => {
			const url = new ShortenerUrl("https://foo.example");
			await storage.create(url);
			const res = await storage.get(url.getSlug());
			assertNotEquals(res, null)
			assertEquals(res.getSlug(), url.getSlug());
			assertEquals(res.getTarget(), url.getTarget());
			assertEquals(res.getCreatedAt(), url.getCreatedAt());
		})

		await t.step("should able to delete", async () => {
			const url = new ShortenerUrl("https://foo.example");
			await storage.create(url);
			await storage.delete(url.getSlug())
			const res = await storage.get(url.getSlug())
			assertEquals(res, null)
		})
	});

	await t.step("handler", async (t) => {
		const storage = new ShortenerStorageMemory();
		const handler = new ShortenerHandler(storage);

		await t.step("should successful to create", async () => {
			const res = await handler.create("https://foo.example", "foo");
			assertEquals(res.status, 201);
			assertEquals(res.headers.get("content-type"), "application/json")
			assertEquals(await res.json(), { slug: "foo" });
		});

		await t.step("should successful to redirect", async () => {
			await handler.create("https://bar.example", "bar");
			const res = await handler.get("bar");
			assertEquals(res.status, 307);
			assertEquals(res.headers.get("location"), "https://bar.example");
		});

		await t.step("should return 404 when not exists", async () => {
			const res = await handler.get("baz");
			assertEquals(res.status, 404);
		});

		await t.step("should send appropirate head", async () => {
			let res = await handler.head("qux");
			assertEquals(res.status, 404);

			await handler.create("https://qux.example", "qux");

			res = await handler.head("qux");
			assertEquals(res.status, 200);
		});

		await t.step("should able to delete", async () => {
			await handler.create("https://del.example", "del");
			await handler.delete("del")
			const res = await handler.get("del");
			assertEquals(res.status, 404);
		})
	});
});
