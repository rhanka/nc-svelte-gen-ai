
<script>
  import { marked } from 'marked'; // Import the marked library
	import { DeepChat } from "deep-chat";
	let aiUrl = 'https://dataiku.genai-cgi.com/web-apps-backends/NONCONFORMITIES/3DGvs3v/ai';
	export let referencesList;
	import { createdItem, updateCreatedItem, isUpdating, askForHelp } from './store.js';
	let chatElementRef;

  const history = [
  ];

	const responseInterceptor = async (response) => {
    // Lire le Blob comme texte
    const text = await response.text();
		// Tenter de parser le texte en JSON
    try {
		const json = JSON.parse(text);
		referencesList = json.sources;
		let role = $createdItem.currentTask;
		console.log('response',json);
		$isUpdating = false;
		$updateCreatedItem = { role: role, label: json.label, description: json.description};
		return {html: marked(json.text)}; // Retourner le JSON � DeepChat
    } catch (e) {
		console.error("Erreur lors du parsing du JSON:", e);
		return { error: "Invalid JSON format" }; // Retourner une erreur si le JSON est invalide
    }
	};

	const currentTask = () => {
		console.log('history', $createdItem['analysis_history'])
		if ($createdItem['analysis_history']['500'].length > 0) { return '500'}
		if ($createdItem['analysis_history']['400'].length > 0) { return '400'}
		if ($createdItem['analysis_history']['300'].length > 0) { return '300'}
		if ($createdItem['analysis_history']['200'].length > 0) { return '200'}
		if ($createdItem['analysis_history']['100'].length > 0) { return '100'}
		return '000';
	}

	const requestInterceptor = (requestDetails) => {
		let role = currentTask();
		requestDetails.body.messages[0].role = role;
		requestDetails.body.messages[0].history = ['000', '100', '200', '300', '400', '500']
			.filter((key) => key < role)
			.map((key) => JSON.stringify($createdItem['analysis_history'][key]));
		requestDetails.body.messages[0].text = JSON.stringify($createdItem['analysis_history'][role][0]);
		console.log('request', requestDetails)
		$isUpdating = role;
		return requestDetails;
	};
</script>

<main style="margin: 0px;">
  <deep-chat
		bind:this={chatElementRef}
		avatars={{
			"ai": "https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg"
		}}
		connect={{
			url: aiUrl,
			method: "POST",
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Origin': 'https://svelte.dev'
				}
		}}
		textInput={
				{
			"styles": {
			"text": {"color": "black"},
			"container": {
					"width": "100%",
					"border-radius": "0px",
					"border-color": "#555"
				},
			"focus": {"border": "2px solid #ccc"}
			},
			placeholder:{text: "Ask your question"}}
		}
		intropanel={{
			"styles": {
			"container": {
				"backgroundColor": "rgba(247,247,248)",
				"borderTop": "1px solid rgba(0,0,0,.1)",
				"borderBottom": "1px solid rgba(0,0,0,.1)"
			},
			"header": {
				"color": "black"
			},
			"body": {
				"color": "black"
			}
			},
			"header": "Welcome to the Non-Conformity Chatbot",
			"body": "I'm here to help you with your non-conformity tasks. Please provide me with the necessary information to help you."
		}}
		messageStyles={{
			"default": {
			"shared": {
				"bubble": {
				"maxWidth": "100%", "backgroundColor": "unset", "marginTop": "10px", "marginBottom": "10px"}},
			"user": {
				"bubble": {
				"color": "black"}},
			"ai": {
				"outerContainer": {
				"backgroundColor": "rgba(247,247,248)", "borderTop": "1px solid rgba(0,0,0,.1)", "borderBottom": "1px solid rgba(0,0,0,.1)"
				}
			}
			}
		}}
		responseInterceptor={responseInterceptor}
		requestInterceptor={requestInterceptor}
		history={history}
		chatStyle={{
			"border": "0px",
			"width": "22.75vw",
			"height": "30vh"
		}}
		htmlClassUtilities = {{
			'custom-button': {
				events: {
				click: (event) => {
					const text = event.target.children[0].innerText;
					chatElementRef.submitUserMessage(text);
				},
				},
				styles: {
				default: {backgroundColor: '#f2f2f2', borderRadius: '10px', padding: '10px', cursor: 'pointer', textAlign: 'center'},
				hover: {backgroundColor: '#ebebeb'},
				click: {backgroundColor: '#e4e4e4'},
				},
			},
			'custom-button-text': {styles: {default: {pointerEvents: 'none'}}},
			}
		}
  >
    <div style="display: none">
    <div class="custom-button">
      <div class="custom-button-text">Propose task description</div>
    </div>
    <div class="custom-button" style="margin-top: 15px">
      <div class="custom-button-text">Translate to french</div>
    </div>
  </div>


  </deep-chat>
</main>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
    justify-content: center;
    display: grid;
  }
</style>