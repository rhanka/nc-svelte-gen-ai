<script>
  	import { marked } from 'marked'; // Import the marked library
	import Input from './Input.svelte';
	import Dropzone from "svelte-file-dropzone";
	import { taskLabel, createdItem, isUpdating, askForHelp } from './store.js';
    import '@fortawesome/fontawesome-free/css/all.css';

	export let aiHelp = false;

	export let task;
	export let expand;
	export let dropzone = false;

	const dict = {
    	aircraft_id: "Aircraft Serial Number",
		part_id: "Part number",
		nc_event_date: "Date"
	}

	const smartLabel = (key) => {
		return dict[key] ? dict[key] : key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	}

	let image;

	let step_template = {
		label: "<Please provide a short label for non-conformity>",
		description:"Please provide a concise and precise description for this task",
		name: "Eric Roy",
		role: "Quality Controller",
		date: (new Date()).toISOString()
	};

	$: if (expand && $createdItem.analysis_history[task].length === 0) {
		$createdItem.analysis_history[task][0] = {...step_template};
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

  function handleClick() {
	expand = !expand;
	if (expand) {
		$createdItem.currentTask = task;
	}
  }

</script>

<div style="padding: 0; border-bottom: 1px solid #eee; margin-top:-2px; list-style-type: none;">
	{#if task}
		<button
          type="button"
          on:click={handleClick}
          on:keypress={(e) => e.key === 'Enter' && handleClick()}
          style="cursor: pointer; padding: 0px; width: 100%; text-align: left; border: none; background: #eee;">
			<h3>
				<span style="padding: 0 8px;">{expand ? '-' : '+'}</span>
				{taskLabel[task]}
				{#if aiHelp}
					<a
						href="/"
						on:click|stopPropagation|preventDefault={() => $askForHelp=task}
          				on:keypress={(e) => {if (e.key === 'Enter') {$askForHelp = task}}}
						style="margin-left:.25rem;cursor: help; text-decoration:none; padding: 0px; width: 100%; text-align: left; border: none; background: transparent;"
					>
						<i style="font-size: 1rem;" class="fas fa-wand-magic"></i> <!-- Logout icon -->
					</a>
				{/if}
			</h3>
		</button>
	{/if}

	<div class="container">
	  <div class="left-column {$isUpdating === task ? 'gradiant' : ''}">
	    {#if $createdItem.analysis_history[task] && $createdItem.analysis_history[task].length && expand}
			{#each $createdItem.analysis_history[task] as step}
				<li style="padding: 8px; border-bottom: 1px solid #eee;">
					<h4><Input bind:value={step.label} label="Label"/> - <Input bind:value={step.date} label="Date"/> </h4>

					<Input label="Role" bind:value={step['role']}/> -
					<Input label="Author" bind:value={step['name']}/>

					<br><br>
					<div>
						{#if typeof step.description === 'string'}
							<Input
								bind:value={step.description}
								label="Description"
								markdown={true}
							/>
						{:else if typeof step.description === 'object'}
							{#each Object.entries(step.description) as [key, value]}
								{#if Array.isArray(value)}
									<Input
									value={JSON.stringify(step.description[key])}
									label={key}
									markdown={true}
									/>
								{:else if typeof step.description[key] === 'string'}
									<h4>{smartLabel(key)}</h4>
									<Input
									bind:value={step.description[key]}
									markdown={true}
									/>
								{:else if typeof step.description === 'object'}
									<h4>{smartLabel(key)}</h4>
									<ul style="margin-top:0;padding-top:0;padding-bottom:0">
									{#each Object.entries(step.description[key]) as [key2, value2]}
										<li style="padding:0"><strong>{smartLabel(key2)}: &nbsp</strong><Input
										bind:value={step.description[key][key2]}
										/>
										</li>
									{/each}
									</ul>
								{/if}
							{/each}
						{/if}
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
    flex-wrap: wrap; /* Permet aux colonnes de passer � la ligne si n�cessaire */
    gap: 1rem; /* Espacement entre les colonnes */
  }

  /* Colonne de gauche */
  .left-column {
		padding-right: 0.5rem;
    flex: 2; /* 2/3 de l'espace disponible */
    min-width: 200px; /* Largeur minimale pour �viter un �crasement trop important */
  }

  /* Colonne de droite */
  .right-column {
		padding-top: 2rem;
    flex: 1; /* 1/3 de l'espace disponible */
    min-width: 200px; /* Largeur minimale pour �viter un �crasement trop important */
  }

  h4 {
    padding-top:0.5rem;
    padding-bottom:0;
    margin-top:0;
    margin-bottom:0;
  }
  ul,li{
    padding-top:0;
    padding-bottom:0;
    margin-top:0;
    margin-bottom:0;
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


	@keyframes gradient {
		0% {
		background-position: 0% 50%;
		}
		100% {
		background-position: 100% 50%;
		}
	}

	.gradiant {
		background: linear-gradient(90deg, #333, #666, #aaa, #eee, #aaa, #555, #222);
    	background-size: 400% 100%; /* Assurez-vous que le gradient est assez large pour bouger */
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient 1.5s infinite linear;
	}

</style>

