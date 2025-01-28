<script>
  import { onMount } from "svelte";
  import { marked } from "marked";
  export let label = ""; // Le label affich� au-dessus
  export let value = ""; // La valeur de l'input

  export let markdown = false;
  let isEditing = false; // D�finit si nous sommes en mode �dition ou non

  // R�f�rence pour le span et l'input
  let span;
  let input;
  let textarea;

  // Basculer entre le mode �dition et le mode affichage
  const toggleEditing = () => {
    isEditing = !isEditing;
  };

  // Fonction pour ajuster la largeur de l'input
  const adjustWidth = () => {
    if (!markdown) {
      if (span && input) {
        span.textContent = value || " "; // Mise � jour du contenu du span
        input.style.width = `${span.offsetWidth + 4}px`; // Appliquer la largeur au champ input
      }
    }
  };
  $: textarea && adjustHeight();

  // Ajuster la hauteur du textarea en fonction de son contenu
  const adjustHeight = () => {
    if (textarea) {
      textarea.focus(); // Focus sur le textarea
      textarea.style.height = "auto"; // R�initialise la hauteur
      let height = Math.max(textarea.scrollHeight, 12); // Stocke la hauteur minimale
      textarea.style.height = `${height}px`; // D�finit la hauteur bas�e sur le contenu
    }
  };

  onMount(() => adjustWidth());

  // Surveillez les changements de `value`
  $: if (value) {
    adjustWidth();
  } else if (markdown) {
    value = "Please provide description";
  }
</script>

<div class="editable-container" style={markdown ? "width: 100%!important" : ""}>
  <label>{label}</label>
  {#if !markdown}
    <div class="input-wrapper">
      <span class="size-measure" bind:this={span}></span>
      {#if new RegExp(/\[.*\]/).test(value)}
        <mark>
          <input
            type="text"
            bind:value
            bind:this={input}
            class="editable-input"
            on:input={adjustWidth}
            on:blur={toggleEditing}
          />
        </mark>
      {:else}
        <input
          type="text"
          bind:value
          bind:this={input}
          class="editable-input"
          on:input={adjustWidth}
          on:blur={toggleEditing}
        />
      {/if}
    </div>
  {:else}
    {#if isEditing}
      <textarea
        bind:value
        on:mouseover={adjustHeight}
        on:focus={adjustHeight}
        on:blur={toggleEditing}
        bind:this={textarea}
      ></textarea>
    {/if}
    <div class="markdown-wrapper" on:click|preventDefault={toggleEditing}>
      {@html marked((value && value.replace(/###/, "####")) || "").replace(
        /(\[[^\]<>]*?\])/gi,
        "<mark>$1</mark>",
      )}
    </div>
  {/if}
</div>

<style global>
  .editable-container {
    display: inline-flex; /* Permet d'afficher les champs c�te � c�te */
    flex-direction: column; /* Label au-dessus de l'input */
    margin-right: 0; /* Espacement entre les inputs */
    vertical-align: bottom;
  }

  label {
    display: block;
    font-size: 0.5rem;
    font-weight: 100; /* Police fine */

    color: #555;
    margin-bottom: 0rem;
  }

  .input-wrapper {
    position: relative;
    display: inline-block;
  }

  .markdown-wrapper {
    width: 100%;
    padding-left: 1rem;
  }

  :global(.markdown-wrapper > :first-child) {
    margin-top: 0.25rem !important;
  }

  :global(.markdown-wrapper > :last-child) {
    margin-bottom: 0.25rem !important;
  }
  :global(.markdown-wrapper > ul) {
    margin-left: -1rem !important;
  }
  textarea {
    border: 1px;
    margin-left: 1rem;
  }

  textarea:focus {
    border: 1px solid #ccc; /* Ajout du style de bordure */
    outline: none; /* Supprime l'effet par d�faut du focus */
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
    font-size: inherit; /* H�rite de la taille de police du parent */
    color: inherit; /* H�rite de la couleur du texte du parent */
    font-weight: inherit; /* H�rite du poids de la police */
    line-height: inherit; /* H�rite de l'interligne */
    vertical-align: baseline; /* Aligne l'input avec la ligne de base du texte */
    padding: 0;
    background: none;
    transition:
      border-color 0.3s,
      background-color 0.3s;
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
