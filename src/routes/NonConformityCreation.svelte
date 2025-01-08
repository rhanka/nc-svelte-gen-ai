<script>
    import NonConformityTask from './NonConformityTask.svelte';
    import NonConformityTaskCreation from './NonConformityTaskCreation.svelte';
	import Input from './Input.svelte';
	import { resetCreatedItem, createdItem, updateCreatedItem } from './store.js';
    import { onMount } from 'svelte';
    import { on } from 'svelte/events';
    import '@fortawesome/fontawesome-free/css/all.css';


	$: if ($updateCreatedItem) {
		$createdItem.analysis_history[$updateCreatedItem.role][0] = {
			label: $updateCreatedItem.label,
			description: $updateCreatedItem.description
		};
		$updateCreatedItem = null;
	}

	$: if ($createdItem && $createdItem.analysis_history) {
		$createdItem = $createdItem
	}

    // Directive to inject HTML
    function html(node, htmlContent) {
		node.innerHTML = htmlContent;

		return {
			update(newHtml) {
				node.innerHTML = newHtml;
       	 	}
		};
    }
</script>

{#if $createdItem && $createdItem.analysis_history}
	<div style="padding-left: 16px;padding-right: 8px; background-color: #f9f9f9;">
		<h2 style="display: flex;justify-content: space-between;align-items:center">
			<div>
					<Input label="Part Number" bind:value={$createdItem['part_num']}/> -
					<Input label="Date" bind:value={$createdItem['nc_event_date']}/>
			</div>
			<div style="align:right;padding-right:0.5rem">
				<button style="align:right;border:none;background:none;" on:click={resetCreatedItem}>
					<i style="font-size: 1rem;" class="fas fa-trash-alt"></i> <!-- Logout icon -->
				</button>
			</div>
		</h2>
		<Input label="Role" bind:value={$createdItem['role']}/> -
		<Input label="Author" bind:value={$createdItem['name']}/>
		<h3>Tasks:</h3>
		{#each ['000', '100', '200', '300', '400', '500'] as task}
			<NonConformityTaskCreation
				dropzone={task === '000'}
				expand={task === '000'}
				aiHelp={['000','100'].includes(task)}
				task={task}
				bind:history={$createdItem.analysis_history[task]}
			>
			</NonConformityTaskCreation>
		{/each}
	</div>
{/if}
<style>
    li:hover {
      background-color: #f0f0f0;
    }
</style>