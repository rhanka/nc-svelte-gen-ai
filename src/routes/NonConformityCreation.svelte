<script>
    import { createEventDispatcher } from 'svelte';
    import NonConformityTask from './NonConformityTask.svelte';
    import NonConformityTaskCreation from './NonConformityTaskCreation.svelte';
		import Input from './Input.svelte';
	  import { createdItem, updateCreatedItem } from './store.js';

		let history000 = [];
		let history100 = [];
		let history200 = [];
		let history300 = [];
		let history400 = [];
		let history500 = [];

		$createdItem = {
			ATA_code: "ATA-28",
			part_num: "ATA-281-15553-102",
			nc_event_id: "ATA-28-xxx",
			role: 'Quality Controler',
			name: "Eric Roy",
			nc_event_date: (new Date()).toISOString().replace(/T.*/,""),
			analysis_history: {
				"000": history000,
				"100": history100,
				"200": history200,
				"300": history300,
				"400": history400,
				"500": history500
			}
		};

		$: if ($updateCreatedItem && $updateCreatedItem.role === '000') {
			history000[0].label = $updateCreatedItem.label
			history000[0].description = $updateCreatedItem.description
		}

		$: if (
			$createdItem.part_num ||
			$createdItem.nc_event_id ||
			$createdItem.nc_event_date ||
			history000 ||
			history100 ||
			history200 ||
			history300 ||
			history400 ||
			history500
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
		  		<span	style="margin-left:-16px; padding: 0 8px; color: #aaa" title="close"></span>
					<Input label="Part Number" bind:value={$createdItem['part_num']}/> -
					<Input label="Date" bind:value={$createdItem['nc_event_date']}/>
				</h2>
					<Input label="Role" bind:value={$createdItem['role']}/> -
					<Input label="Author" bind:value={$createdItem['name']}/>

			</button>
      <h3>Tasks:</h3>
				 <NonConformityTaskCreation dropzone={true} expand={true} task={"Non-Conformity Report"} bind:history={history000}/>
				 <NonConformityTaskCreation task={"Task 100 - Analysis"} bind:history={history100}/>
				 <NonConformityTaskCreation task={"Task 200 - Analysis Validation"} bind:history={history200}/>
				 <NonConformityTaskCreation task={"Task 300 - Stress Analysis"} bind:history={history300}/>
				 <NonConformityTaskCreation task={"Task 400 - Stress Analysis Validation"} bind:history={history400}/>
				 <NonConformityTaskCreation task={"Task 500 - Final Analysis Validation"} bind:history={history500}/>

		</div>

  <style>
    li:hover {
      background-color: #f0f0f0;
    }
  </style>