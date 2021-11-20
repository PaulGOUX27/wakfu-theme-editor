<script lang="ts">

    import {Pixmap} from '../../types/core';
    import PixmapList from '../../Components/PixmapList.svelte';
    import {themeStore} from '../../stores/themeStore';
    import {textureFilesStore} from '../../stores/textureFilesStore';

    let selectedPixmap: Pixmap = null;
    let canvas;

    function handlePixmapClicked(event) {
        selectedPixmap = event.detail.pixmap;
    }


    $: {
        const PNGdata: Uint8Array = $textureFilesStore[selectedPixmap?.texture];
        if(canvas && PNGdata) {
            canvas.height = selectedPixmap.height;
            canvas.width=selectedPixmap.width;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            createImageBitmap(new Blob([PNGdata]), selectedPixmap.x, selectedPixmap.y, selectedPixmap.width, selectedPixmap.height)
            .then((bitmap) => {
                ctx.drawImage(bitmap, 0, 0);
            });
        }
    }

</script>

<main>
    <div id="pixmap-list">
        <PixmapList pixmaps={$themeStore?.pixmaps} on:pixmapClicked={handlePixmapClicked}/>
    </div>
    <div id="content">
        {#if !selectedPixmap}
            <div>Select a pixmap in the list</div>
        {:else}
            <div>{selectedPixmap?.id}</div>
            <canvas id="canvas" bind:this={canvas} ></canvas>
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
        background-color: white;
    }

    #content {
        z-index: 1;
        margin-left: 21%;
    }

    #canvas {
        border: solid red;
    }
</style>
