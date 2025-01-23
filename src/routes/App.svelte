<svelte:options runes={false} />

<script>
  import { run } from "svelte/legacy";

  import Header from "./Header.svelte";
  import NonConformityList from "./NonConformityList.svelte";
  import DocumentsList from "./DocumentsList.svelte";
  import NonConformityDetail from "./NonConformityDetail.svelte";
  import ShowDocument from "./ShowDocument.svelte";
  import NonConformityCreation from "./NonConformityCreation.svelte";
  import Chatbot from "./Chatbot.svelte";
  import PaneItem from "./PaneItem.svelte";
  import Tabs from "./Tabs.svelte";
  import { nonConformities } from "./non_conformities.js";
  import {
    askForHelp,
    referencesList,
    chatElementRef,
    defaultAction,
    createdItem,
    selectItem,
    selectDoc,
    activeTabValue,
  } from "./store.js";

  let maxRows = 5000;
  let apiUrl = `https://dataiku.genai-cgi.com/web-apps-backends/NONCONFORMITIES/3DGvs3v/nc?max_rows=${maxRows}`;
  let nonConformitiesList = sortNC(nonConformities);
  let nonConformitiesFilter = [];
  let nc_num = 0;
  let doc_num = 0;
  let selectDocUrl = null;
  let documentsList = [];
  let tabs = [];
  let showChatbot = false;
  let expand = false;

  function sortNC(list) {
    return list.sort(
      (a, b) =>
        new Date(b["nc_event_date"]) - new Date(a["nc_event_date"]),
    );
  }

  $: if ($selectItem !== null) {
    $activeTabValue = 2;
  }

  $: if ($selectDoc !== null) {
    selectDocUrl = `https://dataiku.genai-cgi.com/web-apps-backends/NONCONFORMITIES/3DGvs3v/doc/${encodeURIComponent($selectDoc.doc.replace(/\.md/, ".pdf"))}`;
    $activeTabValue = 3;
  }

  async function getData() {
    try {
      let response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.ok) {
        nonConformitiesList = sortNC(await response.json());
        console.log(
          `fetched ${nonConformitiesList.length} non conformities`,
        ); // Affiche les donn�es JSON
      } else {
        console.error("HTTP error", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  $: tabs = [
    {
      label: "Non Conformity Creation",
      value: 1,
      active: true,
      arguments: {
        history: history,
      },
      component: NonConformityCreation,
    },
    {
      label: "Non Conformity Reference",
      value: 2,
      active: $selectItem,
      component: NonConformityDetail,
      arguments: {
        selectedItem: $selectItem,
      },
    },
    {
      label: "Document",
      value: 3,
      active: $selectDoc,
      component: ShowDocument,
      arguments: {
        url: selectDocUrl,
      },
    },
  ];

  getData();

  $: if ($askForHelp) {
    showChatbot = true;
    expand = true;
    let role = $askForHelp;
    $askForHelp = false;
    $createdItem.currentTask = role;
    setTimeout(() => {
      $chatElementRef.submitUserMessage({
        text: $defaultAction,
        role: role,
      });
    }, 200);
  }

  $: if ($referencesList && $referencesList["non_conformities"]) {
    nonConformitiesFilter =
      ($referencesList["non_conformities"] &&
        $referencesList["non_conformities"]["sources"]) ||
      [];
    nc_num = nonConformitiesFilter.length;
  } else {
    nonConformitiesFilter = [];
  }

  $: if ($referencesList && $referencesList["tech_docs"]) {
    documentsList = Object.values(
      Object.values(
        ($referencesList["tech_docs"] &&
          $referencesList["tech_docs"]["sources"]) ||
          [],
      ).reduce((group, item) => {
        // Si le groupe pour cet ID doc n'existe pas encore, on l'initialise
        if (!group[item.doc]) {
          group[item.doc] = {
            doc: item.doc,
            chunks: [], // Initialisation des chunks
          };
        }
        // Ajouter les propriétés chunk_id, chunk à ce groupe
        group[item.doc].chunks.push({
          chunk_id: item.chunk_id,
          chunk: item.content,
        });
        return group;
      }, {}),
    ); // Initialisation d'un objet vide pour regrouper les items
    doc_num = documentsList.length;
    console.log(`tech_docs ${doc_num}`, documentsList);
  } else {
    console.log("tech_docs clean");
    documentsList = [];
  }

  $: doc_num = documentsList.length;
</script>

<Header bind:expand></Header>
<div
  class="MuiDrawer-root MuiDrawer-docked MuiDrawer-root-custom"
  style="display: {expand ? 'block' : 'none'}"
>
  <div
    class="MuiPaper-root MuiPaper-elevation MuiPaper-elevation0 MuiDrawer-paper MuiDrawer-paperAnchorLeft MuiDrawer-paperAnchorDockedLeft MuiDrawer-custom"
    style="transform: none; transition: transform 225ms cubic-bezier(0, 0, 0.2, 1);"
  >
    <nav
      class="MuiList-root MuiList-padding"
      aria-labelledby="nested-list-subheader"
    >
      {#if doc_num > 0}
        <PaneItem expand={true} title="Documents" num={doc_num}>
          <DocumentsList {documentsList}></DocumentsList>
        </PaneItem>
      {/if}
      {#if nc_num > 0}
        <PaneItem expand={true} title="Non Conformities" num={nc_num}>
          <NonConformityList
            nonConformities={nonConformitiesList}
            {nonConformitiesFilter}
            bind:num={nc_num}
          ></NonConformityList>
        </PaneItem>
      {/if}
      <div
        class="MuiList-root MuiList-padding"
        style="position: absolute;bottom:60px"
      >
        <PaneItem
          bind:expand={showChatbot}
          title="AI Assistant"
          num={undefined}
          inverted={true}
        >
          <Chatbot stream={true}></Chatbot>
        </PaneItem>
      </div>
    </nav>
  </div>
</div>
<main style={expand ? "margin-left:25rem" : ""}>
  <div class="pane right">
    <Tabs items={tabs}></Tabs>
  </div>
</main>

<style>
  main {
    padding: 0rem;
    height: calc(100vh - 75px);
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
    height: 100vh;
    overflow-y: auto;
  }
  .MuiDrawer-root-custom .MuiDrawer-paper {
    box-sizing: border-box;
    top: 75px;
    width: 25rem;
    box-shadow: none;
    filter: drop-shadow(rgba(104, 114, 116, 0.267) 0px 2px 5px);
    border-left: 1px solid rgb(214, 217, 219);
    z-index: 200;
  }

  .MuiDrawer-custom {
    background-color: rgb(255, 255, 255);
    color: rgba(0, 0, 0, 0.87);
    box-shadow: none;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 1200;
    position: fixed;
    top: 0px;
    left: 0px;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
    flex: 1 0 auto;
    outline: 0px;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
  }
  .left {
    width: 25vw;
    display: flex;
    flex-direction: column;
  }
  .right {
    transition: width 0.3s;
    height: inherit;
  }
</style>
