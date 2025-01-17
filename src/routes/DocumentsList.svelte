<script>
    import { createEventDispatcher } from 'svelte';
    import { marked } from 'marked'; // Import the marked library
    import { referencesList } from './store';

    export let documentsList = [];
    const dispatch = createEventDispatcher();
    let searchQuery = '';

    function selectDoc(doc) {
      dispatch('selectDoc', { doc });
    }

  </script>

  <div>
		{#if documentsList.length > 0}
			<button
        on:click={() => {documentsList = []; $referencesList = '' }}
        style="width: 100%;padding: 0.3rem;background-color: #cecece; border: none; cursor: pointer;"
      >
        Clean AI Filter
      </button>
		{/if}
  </div>

  <div class="scrollable">
    <ul style="list-style-type: none; padding: 0;">
      {#each documentsList as doc, index}
        <li style="padding: 0; border-bottom: 1px solid #ccc; list-style-type: none;">
          <button
            type="button"
            on:click={() => selectDoc(doc)}
            on:keypress={(e) => e.key === 'Enter' && selectDoc(doc)}
            style="cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;">
            <strong>{doc.doc.replace(/\.md$/,'.pdf')}  </strong>
            <p style="margin-top:0.2rem;margin-bottom:0rem;">{doc.chunks[0].chunk.slice(0,100)}...</p>
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <style>
    li:hover {
      background-color: #f0f0f0;
    }
		input {
			padding: 0.35rem!important;
			margin-left: -8px!important;
			font-size: 0.9rem;
		}

    .scrollable {
		max-height: 20vh;
		overflow-y: auto;
    overflow-x: hidden;
	}

	.scrollable::-webkit-scrollbar {
		width: 12px; /* Width of the scrollbar */
	}

	.scrollable::-webkit-scrollbar-track {
		background: #f1f1f1; /* Background of the scrollbar track */
	}

	.scrollable::-webkit-scrollbar-thumb {
		background: #888; /* Color of the scrollbar thumb */
		border-radius: 10px; /* Rounded corners for the scrollbar thumb */
	}

  </style>