<script lang="ts">
  import {getTheme} from './services/wakfuCDNClient';
  import PixmapList from './Components/PixmapList.svelte';

  let data;

  async function download() {
    try {
      data = await getTheme();
    } catch (e) {
      console.log(e);
    }
  }
</script>

<main>
  <button on:click={download}>Download</button>
  <textarea value={JSON.stringify(data)} />
  <PixmapList pixmaps={data?.pixmaps}/>
</main>

<style>
</style>
