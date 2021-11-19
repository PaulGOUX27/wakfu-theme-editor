<script lang="ts">
    import { Pixmap as PixmapType } from '../types/core';
    import Pixmap from './Pixmap.svelte';

    export let pixmaps: PixmapType[] = [];

    let value = '';

    // TODO pixmaps without id are not here
    $: filteredPixmaps = pixmaps.filter(pixmap => pixmap.id?.toLowerCase().includes(value.toLocaleString()));
</script>


<div>
    <input type="text" bind:value/>
    {#each filteredPixmaps as pixmap}
        <hr/>
        <Pixmap on:pixmapClicked {pixmap}/>
    {/each}
</div>

<style>
    hr {
        margin: 0px;
    }
</style>
