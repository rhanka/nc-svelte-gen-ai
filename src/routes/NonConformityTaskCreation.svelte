<script>
  import { marked } from 'marked'; // Import the marked library
	import Input from './Input.svelte';
	import Dropzone from "svelte-file-dropzone";

	export let task;
	export let history = [];
	export let expand;
	export let dropzone = false;
	export let image;
	
	let step_template = {
		label: "<Please provide a short label for non-conformity>",
		description:"Please provide a concise and precise description for this task",
		name: "Eric Roy",
		role: "Quality Controller",
		date: (new Date()).toISOString()
	};

	$: if (expand && history.length === 0) {
		history[0] = step_template;
	}

  let files = {
    accepted: [],
    rejected: [],
  };

  function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
		console.log(files.accepted);
  }

  function handleRemoveFile(e, index) {
    files.accepted.splice(index, 1);
    files.accepted = [...files.accepted];
  }
  function handleRemoveAll() {
    files.accepted = [];
  }
	
</script>

<div style="padding: 0; border-bottom: 1px solid #eee; margin-top:-2px; list-style-type: none;">
	{#if task}
		<button 
          type="button" 
          on:click={() => {expand = !expand}} 
          on:keypress={(e) => e.key === 'Enter' && (expand=!expand)} 
          style="cursor: pointer; padding: 0px; width: 100%; text-align: left; border: none; background: #eee;">
					<h3>
						<span style="padding: 0 8px;">{expand ? '-' : '+'}</span>
						{task}
					</h3>
		</button>
	{/if}

	<div class="container">
	  <div class="left-column">
	    {#if history && history.length && expand}
			{#each history as step}
				<li style="padding: 8px; border-bottom: 1px solid #eee;">
					<h4><Input bind:value={step.label} label="Label"/> - <Input bind:value={step.date} label="Date"/> </h4>
				
					<Input label="Role" bind:value={step['role']}/> -
					<Input label="Author" bind:value={step['name']}/>
					
					<br><br>
					<div>
						<Input bind:value={step.description} label="Description" markdown={true}/> 
					</div>
				</li>
			{/each}
		{/if}
	  </div>
	  <div class="right-column">
	    {#if dropzone}
				{#if files.accepted.length > 0}
					<div class="image-preview">
						{#each files.accepted as file, index}
							<div class="img-container">
								<img 
									src={URL.createObjectURL(file)} 
									alt={`Preview of ${file.name}`} 
									class="preview-img"
								/>
								<br>
								<button on:click={() => handleRemoveFile(null, index)}>Remove</button>
							</div>
						{/each}
					</div>
				{:else}
					<Dropzone on:drop={handleFilesSelect} accept={["image/*"]}>
					Drag 'n' drop some image here, or click to select files
					</Dropzone>
				{/if}
			{/if}
	  </div>
</div>
	
</div>

<style>
  li {
    padding: 1rem;
	  transition: width 0.3s;
  }

  /* Conteneur global */
  .container {
    display: flex;
    flex-wrap: wrap; /* Permet aux colonnes de passer à la ligne si nécessaire */
    gap: 1rem; /* Espacement entre les colonnes */
  }

  /* Colonne de gauche */
  .left-column {
		padding-right: 0.5rem;
    flex: 2; /* 2/3 de l'espace disponible */
    min-width: 200px; /* Largeur minimale pour éviter un écrasement trop important */
  }

  /* Colonne de droite */
  .right-column {
		padding-top: 2rem;
    flex: 1; /* 1/3 de l'espace disponible */
    min-width: 200px; /* Largeur minimale pour éviter un écrasement trop important */
  }

  /* Gestion des colonnes en mode responsive */
  @media (max-width: 768px) {
    .container {
      flex-direction: column; /* Les colonnes passent en empilement vertical */
    }
    .left-column,
    .right-column {
      flex: 1; /* Les deux colonnes occupent 100% en mode stack */
    }
  }

  .image-preview {
    margin-top: 1rem;
  }
																												
  .img-container {
		display: flex;
    flex-direction: column;
    align-items: center; /* Centre horizontalement */
    width: 100%;
	}
  .preview-img {
    max-width: 100%;
    max-height: 200px;
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
 button {
    margin-top: 0.5rem;
		border: none; 
		background: #eee;
    cursor: pointer;
  }

  button:hover {
    background: #e9e9e9;
  }

																	
</style>

