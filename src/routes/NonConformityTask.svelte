<script>
  import { marked } from "marked"; // Import the marked library
  import Icon from "@iconify/svelte";
  import { taskLabel } from "./store.js";
  export let task;
  export let history;
  export let expand;
  export let highlights = [];

  let highlightContainer = [];

  // Fonction pour nettoyer le HTML et extraire le texte brut
  function extractTextFromHtml(html) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  // Fonction pour appliquer les surlignages
  function applyHighlights(node, highlights) {
    if (!highlights || highlights.length === 0) return;

    // Convertir les highlights Markdown en HTML, puis extraire le texte brut
    const splitHighlights = highlights.flatMap((md) =>
      extractTextFromHtml(marked(md))
        .split("\n")
        .map((line) => line.trim()),
    );

    // Échapper les caractères spéciaux pour éviter des problèmes avec les regex
    const escapedHighlights = splitHighlights
      .map((h) => h.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"))
      .filter((h) => h.length > 0);

    // Crée une expression régulière pour capturer tous les termes
    const regex = new RegExp(`(${escapedHighlights.join("|")})`, "gi");

    // Remplacer le contenu du DOM
    node.innerHTML = node.innerHTML.replace(regex, "<mark>$1</mark>");
  }

  $: if (highlightContainer.length > 0) {
    history.forEach((step, index) => {
      try {
        highlightContainer[index].innerHTML = marked(
          step.description.replace(/###/g, "####"),
        );
        applyHighlights(highlightContainer[index], highlights);
      } catch (e) {
        console.error("icilq", highlightContainer[index]);
      }
    });
  }
</script>

<div
  class="MuiPaper-root MuiPaper-outlined MuiPaper-rounded MuiCard-root"
  style="margin-bottom: 1rem;"
>
  {#if task}
    <button
      type="button"
      on:click={() => {
        expand = !expand;
      }}
      on:keypress={(e) => e.key === "Enter" && selectItem(item)}
      class="MuiCardActions-root"
      style="cursor: pointer; display: flex; padding: 0px; width: 100%; text-align: left; border: none; background: none;"
    >
      <h3 class="MuiTypography-root MuiTypography-h3 taskTitle">
        {taskLabel[task]}
      </h3>
	  <Icon icon="mdi:chevron-{expand ? 'up' : 'down'}" height={24}/>
    </button>
  {/if}
  {#if history && expand}
    {#each history as step, index}
      <h4>{step.label} - {step.date.replace(/:..\..*/, "")}</h4>
      <div bind:this={highlightContainer[index]}>
        {@html marked(step.description.replace(/###/g, "####"))}
      </div>
    {/each}
  {/if}
</div>

<style>
  li {
    padding: 1rem;
    transition: width 0.3s;
  }
  .taskTitle {
    margin: 0px;
    margin-bottom: 0.5rem;
    font-family:
      "Source Sans Pro",
      -apple-system,
      sans-serif,
      Arial;
    line-height: 1.167;
    font-size: 1.5rem;
    font-weight: 600;
    color: rgb(51, 51, 51);
    flex: 1 1 auto;
  }

  .MuiPaper-root {
    background-color: rgb(255, 255, 255);
    color: rgb(51, 51, 51);
    box-shadow: rgb(232, 232, 232) 0px 4px inset;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    border-radius: 0px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(232, 232, 232);
    border-image: initial;
    padding: 2rem;
  }
  .MuiCardActions-root {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 0px;
  }
</style>
