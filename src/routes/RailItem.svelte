<script>
  import { ripple } from "svelte-ripple-action";
  import Icon from '@iconify/svelte';
  export let label;
  export let num;
  export let selected = false
  export let active = false;
  export let icon;
  export let onClick = () => {};

  $: console.log("selected", selected);
  $: console.log("active", active);

</script>

<button
  class="MuiButtonBase-root MuiListItemButton-root MuiListItemButton-gutters MuiListItemButton-root MuiListItemButton-gutters"
  class:selected={selected}
  class:desactivated={!active}
  use:ripple={{ color: "rgba(82, 54, 171, 0.2)", duration: 0.6 }}
  tabindex="0"
  on:click|preventDefault={onClick}
  role="button"
>
  <div class="MuiListItemText-root MuiListItemText-root-custom">
	  {#if icon}
	    <Icon {icon} height={30}/>
	  {/if}
    <span
      class="MuiTypography-root MuiTypography-body1 MuiListItemText-primary label"
    >
      {label}
      {#if num !== null && num !== undefined && num !== 0}
        ({num})
      {/if}
    </span>
  </div>
</button>

<style>
  i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  button {
    border: none;
    background: none;
  	border-left: 0.25rem solid rgb(0,0,0,0);
 }

  .MuiListItemText-root-custom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top:1rem;
    padding-bottom:0.5rem;

  }

  .selected {
    border-left: 0.25rem solid;
    background: rgb(230, 227, 243);
    border-image: linear-gradient(rgb(227, 25, 55), rgb(82, 54, 171)) 0 100% /
      1 / 0 stretch;
  }

  .desactivated {
    opacity: 0.5;
  }

  .label {
    font-size: 0.7rem;
  }
</style>
