<script>
	import { slide } from 'svelte/transition';
	export let title;
	export let num;
	export let expand = false;
	let show = expand;

	$: if (expand === true) {
		show = true;
	} else {
		setTimeout(() => {show = false}, 500);
	}
</script>
<ul style="list-style-type: none; margin:0; padding: 0;">
	<li style="z-index:100;background: #fff;padding: 8px; border-bottom: 1px solid #eee;">
		<button
			type="button"
			on:click={() => expand=!expand}
			on:keypress={(e) => e.key === 'Enter' && selectItem(item)}
			style="text-transform: uppercase;cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;"
		>
			<span>{expand ? '-' : '+'}</span>
			{title}
			{#if num !== undefined}
				({num})
			{/if}
		</button>
	</li>

	{#if expand}
		<li
			transition:slide
			style="padding: 8px; border-bottom: 1px solid #eee;"
			class={expand ? 'show' : 'hide'}
		>
			<slot/>
		</li>
	{/if}

</ul>

<style>
	li {
		position: sticky;
	}
	/* default behavior */
	.hide {
		-webkit-transform:translateY(-200%);
		-moz-transform:translateY(-200%);
		transform:translateY(-100%);
		-webkit-transition: all 0.5s ease-in-out;
		-moz-transition: all 0.5s ease-in-out;
		transition: all 0.5s ease-in-out;
		opacity: 0;
	}
	.show {
		opacity: 1;
		-webkit-transform:translateY(0px);
		-moz-transform:translateY(0px);
		transform:translateY(0px) -webkit-transition: all 0.5s ease-in-out;
		-moz-transition: all 0.5s ease-in-out;
		transition: all 0.5s ease-in-out;
		display: block;
	}
</style>