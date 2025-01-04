<script>
    import { createEventDispatcher } from 'svelte';
    import { marked } from 'marked'; // Import the marked library
  
    export let documentsList = [];
    const dispatch = createEventDispatcher();
    let searchQuery = '';
  
    function selectDoc(doc) {
      dispatch('doc', { doc });
    }
  
  </script>
  
  <div>
		{#if documentsList.length > 0}
			<button on:click={() => documentsList = []} style="width: 100%;padding: 0.3rem;background-color: #cecece; border: none; cursor: pointer;">
        Clean AI Filter
      </button>
		{/if}		
  </div>


  <ul style="list-style-type: none; padding: 0;">
		{#each documentsList as doc, index}
      <li style="padding: 0; border-bottom: 1px solid #ccc; list-style-type: none;">
        <button 
          type="button" 
          on:click={() => selectDoc(doc.doc)} 
          on:keypress={(e) => e.key === 'Enter' && selectDoc(doc)} 
          style="cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;">
          <strong>{doc.doc}  </strong>
          <p>{doc.chunk.slice(0,100)}...</p>
        </button>
      </li>
    {/each}
  </ul>
  
  <style>
    li:hover {
      background-color: #f0f0f0;
    }
		input {
			padding: 0.35rem!important;
			margin-left: -8px!important;
			font-size: 0.9rem;
		}
  </style>