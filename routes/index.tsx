import { PageProps } from "$fresh/server.ts";
import ShortenerForm from "~/islands/ShortenerForm.tsx";

export default function Home(props: PageProps) {
	return (
		<>
			<main class="container my-auto mx-auto flex flex-col p-4 bg-white shadow-md ring-1 ring-black">
				<section class="mb-6">
					<h1 class="text-3xl"> Oi!!! </h1>
					<span> URL Shortener nya Kevin Falentio </span>
				</section>
				<div class="w-full rounded shadow border border-black">
					<ShortenerForm />
				</div>
			</main>
		</>
	);
}
