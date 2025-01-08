<!-- src/routes/Menu.svelte -->
<script>
  import { createEventDispatcher } from 'svelte';
  import '@fortawesome/fontawesome-free/css/all.css';
  import { accessToken } from './store.js';

  const dispatch = createEventDispatcher();

  function openLogin() {
    dispatch('changeView', { view: 'login' });
  }
</script>

<div class="menu">
    {#if $accessToken}
        <button on:click={() => { $accessToken = null}}>
            <i class="fas fa-sign-out-alt"></i> <!-- Logout icon -->
        </button>
    {:else}
        <button on:click={openLogin}>
            <i class="fas fa-sign-in-alt"></i> <!-- Login icon -->
        </button>
    {/if}
</div>

<style>
  .menu {
    position: absolute;
    top: 1rem;
    right: 0.25rem;
    z-index: 100;
  }
  button {
    margin: 5px;
    border: none;
    background: none;
  }
  button i {
    font-size: 1.5rem; /* Adjust the size as needed */
  }
</style>