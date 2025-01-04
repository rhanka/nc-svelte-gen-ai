<script>
  import { onMount } from "svelte";
	import { marked } from 'marked';
  export let label = ""; // Le label affiché au-dessus
  export let value = ""; // La valeur de l'input

	let isEditing = false; // Définit si nous sommes en mode édition ou non
	export let markdown = false;

	// Référence pour le span et l'input
  let span;
  let input;
	let textarea;
	
  // Basculer entre le mode édition et le mode affichage
  const toggleEditing = () => {
    isEditing = !isEditing;
  };
 
	$: textarea && adjustHeight() && setTimeout(() => {
	  textarea.focus();
	}, "150");

  // Fonction pour ajuster la largeur de l'input
  const adjustWidth = () => {
		if (!markdown) {
	    if (span && input) {
	      span.textContent = value || " "; // Mise à jour du contenu du span
	      input.style.width = `${span.offsetWidth+4}px`; // Appliquer la largeur au champ input
	    }
		}
  };

	// Ajuster la hauteur du textarea en fonction de son contenu
  const adjustHeight = () => {
    if (textarea) {
      textarea.style.height = "auto"; // Réinitialise la hauteur
      textarea.style.height = `${textarea.scrollHeight}px`; // Définit la hauteur basée sur le contenu
    }
  };

	onMount(() => adjustWidth());
	
  // Surveillez les changements de `value`
  $: if (value) { adjustWidth() };

</script>

<div 
	class="editable-container"
	style={markdown ? "width: 100%!important": ""}
>
  <label>{label}</label>
  {#if !markdown }
	  <div
			class="input-wrapper"
		>
	    <span class="size-measure" bind:this={span}></span>
	    <input
	      type="text"
	      bind:value
	      bind:this={input}
	      class="editable-input"
	      on:input={adjustWidth}
				on:blur={toggleEditing}
			/>
	  </div>
  {:else if !isEditing}
    <div
      class="markdown-wrapper"
      on:click={toggleEditing}
		>
			{@html marked(value && value.replace(/###/,"####") || "")}
    </div>
	{:else}
		<textarea
			style="height: 100px;"
			on:blur={toggleEditing}
			bind:value={value}
			bind:this={textarea}
		></textarea>
  {/if}

</div>

<style>
  .editable-container {
    display: inline-flex; /* Permet d'afficher les champs côte à côte */
    flex-direction: column; /* Label au-dessus de l'input */
    margin-right: 0; /* Espacement entre les inputs */
		vertical-align: bottom;
  }

  label {
    display: block;
    font-size: 0.5rem;
	  font-weight: 100; /* Police fine */
	  font-family: "Helvetica Neue", Arial, sans-serif; /* Typographie moderne et légère */
	  
    color: #555;
    margin-bottom: 0rem;
  }

	.input-wrapper {
    position: relative;
    display: inline-block;
  }

	.markdown-wrapper {
		width: 100%;
  }

	textarea {
		border: 1px;
	}

	textarea:focus {
	  border: 1px solid #ccc; /* Ajout du style de bordure */
	  outline: none; /* Supprime l'effet par défaut du focus */
	}

  .size-measure {
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    letter-spacing: inherit;
    white-space: pre; /* Garde le texte sur une seule ligne */
    visibility: hidden; /* Rendre le span invisible */
    position: absolute;
    pointer-events: none;
  }
	
  .editable-input {
    border: none;
    border-bottom: 1px solid transparent;
    outline: none;
    font-size: inherit; /* Hérite de la taille de police du parent */
    color: inherit; /* Hérite de la couleur du texte du parent */
    font-weight: inherit; /* Hérite du poids de la police */
    line-height: inherit; /* Hérite de l'interligne */
		vertical-align: baseline; /* Aligne l'input avec la ligne de base du texte */
    padding: 0;
    background: none;
    transition: border-color 0.3s, background-color 0.3s;
    color: inherit;
    cursor: text;
  }

  .editable-input:hover {
    border-bottom: 1px solid #ced4da;
  }

  .editable-input:focus {
    border-bottom: 1px solid #495057;
    background-color: #f8f9fa;
  }

  .editable-input::placeholder {
    color: #ced4da;
  }
</style>
