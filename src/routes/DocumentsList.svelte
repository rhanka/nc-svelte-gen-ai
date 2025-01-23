<script>
  import { createEventDispatcher } from "svelte";
  import { marked } from "marked"; // Import the marked library
  import {
    referencesList,
    selectDoc,
    selectItem,
    activeTabValue,
  } from "./store";
  import "svelte-ripple-action/ripple.css";
  import { ripple } from "svelte-ripple-action";

  export let documentsList = [];
  const dispatch = createEventDispatcher();
  let searchQuery = "";
</script>

<div style="position:relative;">
  {#if documentsList.length > 0}
    <div
      style="align:right;padding-right:0.5rem;position:absolute;top:2px;right:2px;"
    >
      <button
        style="cursor:pointer;align:right;border:none;background:none;"
        on:click={() => {
          documentsList = [];
          $referencesList = "";
        }}
      >
        <i style="font-size: 0.75rem;" class="fas fa-trash-alt"></i>
      </button>
    </div>
  {/if}
</div>

<div class="scrollable">
  <ul style="list-style-type: none; padding: 0;">
    {#each documentsList as doc, index}
      <li class:selected={$selectDoc === doc && $activeTabValue === 3}>
        <button
          type="button"
          use:ripple={{ color: "rgba(82, 54, 171, 0.2)", duration: 0.6 }}
          on:click={() => {
            $selectDoc = doc;
          }}
          on:keypress={(e) => {
            if (e.key === "Enter") {
              $selectDoc = doc;
            }
          }}
          style="cursor: pointer; padding: 8px; width: 100%; text-align: left; border: none; background: none;"
        >
          <strong
            >{doc.doc.replace(/\.md$/, ".pdf").slice(0, 50)}{doc.doc.replace(
              /\.md$/,
              ".pdf",
            ).length > 50
              ? "..."
              : ""}
          </strong>
          <p style="margin-top:0.2rem;margin-bottom:0rem;">
            {doc.chunks[0].chunk.slice(0, 50)}...
          </p>
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  .selected {
    border-left: 0.25rem solid;
    background: rgb(230, 227, 243);
    border-image: linear-gradient(rgb(227, 25, 55), rgb(82, 54, 171)) 0 100% / 1 /
      0 stretch;
  }
  li {
    padding: 0;
    border: none;
    list-style-type: none;
    background: rgb(248, 248, 248);
  }
  li:hover {
    background-color: rgb(230, 227, 243);
  }
  input {
    padding: 0.35rem !important;
    margin-left: -8px !important;
    font-size: 0.9rem;
  }

  .scrollable {
    max-height: 15vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .scrollable::-webkit-scrollbar {
    width: 12px; /* Width of the scrollbar */
  }

  .scrollable::-webkit-scrollbar-track {
    background: #f1f1f1; /* Background of the scrollbar track */
  }

  .scrollable::-webkit-scrollbar-thumb {
    background: #888; /* Color of the scrollbar thumb */
    border-radius: 10px; /* Rounded corners for the scrollbar thumb */
  }
</style>
