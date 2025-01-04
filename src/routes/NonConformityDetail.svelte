<script>
    import { createEventDispatcher } from 'svelte';
    import NonConformityTask from './NonConformityTask.svelte';

    export let selectedItem;
    const dispatch = createEventDispatcher();
  
    function closeDetail() {
      dispatch('closeDetail');
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
  
    <div style="padding-left: 16px;padding-right: 8px; background-color: #f9f9f9;">
			<button 
          type="button" 
          on:click={closeDetail} 
          on:keypress={(e) => e.key === 'Enter' && closeDetail} 
          style="cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;">
	      <h2>
		  		<span	style="margin-left:-16px; padding: 0 8px; color: #aaa" title="close"></span>
					{selectedItem['ATA_category']} - {selectedItem['nc_event_id']} - {selectedItem['nc_event_date'].replace(/:..\..*/,"")}
				</h2>
				
			</button>
	    <p><strong>{selectedItem['analysis_history']['000'][0]['label']}</strong> </p>
      <h3>Status History:</h3>
				 <NonConformityTask expand={true} task={"Non-Conformity Report"} history={selectedItem['analysis_history']['000']}/>
				 <NonConformityTask task={"Task 100 - Analysis"} history={selectedItem['analysis_history']['100']}/>
				 <NonConformityTask task={"Task 200 - Analysis Validation"} history={selectedItem['analysis_history']['200']}/>
				 <NonConformityTask task={"Task 300 - Stress Analysis"} history={selectedItem['analysis_history']['300']}/>
				 <NonConformityTask task={"Task 400 - Stress Analysis Validation"} history={selectedItem['analysis_history']['400']}/>
				 <NonConformityTask expand={true} task={"Task 500 - Final Analysis Validation"} history={selectedItem['analysis_history']['500']}/>
					
		</div>
    <div style="padding-left: 16px;padding-right: 8px; text-align: right; background-color: #f9f9f9;">
      <button on:click={closeDetail} style="padding: 0.5rem 1rem; background-color: #6200ee; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Back to List
      </button>
    </div>
  
  <style>
    li:hover {
      background-color: #f0f0f0;
    }
  </style>