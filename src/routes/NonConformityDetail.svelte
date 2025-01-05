<script>
    import NonConformityTask from './NonConformityTask.svelte';

    export let selectedItem;

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
					{selectedItem['ATA_category']} - {selectedItem['nc_event_id']} - {selectedItem['nc_event_date'].replace(/:..\..*/,"")}
				</h2>

			</button>
	    <p><strong>{selectedItem['analysis_history']['000'][0]['label']}</strong> </p>
      <h3>Status History:</h3>
        {#each ['000', '100', '200', '300', '400', '500'] as task}
          <NonConformityTask
            expand={['000','500'].includes(task)}
            task={task}
            history={selectedItem['analysis_history']['000']}
          >
          </NonConformityTask>
        {/each}
		</div>

  <style>
    li:hover {
      background-color: #f0f0f0;
    }
  </style>