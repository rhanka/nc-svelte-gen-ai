<script>
  import Menu from './Menu.svelte';
  import AuthForm from './AuthForm.svelte';
  import { activeTabValue } from './store.js'
	import "svelte-ripple-action/ripple.css"
	import { ripple } from "svelte-ripple-action";

  export let items = [];
  let currentView = 'tabs';

  const handleClick = tabValue => () => ($activeTabValue = tabValue);

  function handleChangeView(event) {
    currentView = event.detail.view;
  }

  $: items.forEach(item => {
    if (item.active) {
      item.loaded = true;
    }
  });
</script>

<Menu on:changeView={handleChangeView} />

<div style="background-color: #f6f7f7;height:100%;overflow:hidden">
  <div class="MuiBox-root">
    <div class="MuiBox-root tab-root">
      <div class="MuiTabs-flexContainer tab-container">
        <div class="MuiTabs-scroller MuiTabs-fixed tab-scroller">
          <div aria-label="Tabs" class="MuiTabs-flexContainer tab-container" role="tablist">
            {#each items as item}
                <button
                  use:ripple={{color: "rgba(82, 54, 171, 0.2)", duration: 0.6}}
                  class="MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary tab"
                  class:Mui-selected = {item.value === $activeTabValue}
                  class:tab-selected = {item.value === $activeTabValue}
                  class:inactive = {item.value !== $activeTabValue}
                  on:click={handleClick(item.value)}
                  on:keypress={(e) => e.key === 'Enter' && handleClick(item)}
                  disabled={!item.active}
                >
                  {item.label}
                  <span class="MuiTouchRipple-root Ripple"></span>
                </button>
            {/each}
            <span class="tab-container"></span>

          </div>
          <span class="tab-underline"></span>
        </div>
      </div>
    </div>
  </div>
  <div class="content">
    {#if currentView === 'tabs'}
      {#each items as item}
        {#if item.loaded}
          <div class="box" style="display: {$activeTabValue == item.value ? 'block' : 'none'}">
            <svelte:component this={item.component} {...item.arguments}/>
          </div>
        {/if}
      {/each}
    {:else}
      <AuthForm type={currentView} on:changeView={handleChangeView} />
    {/if}
  </div>
</div>

<style>
  .tab-root {
    overflow: hidden;
    min-height: 48px;
    display: flex;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.063rem;
    color: rgb(82, 54, 171);
    width: 100%;
  }
  .tab-scroller {
    position: relative;
    display: inline-block;
    flex: 1 1 auto;
    white-space: nowrap;
    overflow-x: hidden;
    width: 100%;
    overflow: hidden;
    margin-bottom: 0px;
  }

  .tab-underline {
    position: absolute;
    top:-4px;
    width:100%;
    height: calc(100%);
    border-bottom: 4px solid rgb(233, 235, 237);
  }

  .tab-container {
    display: flex;
    overflow: hidden;
    width: 100%;
  }
  .tab-selected {
    color: rgb(82, 54, 171)!important;
    border-bottom: 4px solid rgb(82, 54, 171)!important;
  }


  .tab {
    z-index: 1;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
    outline: 0px;
    border: 0px;
    margin: 0px;
    border-radius: 0px;
    cursor: pointer;
    user-select: none;
    vertical-align: middle;
    appearance: none;
    text-decoration: none;
    font-family: "Source Sans Pro", -apple-system, sans-serif, Arial;
    line-height: 1.25;
    max-width: 360px;
    position: relative;
    min-height: 48px;
    flex-shrink: 0;
    overflow: hidden;
    white-space: normal;
    text-align: center;
    flex-direction: column;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: initial;
    min-width: 3.125rem;
    padding: 1rem 1.25rem;
    padding-bottom: 0;
    color: rgb(51, 51, 51);
    border-bottom: 4px solid rgb(233, 235, 237);
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
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    border-top: none;
    height: 89%;
  }
  .box {
    margin-bottom: 10px;
    padding: 0px;
    border-radius: 0 0 .5rem .5rem;
  }

</style>