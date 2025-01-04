<script>
	import { run } from 'svelte/legacy';

  import NonConformityList from './NonConformityList.svelte';
  import DocumentsList from './DocumentsList.svelte';
  import NonConformityDetail from './NonConformityDetail.svelte';
  import ShowDocument from './ShowDocument.svelte';
  import NonConformityCreation from './NonConformityCreation.svelte';
	import Chatbot from './Chatbot.svelte';
  import Pane from './Pane.svelte';
	import Tabs from './Tabs.svelte';
	import { nonConformities } from './non_conformities.js';

	let maxRows=5000;
	let apiUrl = `https://dataiku.genai-cgi.com/web-apps-backends/NONCONFORMITIES/3DGvs3v/nc?max_rows=${maxRows}`;
	let nonConformitiesList = $state(nonConformities);
	let nonConformitiesFilter = $state();
	let nc_num = $state(0);
	let doc_num = $state(0);
  let selectedItem = $state(null);
  let selectedDoc = null;
	let referencesList= $state([]);
	let documentsList= $state([]);
	let tabs = $state([]);
	let activeTabValue = $state(1);

	run(() => {
		console.log(history);
	});

  function handleSelect(event) {
    selectedItem = event.detail.item;
		activeTabValue = 2;
		console.log(selectedItem)
  }

	async function getData () {
		try {
        let response = await fetch(apiUrl, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }); 
        if (response.ok) {
            nonConformitiesList = await response.json();
            console.log(`fetched ${nonConformitiesList.length} non conformities`); // Affiche les données JSON
        } else {
            console.error('HTTP error', response.status);
        }
    } catch (error) {
			console.log(error)
    }
	}

		run(() => {
		tabs = [
			    {
						label: "Non Conformity Creation",
						value: 1,
						active: true,
						arguments: {
							history: history
						},
						component: NonConformityCreation
					},
			    {
						label: "Non Conformity Reference",
						value: 2,
						active: selectedItem,
						component: NonConformityDetail,
						arguments: {
							selectedItem: selectedItem
						}
					},
			    {
						label: "Document",
						value: 3,
						component: ShowDocument,
						argument: selectedDoc,
						active: selectedDoc
					}
			  ];
	});

	getData();

	run(() => {
		if (referencesList.length > 0) {
			nonConformitiesFilter = referencesList.filter(item => item.doc.includes("ATA"))
			documentsList = referencesList.filter(item => !item.doc.includes("ATA"))
		}
	});

	run(() => {
		doc_num = documentsList.length;
	});
</script>

<main>
  <div class="container">
    <div
			class="pane left_selected"
		>
			<Pane expand={false} title="AI Agent">
				<Chatbot bind:referencesList={referencesList} />
			</Pane>
			<Pane expand={true} title="Non Conformities List" num={nc_num}>
				<NonConformityList 
					nonConformities={nonConformitiesList}
					nonConformitiesFilter={nonConformitiesFilter}
					bind:num={nc_num}
					on:select={handleSelect} />
			</Pane>
			<Pane expand={false} title="Documents" num={doc_num}>
				<DocumentsList 
					documentsList={documentsList}
					on:select={handleSelect} />
			</Pane>
    </div>
		
		<div class="pane right">
			<Tabs 
				items={tabs}
				bind:activeTabValue={activeTabValue}
			/>
       <!-- 
				<NonConformityDetail {selectedItem} on:closeDetail={closeDetail} />
			 !-->
      </div>
  </div>
</main>

<style>
  main {
    padding: 1rem;
  }
  .container {
    display: flex;
    flex-direction: row;
		margin: 0px;
		padding: 0px
  }
  .pane {
    padding: 0rem;
	  transition: width 0.3s;
  }
  .left {
    width: 100%;
		min-width:320px;
		overflow-y: auto;
  }
  .left_selected {
    width: 20%;
		min-width:320px;
		overflow-y: auto;
  }
  .right {
    width: 80%;
    transition: width 0.3s;
  }
</style>