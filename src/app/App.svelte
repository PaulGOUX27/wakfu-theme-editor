<script lang="ts">
  import { getTheme } from './services/wakfuCDNClient';

  let data;

  async function download() {
    try {
      data = JSON.stringify(await getTheme());
      console.log('done');
    } catch (e) {
      console.log(e);
    }
  }
</script>

<main>
  bonjour
  <button on:click={download}>Download</button>
  <textarea value={data} />
</main>

<style>
</style>
