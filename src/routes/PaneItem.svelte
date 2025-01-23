<script>
  import "@fortawesome/fontawesome-free/css/all.css";
  import "svelte-ripple-action/ripple.css";
  import { ripple } from "svelte-ripple-action";
  export let title;
  export let num;
  export let expand = false;
  export let inverted = false;
  let mounted = expand;

  $: if (expand === true) {
    mounted = true;
  }

  $: console.log("expand", expand);
</script>

<div
  class="MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters MuiListItemButton-root MuiListItemButton-gutters pane"
  on:click={() => (expand = !expand)}
  on:keypress={(e) => {
    if (e.key === "Enter") {
      expand = !expand;
    }
  }}
  use:ripple={{ color: "rgba(82, 54, 171, 0.2)", duration: 0.6 }}
  tabindex="0"
  role="button"
>
  <div class="MuiListItemText-root MuiListItemText-root-custom">
    <span
      class="MuiTypography-root MuiTypography-body1 MuiListItemText-primary"
    >
      {title}
      {#if num !== undefined}
        ({num})
      {/if}
    </span>
  </div>
  {#if inverted}
    <i
      class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium fas {!expand
        ? 'fa-chevron-up'
        : 'fa-chevron-down'}"
    ></i>
  {:else}
    <i
      class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium fas {expand
        ? 'fa-chevron-up'
        : 'fa-chevron-down'}"
    ></i>
  {/if}
</div>

{#if mounted}
  <div
    class="{expand
      ? 'show'
      : 'hide'} MuiCollapse-root MuiCollapse-vertical MuiCollapse-entered"
  >
    <div class="MuiCollapse-wrapper MuiCollapse-vertical">
      <div class="MuiCollapse-wrapperInner MuiCollapse-vertical">
        <div class="MuiList-root">
          <slot />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .pane {
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    border-top-style: initial;
    border-right-style: initial;
    border-top-color: initial;
    border-right-color: initial;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    color: inherit;
    display: flex;
    -webkit-box-flex: 1;
    flex-grow: 1;
    -webkit-box-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    min-width: 0px;
    box-sizing: border-box;
    text-align: left;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    width: 25rem;
    outline: 0px;
    border-width: 0px 0px 1px 0.25rem;
    border-image: initial;
    margin: 0px;
    border-radius: 0px;
    text-decoration: none;
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 0.25rem solid transparent;
    border-bottom: 1px solid rgb(232, 232, 232);
  }

  .MuiListItemText-root-custom {
    flex: 1 1 auto;
    min-width: 0px;
    margin-top: 4px;
    margin-bottom: 4px;
    font-size: 0.875rem;
  }

  ul,
  li {
    position: relative;
  }
  .smooth {
    transition: height 0.5s ease;
  }

  /* default behavior */
  .hide {
    transition: all 0.5s ease-in-out;
    opacity: 0;
    height: 0;
    display: none;
  }
  .show {
    max-height: 1000px; /* Arbitrary large value to ensure content is fully shown */
    opacity: 1;
    transition: all 0.5s ease-in-out;
  }
</style>
