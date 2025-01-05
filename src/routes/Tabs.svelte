<script>
  export let items = [];
  export let activeTabValue = 1;

  const handleClick = tabValue => () => (activeTabValue = tabValue);

  $: items.forEach(item => {
    if (item.active) {
      item.loaded = true;
    }
  });
</script>

<div class="tab-container">
  <ul class="tabs">
    {#each items as item}
        <li
          class={activeTabValue === item.value ? 'active' : ''}
        >
          <button
            class={!item.active ? 'inactive' : ''}
            on:click={item.active !== false ? handleClick(item.value) : null}
            on:keypress={(e) => e.key === 'Enter' && handleClick(item)}
            disabled={!item.active}
          >
            {item.label}
          </button>
        </li>
    {/each}
  </ul>
  <div class="content">
    {#each items as item}
      {#if item.loaded}
        <div class="box" style="display: {activeTabValue == item.value ? "block" : "none"}">
          <svelte:component this={item.component} {...item.arguments}/>
        </div>
      {/if}
    {/each}
  </div>
</div>
<style> /* Conteneur principal */
  .tab-container {
    display: flex;
    flex-direction: column;
    height: 100vh; /* Prend toute la hauteur de l'écran */
    overflow: hidden;
  }

  /* Onglets */
  .tabs {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
    background-color: #f8f9fa;
    z-index: 10; /* Pour rester au-dessus */
  }

  li {
    margin-bottom: -1px;
  }

  button {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    background: #fff;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: #555;
  }

  button:disabled {
    color: #ccc;
  }

  button:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > button {
    color: #000;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }

  /* Contenu avec défilement */
  .content {
    flex: 1; /* Prend tout l'espace restant */
    overflow-y: auto; /* Ajoute le défilement vertical si nécessaire */
    padding: 1rem;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-top: none;
  }

  .box {
    margin-bottom: 10px;
    padding: 0px;
    border: 1px solid #dee2e6;
    border-radius: 0 0 .5rem .5rem;
  }
</style>