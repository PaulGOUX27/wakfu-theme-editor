<script lang="ts">
    import {Pixmap} from '../types/core';

    export let pixmap: Pixmap;
</script>

<div>
    <p>{pixmap?.id || '???'}</p>
</div>