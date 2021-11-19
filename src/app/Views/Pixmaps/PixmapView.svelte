<script lang="ts">

    import {Pixmap} from '../../types/core';
    import PixmapList from '../../Components/PixmapList.svelte';

    export let data;
    let selectedPixmap: Pixmap = null;

    function handlePixmapClicked(event) {
        selectedPixmap = event.detail.pixmap;
    }

</script>

<main>
    <div id="pixmap-list">
        <PixmapList pixmaps={data?.pixmaps} on:pixmapClicked={handlePixmapClicked}/>
    </div>
    <div id="content">
        {#if !selectedPixmap}
            <div>Select a pixmap on the list</div>
        {:else}
            <div>{selectedPixmap?.id}</div>
        {/if}
    </div>

</main>

<style>
    #pixmap-list {
        display: block;
        width: 250px;
        position: fixed;
        overflow-x: hidden;
        overflow-y: scroll;
        height: 100%;
    }

    #content {
        z-index: 1;
        margin-left: 21%;
    }
</style>
