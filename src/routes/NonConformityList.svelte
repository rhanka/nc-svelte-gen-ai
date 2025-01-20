<script>
    import { createEventDispatcher } from 'svelte';
    import { referencesList, filteredNonConformities } from './store.js';

    export let nonConformities = [];
	export let num = 0;
	export let nonConformitiesFilter = [];

    const dispatch = createEventDispatcher();
    let searchQuery = '';

    function selectItem(item) {
      dispatch('select', { item });
    }

	const orderMap = nonConformitiesFilter.reduce((acc, item, index) => {
		acc[item.doc] = index;
		return acc;
	}, {});

	$:	$filteredNonConformities = nonConformities
			.filter(item => nonConformitiesFilter.some(n => n.doc === item['nc_event_id']))
			.map(item => {
				item.highlights = nonConformitiesFilter
					.filter(n => n.doc === item['nc_event_id'])
					.map(n => n.content);
				return item;
			})
			.sort((a, b) => orderMap[a['nc_event_id']] - orderMap[b['nc_event_id']]);
	// }

	$: num = $filteredNonConformities.length;

	$: console.log(nonConformitiesFilter)
  </script>

  <div>
	{#if nonConformitiesFilter.length === 0}
	    <!-- <input
	      id="search"
	      type="text"
	      bind:value={searchQuery}
	      placeholder="Search by ID, category, or description"
	    /> -->
	{:else}
		<button
			on:click={() => { nonConformitiesFilter = []; $referencesList = ''}}
			style="width: 100%;padding: 0.3rem;background-color: #cecece; border: none; cursor: pointer;"
		>
        	Clean AI Filter
      	</button>
	{/if}
  </div>
  <div class="scrollable">
	<ul style="list-style-type: none; padding: 0;">
			{#each $filteredNonConformities as item, index}
		<li style="padding: 0; border-bottom: 1px solid #ccc; list-style-type: none;">
			<button
			type="button"
			on:click={() => selectItem(item)}
			on:keypress={(e) => e.key === 'Enter' && selectItem(item)}
			style="cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;">
			<strong>{item['ATA_code']} - {item['ATA_category']} - {item['nc_event_date'].slice(0, 10)} </strong>
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