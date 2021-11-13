<script lang="ts">
  import {getTheme} from './services/wakfuCDNClient';
  import PixmapList from './Components/PixmapList.svelte';

  let data;

  async function download() {
    try {
      data = await getTheme();
    } catch (e) {
      console.error('e', e);
    }
  }
</script>

<main>
  <button on:click={download}>Load theme</button>
  <PixmapList pixmaps={data?.pixmaps}/>
</main>

<style>
</style>
