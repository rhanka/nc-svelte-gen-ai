<script>
	import { onMount } from 'svelte';
	import { marked } from 'marked'; // Import the marked library
	import { taskLabel } from './store.js';
	export let task;
	export let history;
	export let expand;
	export let highlights = [];

	let highlightContainer = [];

	// Fonction pour nettoyer le HTML et extraire le texte brut
	function extractTextFromHtml(html) {
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = html;
		return tempDiv.textContent || tempDiv.innerText || '';
	}

	// Fonction pour appliquer les surlignages
    function applyHighlights(node, highlights) {
		if (!highlights || highlights.length === 0) return;

		// Convertir les highlights Markdown en HTML, puis extraire le texte brut
		const splitHighlights = highlights.flatMap(md =>
			extractTextFromHtml(marked(md)).split('\n').map(line => line.trim())
		);

      	// Échapper les caractères spéciaux pour éviter des problèmes avec les regex
		const escapedHighlights = splitHighlights.map(h =>
			h.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
		).filter(h => h.length > 0);


		// Crée une expression régulière pour capturer tous les termes
		const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi');

		// Remplacer le contenu du DOM
		node.innerHTML = node.innerHTML.replace(
			regex,
			'<mark>$1</mark>'
		);
    }

	$: if (highlightContainer.length > 0) {
		history.forEach((step,index) => {
			highlightContainer[index].innerHTML = marked(step.description.replace(/###/g,'####'))
			applyHighlights(highlightContainer[index], highlights);
		});
	}

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
					{taskLabel[task]}
				</h3>
		</button>
	{/if}
	{#if history && expand}
		{#each history as step, index}
			<li style="padding: 8px; border-bottom: 1px solid #eee;">
				<h4>{step.label} - {step.date.replace(/:..\..*/,"")}</h4>
				<div bind:this={highlightContainer[index]}>
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

