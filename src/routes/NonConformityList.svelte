<script>
    import { createEventDispatcher } from 'svelte';
  
    export let nonConformities = [];
		export let num = 0;
		export let nonConformitiesFilter = [];
		let filteredItems = [];
    const dispatch = createEventDispatcher();
    let searchQuery = '';
  
    function selectItem(item) {
      dispatch('select', { item });
    }
   
    // Filter items based on the search
    $: filteredItems = nonConformities.filter(item => {
	      const query = searchQuery.toLowerCase();
	      return (
	        item['nc_event_id'].toLowerCase().includes(query) ||
	        item['ATA_category'].toLowerCase().includes(query) ||
	        JSON.stringify(item['analysis_history']).toLowerCase().includes(query) // Added description to the search
	      );
	    }).filter(item => {
				if (nonConformitiesFilter.length > 0) {
					return nonConformitiesFilter.some(n => n.doc === item['nc_event_id'])
				} else {
					return true;
				} 
			})
			.sort((a, b) => new Date(b['nc_event_date']) - new Date(a['nc_event_date']));;
		$: num = filteredItems.length;

		$: console.log(nonConformitiesFilter)
  </script>
  
  <div style="align-content:center">
	    <input
	      id="search"
	      type="text"
	      bind:value={searchQuery}
	      placeholder="Search by ID, category, or description"
	    />
		{#if nonConformitiesFilter.length > 0}
			<button 
				on:click={() => nonConformitiesFilter = []}
				style="width: 100%;padding: 0.3rem;background-color: #cecece; border: none; cursor: pointer;"
				>
        Clean AI Filter
      </button>
		{/if}

		
  </div>


  <ul style="list-style-type: none; padding: 0;">
		{#each filteredItems as item, index}
      <li style="padding: 0; border-bottom: 1px solid #ccc; list-style-type: none;">
        <button 
          type="button" 
          on:click={() => selectItem(item)} 
          on:keypress={(e) => e.key === 'Enter' && selectItem(item)} 
          style="cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;">
          <strong>{item['ATA_code']} - {item['ATA_category']} - {item['nc_event_date'].slice(0, 10)}  </strong>
          <p>{item['analysis_history']['000'][0]['label'].slice(0, 100)}...</p>
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
			margin-bottom: 1rem;
			width: 285px;
			font-size: 0.9rem;
		}
  </style>