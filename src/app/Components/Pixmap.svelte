<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import {Pixmap} from '../types/core';

    const dispatch = createEventDispatcher();

    export let pixmap: Pixmap;
    let label = pixmap?.id || '???';

    function handlePixmapClicked() {
        dispatch('pixmapClicked', {pixmap});
    }

</script>

<div>
    <div id="content" on:click={handlePixmapClicked}>
        {label}
        <div id="tooltip">{label}</div>
    </div>
</div>

<style>
    #content {
        padding: 5px;
        width: 100%;
        height: 100%;
        position: relative;
        display: inline-block;
    }

    #tooltip {
        visibility: hidden;
        width: auto;
        background-color: black;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 10px;

        /* Position the tooltip */
        position: absolute;
        z-index: 1000;
        top: -5px;
        left: 5em;
    }

    #content:hover {
        background: #dddddd;
    }

    #content:hover #tooltip {
        visibility: visible;
    }
</style>