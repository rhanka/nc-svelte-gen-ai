<script>
    import NonConformityTask from './NonConformityTask.svelte';
    import NonConformityTaskCreation from './NonConformityTaskCreation.svelte';
	import Input from './Input.svelte';
	import { createdItem, updateCreatedItem } from './store.js';

	let history = {
		'000': [],
		'100': [],
		'200': [],
		'300': [],
		'400': [],
		'500': []
	};

		$createdItem = {
			currentTask: '000',
			ATA_code: "ATA-28",
			part_num: "ATA-281-15553-102",
			nc_event_id: "ATA-28-xxx",
			role: 'Quality Controler',
			name: "Eric Roy",
			nc_event_date: (new Date()).toISOString().replace(/T.*/,""),
			analysis_history: {
				"000": history['000'],
				"100": history['100'],
				"200": history['200'],
				"300": history['300'],
				"400": history['400'],
				"500": history['500'],
			}
		};

		$: if ($updateCreatedItem) {
			history[$updateCreatedItem.role][0] = {
				label: $updateCreatedItem.label,
				description: $updateCreatedItem.description
			};
			$updateCreatedItem = null;
		}

		$: if (
			$createdItem.part_num ||
			$createdItem.nc_event_id ||
			$createdItem.nc_event_date ||
			history['000'] ||
			history['100'] ||
			history['200'] ||
			history['300'] ||
			history['400'] ||
			history['500']
		) { $createdItem = $createdItem };

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

<div style="padding-left: 16px;padding-right: 8px; background-color: #f9f9f9;">
	<button
		type="button"
		style="cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;">
		<h2>
			<span style="margin-left:-16px; padding: 0 8px; color: #aaa" title="close"></span>
				<Input label="Part Number" bind:value={$createdItem['part_num']}/> -
				<Input label="Date" bind:value={$createdItem['nc_event_date']}/>
			</h2>
				<Input label="Role" bind:value={$createdItem['role']}/> -
				<Input label="Author" bind:value={$createdItem['name']}/>

	</button>
	<h3>Tasks:</h3>
	{#each ['000', '100', '200', '300', '400', '500'] as task}
		<NonConformityTaskCreation
			dropzone={task === '000'}
			expand={task === '000'}
			aiHelp={['000','100'].includes(task)}
			task={task}
			bind:history={history[task]}
		>
		</NonConformityTaskCreation>
	{/each}
</div>

<style>
    li:hover {
      background-color: #f0f0f0;
    }
</style>