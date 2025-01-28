<script>
  export let expand = false;
</script>

<div
  class="Rail"
>
  <nav
    class="RailNav"
  >
    <slot />
  </nav>
</div>

<style>
  .Rail {
    display: flex;
    position: fixed;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background: var(--mio-theme-color-surface-2);
    overflow-y: auto;
    background: #fff;
    filter: drop-shadow(rgba(104, 114, 116, 0.267) 0px 2px 5px);
    z-index: 250;
  }

  .RailNav {
    display: flex;
    flex-direction: column;
    width: 5rem;
    margin-top: 20px;
  }
</style>