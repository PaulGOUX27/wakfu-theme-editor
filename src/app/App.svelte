<script lang="ts">
  import {getTheme} from './services/wakfuCDNClient';
  import PixmapView from './Views/Pixmaps/PixmapView.svelte';

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
  <PixmapView {data}/>
</main>

<style>
</style>
