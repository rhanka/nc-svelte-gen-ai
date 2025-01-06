<script>
	export let title;
	export let num;
	export let expand = false;
	let mounted = expand;

	$: if (expand === true) {
		mounted = true;
	}

	$: console.log('expand',expand);


</script>
<ul style="list-style-type: none; margin:0; padding: 0;">
	<li class="smooth" style="z-index:100;background: #fff;padding: 8px; border-bottom: 1px solid #eee;">
		<button
			type="button"
			on:click={() => expand=!expand}
			on:keypress={(e) => { if (e.key === 'Enter') {expand=!expand}}}
			style="text-transform: uppercase;cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;"
		>
			<span>{expand ? '-' : '+'}</span>
			{title}
			{#if num !== undefined}
				({num})
			{/if}
		</button>
	</li>

	{#if mounted}
		<li
			style="padding: 8px; border-bottom: 1px solid #eee;overflow: hidden;"
			class={expand ? 'show' : 'hide'}
		>
			<slot/>
		</li>
	{/if}

</ul>

<style>
	ul,li {
		position: relative;
	}
	.smooth {
		transition: height 0.5s ease,
	}

	/* default behavior */
	.hide {
        transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
		opacity: 0;
		height: 0;
	}
	.show {
        max-height: 1000px; /* Arbitrary large value to ensure content is fully shown */
		opacity: 1;
        transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
	}
</style>