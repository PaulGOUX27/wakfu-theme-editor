<script lang="ts">
  import {getTheme} from './services/wakfuCDNClient';
  import PixmapList from './Components/PixmapList.svelte';
  import {saveTheme} from './services/appFileManager';

  let data;

  async function download() {
    try {
      data = await getTheme();
      await saveTheme(data);
    } catch (e) {
      console.error('e', e);
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
