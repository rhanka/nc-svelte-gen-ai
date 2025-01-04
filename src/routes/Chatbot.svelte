
<script>
  import { marked } from 'marked'; // Import the marked library
	import { DeepChat } from "deep-chat";
	let aiUrl = 'https://dataiku.genai-cgi.com/web-apps-backends/NONCONFORMITIES/3DGvs3v/ai';
	export let referencesList = [];
	import { createdItem, updateCreatedItem } from './store.js'

  const history = [
    { role: "system", text: "How can I help you today?" }
  ];

	const responseInterceptor = async (response) => {
    // Lire le Blob comme texte
    const text = await response.text();
		// Tenter de parser le texte en JSON
    try {
      const json = JSON.parse(text);
			referencesList = json.sources;
			let role = currentTask();
			console.log('response',json);
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
	  requestDetails.body.messages[0].text = `
I have the role for task ${role}

I'm editing current task: ${JSON.stringify($createdItem['analysis_history'][role][0])}

Please helping me the base update for this task and following specific request: ${requestDetails.body.messages[0].text}
`
		console.log('request', requestDetails)
	  return requestDetails;
	};
</script>

<main style="margin: -4px;">
  <deep-chat
		avatars="true"
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
	      "focus": {"border": "2px solid #a2a2ff"}
	    },
			placeholder:{text: "Ask your question"}}
		 }
		responseInterceptor={responseInterceptor}
	  requestInterceptor={requestInterceptor}
    history={history}
		chatStyle={{
			"border": "0px",
			"width": "300px",
			"height": "250px"
		}}
  ></deep-chat>
</main>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
    justify-content: center;
    display: grid;
  }
</style>