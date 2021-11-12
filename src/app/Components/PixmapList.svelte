<script lang="ts">
    import { Pixmap as PixmapType } from '../types/core';
    import Pixmap from './Pixmap.svelte';

    export let pixmaps: PixmapType[] = [];
</script>


<div>
    This is pixmap list
    {#each pixmaps as pixmap}
        <Pixmap {pixmap}/>
    {/each}
</div>
