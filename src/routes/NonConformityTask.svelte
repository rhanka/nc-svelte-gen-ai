<script>
  import { marked } from 'marked'; // Import the marked library

	export let task;
	export let history;
	export let expand;
	
</script>

<div style="padding: 0; border-bottom: 1px solid #eee; margin-top:-2px; list-style-type: none;">
	{#if task}
		<button 
          type="button" 
          on:click={() => {expand = !expand}} 
          on:keypress={(e) => e.key === 'Enter' && selectItem(item)} 
          style="cursor: pointer; padding: 0px; width: 100%; text-align: left; border: none; background: #eee;">
					<h3>
						<span style="padding: 0 8px;">{expand ? '-' : '+'}</span>
						{task}
					</h3>
		</button>
	{/if}
	{#if history && expand}
		{#each history as step}
			<li style="padding: 8px; border-bottom: 1px solid #eee;">
				<h4>{step.label} - {step.date.replace(/:..\..*/,"")}</h4>
				<div>
					{@html marked(step.description.replace(/###/g,'####'))}
				</div>
			</li>
		{/each}
	{/if}
</div>

<style>
  li {
    padding: 1rem;
	  transition: width 0.3s;
  }
</style>

