import { useReducer, useState } from "preact/hooks";

export interface ShortenerFormProps {
}

export default function ShortenerForm({}: ShortenerFormProps) {
	const [target, setTarget] = useState("");
	const [loading, setLoading] = useState<boolean>(false)
	const [success, setSuccess] = useState<boolean>(false)
	const [error, setError] = useState<boolean>(false)

	function change(e) {
		setTarget(e.target.value)
	}

	async function create() {
		setLoading(true)
		setError(false)
		const response = await fetch("/api/create", {
			method: "POST",
			body: JSON.stringify({
				target,
			}),
		})
		if (!response.ok) {
			setLoading(false)
			setError(true)
			return
		}
		const { slug } = await response.json()
		const url = new URL(slug, window.location).href
		setLoading(false)
		setSuccess(true)
		setTarget(url)
	}

	async function copy() {
		try {
			await window.navigator.clipboard.writeText(target)
		} catch {}
	}

	function validUrl(u: unknown) {
		try {
			new URL(u as string)
			return true
		} catch {
			return false
		}
	}

	return (
		<form
			class="flex flex-col px-2"
			onSubmit={(e) => e.preventDefault()}
			onKeyDown={change}
			onKeyUp={change}
		>
			<label class="flex flex-col my-2">
				<span class="p-1">{ success  ? "Yeay berhasil" : "Masukkan link mu"}</span>
				<input
					class="ring-blue-400 focus:ring-2 bg-gray-100 rounded focus:outline-none p-2"
					type="url"
					name="target"
					value={target}
					placeholder="https://falentio.com"
				/>
			</label>

			<div class="flex flex-row justify-end my-2">
				<button 
					onClick={(e) => {
						e.preventDefault()
						setTarget("")
						setLoading(false)
						setSuccess(false)
						setError(false)
					}}
					disabled={!success}
					class="mx-1 p-2 rounded shadow w-max ring-blue-400 ring-1 focus:outline-none hover:bg-blue-400 hover:text-white disabled:bg-gray-300 disabled:text-gray-100 disabled:ring-gray-300"
				>
					Clear
				</button>
				<button 
					onClick={(e) => {
						e.preventDefault()
						copy()
					}}
					disabled={!success || !("clipboard" in window.navigator)}
					class="mx-1 p-2 rounded shadow w-max ring-blue-400 ring-1 focus:outline-none hover:bg-blue-400 hover:text-white disabled:bg-gray-300 disabled:text-gray-100 disabled:ring-gray-300"
				>
					Copy
				</button>
				<button 
					onClick={(e) => {
						e.preventDefault()
						create()
					}}
					disabled={loading || success || error || !validUrl(target)}
					class="mx-1 p-2 rounded shadow w-max ring-blue-400 ring-1 focus:outline-none hover:bg-blue-400 hover:text-white disabled:bg-gray-300 disabled:text-gray-100 disabled:ring-gray-300"
				>
					Create
				</button>
			</div>

			{error && <span class="bg-red-300 w-full p-2 my-2 rounded">
				Gagal membuat link... :(
			</span>}
		</form>
	);
}
