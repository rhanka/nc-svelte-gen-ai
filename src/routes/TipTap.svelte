<script>
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
    import { Markdown } from 'tiptap-markdown';

    export let value;
	let element;
	let editor;

    $: if (editor)  {
        editor.commands.setContent(value);
    }

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
                StarterKit,
                Markdown
                ],
			content: value,
            onUpdate: ({ editor }) => {
                const content = editor.storage.markdown.getMarkdown();
                if (value !== content) {
                    value = content;
                }
            },
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div bind:this={element} />

<style>
	:global(.ProseMirror-focused) {
        border: none!important;
        outline: none!important;
    }

    :global(.tiptap > ul > li) {
        padding-bottom: 0.5rem;
    }
</style>