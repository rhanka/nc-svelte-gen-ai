
<script>
  	import { marked } from 'marked'; // Import the marked library
	import { DeepChat } from "deep-chat";
	let aiUrl = 'https://dataiku.genai-cgi.com/web-apps-backends/NONCONFORMITIES/3DGvs3v/ai';
	export let stream = false;
	let currentMsg = {};
	let nativeStream = true;
	import { createdItem, updateCreatedItem, isUpdating, referencesList, askForHelp } from './store.js';

	let chatElementRef;

	$: console.log(`stream: ${stream}, nativeStream: ${nativeStream}`);

  const history = [
  ];

	// Fonction naïve qui ferme guillemets, crochets et accolades restants
	const completeJSON = (str) => {
		let openCurly = 0, openSquare = 0;
		let inString = false, escaped = false;

		for (let i = 0; i < str.length; i++) {
		const c = str[i];
		if (c === '"' && !escaped) inString = !inString;
		escaped = (!escaped && c === '\\');
		if (!inString) {
			if (c === '{') openCurly++;
			else if (c === '}') openCurly--;
			else if (c === '[') openSquare++;
			else if (c === ']') openSquare--;
		}
    }

    let fixed = str;
    if (inString) fixed += '"';
    while (openSquare > 0) { fixed += ']'; openSquare--; }
    while (openCurly > 0) { fixed += '}'; openCurly--; }
    return fixed;
	}

	const parsePartialJSON = (chunk) => {
		// On concatène le nouveau bout et on tente une fermeture
		const buffer = chunk;
		const attempt = completeJSON(buffer);
		try {
			const parsed = JSON.parse(attempt);
			return parsed;
		} catch {
			return null;
		}
	}

	const actionInit = (data) => {
		console.log("actionInit",data)
		currentMsg[data.metatada] = '';
		// chatElementRef.updateMessage({ html: `<div class="tool">${data.text} ...</div>`}, 0);
		return { text: `*${data.text}...*\n`};
	}

	const actionStream = (data) => {
		currentMsg[data.metadata] += data.v;
	}

	const actionCanevasStream = (data) => {
		if (!currentMsg[data.metadata]) {
			currentMsg[data.metadata] = { v: '', jsonString : ''};
		}
		currentMsg[data.metadata].jsonString += data.v;
		const json = parsePartialJSON(currentMsg[data.metadata].jsonString);
		if (json) {
			$updateCreatedItem = { role: $createdItem.currentTask, label: json.label , description: json.description};
			if (json.comment) {
				const output = { 'v': json.comment.slice(currentMsg[data.metadata].v.length), metadata: data.metadata }
				currentMsg[data.metadata].v = json.comment;
				return output;
			}
		}
	}

	const updateReferencesList = (data) => {
		currentMsg[data.metadata] = '';
		console.log("updateReferencesList",data)
		const key = data.metadata == "nc_search" ? "non_conformities" : "tech_docs";
		const otherKey = data.metadata == "nc_search" ? "tech_docs" : "non_conformities";
		if ($referencesList) {
			$referencesList = { [key]: data.text, [otherKey]: $referencesList[otherKey] };
		} else {
			$referencesList = { [key]: data.text, [otherKey]: { sources: []} };
		}
	}

	const updateTask = (data) => {
		const json = data.text;
		$isUpdating = false;
		$updateCreatedItem = { role: $createdItem.currentTask, label: json.label, description: json.description};
		return { text: json.comment }
	}

	const agentHeadTemplate = {
		action: actionInit,
		stream: actionStream
	}

	const canevasAgentTemplate = {
		action: actionInit,
		stream: actionCanevasStream,
		result: updateTask
	}

	const agentHead = {
		"query": {
			...agentHeadTemplate,
			result: () => {}
		},
		"nc_search": {
			...agentHeadTemplate,
			result: updateReferencesList
		},
		"doc_search": {
			...agentHeadTemplate,
			result: updateReferencesList
		},
		"000": canevasAgentTemplate,
		"100": canevasAgentTemplate,
		"200": canevasAgentTemplate,
		"300": canevasAgentTemplate,
		"400": canevasAgentTemplate,
		"final": {
			result: () => {}
		}
	}

	const eventProcess = (data) => {
		if (data.v) {
			return agentHead[data.metadata].stream(data)
		} else {
			return agentHead[data.metadata][data.type](data) || { v: '' }
		}
	}

	const responseInterceptor = async (response) => {
		console.log('responseInterceptor');
		if (!stream) {
			// Lire le Blob comme texte
			const text = await response.text();
				// Tenter de parser le texte en JSON
			try {
				const json = JSON.parse(text);
				$referencesList = json.sources;
				console.log('response',json);
				$isUpdating = false;
				$updateCreatedItem = { role: $createdItem.currentTask, label: json.label, description: json.description};
				return {html: marked(json.text)}; // Retourner le JSON � DeepChat
			} catch (e) {
				console.error("Erreur lors du parsing du JSON:", e);
				return { error: "Invalid JSON format" }; // Retourner une erreur si le JSON est invalide
			}
		} else if (stream && nativeStream) {
			return eventProcess(response);
		} else {
			console.log('process response without custom Stream');
			const reader = response.body.getReader();
        	const decoder = new TextDecoder();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value, { stream: true });
				const lines = chunk.split("\n").filter(line => line.trim() !== "");

				const messages= lines
					.map((line) => {
						if (line.startsWith("data: ")) {
							try {
								const data = JSON.parse(line.slice(6));
							} catch {
								return { v: '' }
							}
						}
					});
			}
		}
	};

	const requestInterceptor = (requestDetails) => {
		requestDetails.body.messages[0].role = $createdItem.currentTask;
		requestDetails.body.messages[0].history = ['000', '100', '200', '300', '400', '500']
			.filter((key) => key < $createdItem.currentTask)
			.map((key) => $createdItem['analysis_history'][key]);
		requestDetails.body.messages[0].text = $createdItem['analysis_history'][$createdItem.currentTask][0];
		if ($referencesList) {
			requestDetails.body.messages[0].sources = $referencesList;
		}
		$isUpdating = $createdItem.currentTask;
		console.log('requestInterceptor',requestDetails);
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
			stream: stream && nativeStream,
			url: aiUrl,
			method: "POST",
			headers: (nativeStream && stream) ? {} : {
				"Content-Type": "application/json",
				"Accept": stream ? "text/event-stream" :"application/json"
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
					chatElementRef.submitUserMessage({text: text});
				},
				},
				styles: {
				default: {backgroundColor: '#f2f2f2', borderRadius: '10px', padding: '10px', cursor: 'pointer', textAlign: 'center'},
				hover: {backgroundColor: '#ebebeb'},
				click: {backgroundColor: '#e4e4e4'},
				},
			},
			'custom-button-text': {styles: {default: {pointerEvents: 'none'}}},
			'tool': {styles: {color: '#ccc'}},
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