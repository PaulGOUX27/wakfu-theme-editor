<script lang="ts">
	import { downloadJSONThemeFromWakfu } from "./services/theme-download";

	let data;

	async function download() {
		try {
			data = JSON.stringify(await downloadJSONThemeFromWakfu());
		}catch (e) {
			console.log(e)
		}
	}
</script>

<main>
	bonjour
	<button on:click={download}>Download</button>
	<pre>
		{data}
	</pre>
</main>

<style>
</style>