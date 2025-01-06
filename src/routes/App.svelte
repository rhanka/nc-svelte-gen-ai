<svelte:options runes={false} />
<script>
	import { run } from 'svelte/legacy';

	import NonConformityList from './NonConformityList.svelte';
	import DocumentsList from './DocumentsList.svelte';
	import NonConformityDetail from './NonConformityDetail.svelte';
	import ShowDocument from './ShowDocument.svelte';
	import NonConformityCreation from './NonConformityCreation.svelte';
	import Chatbot from './Chatbot.svelte';
	import PaneItem from './PaneItem.svelte';
	import Tabs from './Tabs.svelte';
	import { nonConformities } from './non_conformities.js';
	import { askForHelp } from './store.js';

	let maxRows=5000;
	let apiUrl = `https://dataiku.genai-cgi.com/web-apps-backends/NONCONFORMITIES/3DGvs3v/nc?max_rows=${maxRows}`;
	let nonConformitiesList = sortNC(nonConformities);
	let nonConformitiesFilter;
	let nc_num = 0;
	let doc_num = 0;
	let selectedItem = null;
	let selectedDoc = null;
	let referencesList= [];
	let documentsList= [];
	let tabs = [];
	let activeTabValue = 1;
	let showChatbot = false;

	$:	console.log('showChatbot',showChatbot);

	function sortNC(list) {
		return list.sort(
			(a, b) => new Date(b['nc_event_date']) - new Date(a['nc_event_date'])
		);
	}

	function handleSelect(event) {
		selectedItem = event.detail.item;
		activeTabValue = 2;
		console.log(selectedItem);
	}

	function handleDocumentSelect(event) {
		selectedDoc = `https://dataiku.genai-cgi.com/web-apps-backends/NONCONFORMITIES/3DGvs3v/doc/${event.detail.doc.doc.replace(/\.md/,'.pdf')}`;
		activeTabValue = 3;
		console.log('app to pdf',selectedDoc);
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
            nonConformitiesList = sortNC(await response.json());
            console.log(`fetched ${nonConformitiesList.length} non conformities`); // Affiche les donn�es JSON
        } else {
            console.error('HTTP error', response.status);
        }
    } catch (error) {
			console.log(error)
    }
	}

	$: tabs = [
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
			active: selectedDoc,
			component: ShowDocument,
			arguments: {
				url: selectedDoc
			}
		}
		];

	getData();

	$: if ($askForHelp) {
		showChatbot = true;
		$askForHelp = null;
	}

	$:	if (referencesList.length > 0) {
			nonConformitiesFilter = referencesList
				.filter(item => item.doc.includes("ATA"))
			documentsList = Object.values(referencesList
				.filter(item => !item.doc.includes("ATA"))
				.sort((a, b) => a.relevance_score - b.relevance_score)
				.reduce((group, item) => {
					// Si le groupe pour cet ID doc n'existe pas encore, on l'initialise
					if (!group[item.doc]) {
						group[item.doc] = {
						doc: item.doc,
						chunks: [] // Initialisation des chunks
						};
					}
					// Ajouter les propriétés chunk_id, chunk et relevance_score à ce groupe
					group[item.doc].chunks.push({
						chunk_id: item.chunk_id,
						chunk: item.chunk,
						relevance_score: item.relevance_score
					});
					return group;
					}, {}
				) // Initialisation d'un objet vide pour regrouper les items
			).sort((a, b) => b.chunks[0].relevance_score - a.chunks[0].relevance_score);
			console.log('doc',documentsList);
		}

	$:	doc_num = documentsList.length;
</script>

<main>
  <div class="container">
    <div
		class="pane left"
	>
		<div style="padding-top:1rem;">
			<PaneItem
				expand={true}
				title="Non Conformities List"
				num={nc_num}
			>
				<NonConformityList
					nonConformities={nonConformitiesList}
					nonConformitiesFilter={nonConformitiesFilter}
					bind:num={nc_num}
					on:select={handleSelect}
				>
				</NonConformityList>
			</PaneItem>
			<PaneItem
				expand={false}
				title="Documents"
				num={doc_num}
			>
				<DocumentsList
					documentsList={documentsList}
					on:selectDoc={handleDocumentSelect}
				>
				</DocumentsList>
			</PaneItem>

		</div>
		<div style="position: absolute;bottom:0">
			<PaneItem
				bind:expand={showChatbot}
				title="AI Agent"
				num={undefined}
			>
				<Chatbot bind:referencesList={referencesList}>
				</Chatbot>
			</PaneItem>
		</div>
    </div>
	<div class="pane right">
		<Tabs
			items={tabs}
			bind:activeTabValue={activeTabValue}
		>
		</Tabs>
	</div>
  </div>
</main>

<style>
  main {
    padding: 0rem;
  }
  .container {
    display: flex;
    flex-direction: row;
	margin: 0px;
	padding: 0px;
  }
  .pane {
    padding: 0rem;
	transition: width 0.3s;
	height:100vh;
	overflow-y: auto;
  }
  .left {
    width: 25vw;
    display: flex;
    flex-direction: column;
  }
  .right {
    width: 80%;
    transition: width 0.3s;
  }
</style>