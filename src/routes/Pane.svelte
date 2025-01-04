<script>
	export let title;
	export let num;
	export let expand;
</script>
	<ul style="list-style-type: none; padding: 0;">
		<li style="padding: 8px; border-bottom: 1px solid #eee;">
			<button 
          type="button" 
          on:click={() => expand=!expand} 
          on:keypress={(e) => e.key === 'Enter' && selectItem(item)} 
          style="text-transform: uppercase;cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;">
          <span>{expand ? '-' : '+'}</span>
          {title}
					{#if num !== undefined}
						({num})
					{/if}
						
			</button>
		</li>

		{#if expand}
		<li style="padding: 8px; border-bottom: 1px solid #eee;">
			<slot/>
		</li>
		{/if}
	</ul>

<style>
	li {
		transition: 0.3s;
	}
</style>