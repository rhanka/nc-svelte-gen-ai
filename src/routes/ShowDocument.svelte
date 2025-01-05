<svelte:options runes={false} />
<script>
	import PdfViewer from 'svelte-pdf';

    export let url = null;

    $: console.log('pdf',url);
</script>

{#if url}
    <PdfViewer url={url} />
{/if}