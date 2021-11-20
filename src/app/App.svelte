<script lang="ts">
  import {getTheme} from './services/wakfuCDNClient';
  import PixmapView from './Views/Pixmaps/PixmapView.svelte';
  import {themeStore} from './stores/themeStore';

  async function download() {
    try {
      themeStore.set(await getTheme());
    } catch (e) {
      console.error('e', e);
    }
  }
</script>

<main>
  <button on:click={download}>Load theme</button>
  <PixmapView/>
</main>

<style>
</style>
