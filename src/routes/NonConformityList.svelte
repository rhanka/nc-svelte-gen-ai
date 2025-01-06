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
    $: if (!searchQuery && nonConformitiesFilter.length === 0) {
	  filteredItems = nonConformities;
	} else if (searchQuery && nonConformitiesFilter.length === 0) {
		const query = searchQuery.toLowerCase();
		filteredItems = nonConformities.filter(item => {
			return (
			item['nc_event_id'].toLowerCase().includes(query) ||
			item['ATA_category'].toLowerCase().includes(query) ||
			JSON.stringify(item['analysis_history']).toLowerCase().includes(query) // Added description to the search
			);
		});
	} else {
		filteredItems = nonConformities
			.filter(item => nonConformitiesFilter.some(n => n.doc === item['nc_event_id']))
			.map(item => {
				return {
					...item,
					relevance_score: nonConformitiesFilter
						.filter(n => n.doc === item['nc_event_id'])
						.reduce((maxScore, n) => Math.max(maxScore, n.relevance_score), 0)
				}
			})
			.sort((a, b) => a.relevance_score - b.relevance_score)
	}

	$: num = filteredItems.length;

	$: console.log(nonConformitiesFilter)
  </script>

  <div>
	{#if nonConformitiesFilter.length === 0}
	    <input
	      id="search"
	      type="text"
	      bind:value={searchQuery}
	      placeholder="Search by ID, category, or description"
	    />
	{:else}
		<button
			on:click={() => nonConformitiesFilter = []}
			style="width: 100%;padding: 0.3rem;background-color: #cecece; border: none; cursor: pointer;"
		>
        	Clean AI Filter
      	</button>
	{/if}
  </div>
  <div class="scrollable">
	<ul style="list-style-type: none; padding: 0;">
			{#each filteredItems as item, index}
		<li style="padding: 0; border-bottom: 1px solid #ccc; list-style-type: none;">
			<button
			type="button"
			on:click={() => selectItem(item)}
			on:keypress={(e) => e.key === 'Enter' && selectItem(item)}
			style="cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;">
			<strong>{item['ATA_code']} - {item['ATA_category']} - {item['nc_event_date'].slice(0, 10)}  </strong>
			<p style="margin-top:0.5rem;margin-bottom:0">{item['analysis_history']['000'][0]['label'].slice(0, 100)}...</p>
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
		margin-bottom: 1rem;
		width: 22vw;
		font-size: 0.9rem;
	}
	.scrollable {
		max-height: 20vh;
		overflow-y: auto;
		width:100%;
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