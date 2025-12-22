"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.autoCompleteSave = void 0
exports.savedLines = void 0

const config_1 = require("../config")
const vscode_1 = require("vscode")
const { requestInferenceAutocompleteV2, requestsAutocompleteV2 } = require('./autocompleteInferenceV2')
/**
 *
 * @param {string} input
 * @returns {SearchMatchResult | undefined}
 */
var checkTime
var lastSentence = ""

function dateToMilliseconds(dateString) {
	const dateParts = dateString.split("-");
	const year = parseInt(dateParts[0], 10);
	const month = parseInt(dateParts[1], 10) - 1; // months are 0-based in JS
	const day = parseInt(dateParts[2], 10);

	const date = new Date(year, month, day);
	return date.getTime();
}

async function autoCompleteSave(text, obj, userId, languageId, premium_status, context, currentLine, editorContext) {
	const promise = new Promise(async (resolve, reject) => {
		if (text.length) {
			var addToStorage = false
			var acceptType = ''
			clearInterval(checkTime)

			var count = 0
			var sentence = ""
			for (const k in obj) {
				var lastLine = text
				if (text.includes('\n')) lastLine = text.split('\n')[text.split('\n').length-1].trim()
				if (k.startsWith(lastLine)) {
					if (count === 0) {
						count = obj[k].uses
						// sentence = k
					} else {
						if (obj[k].uses > count) {
							count = obj[k].uses
							// sentence = k
						}
					}
				}
			}
			if (sentence) {
				text = lastLine
				acceptType = 'Saved Line Or Snippet'
			}
			var lastLine = text
			if (text.includes('\n')) lastLine = text.split('\n')[text.split('\n').length-1].trim()
			if (text.length>10){
				var result = {'response': ''}
				text += (currentLine.trim().length === 0) ? '\n' : ''
				
				const mainEndpoint = 'suggestv4'
				const newEndpoint = 'suggestv6'
				const latestEndpoint = 'suggestv7'
				const endpointLocal = 'local'
				let endpoint = mainEndpoint
				const dateFeb1 = 1706763600000
				const date_jan_1 = 1704067200000
				const may1 = 1714536000000
				const updateDateMarch = dateToMilliseconds("2024-03-01")
				const latestUpdate = dateToMilliseconds("2024-06-25")
				let dateInstalledLocalStorage = null
				if (editorContext) {
					dateInstalledLocalStorage = editorContext.globalState.get("installedDate")
					if (dateInstalledLocalStorage){
						if (dateInstalledLocalStorage > date_jan_1){
							endpoint = newEndpoint
						}
						if (dateInstalledLocalStorage > updateDateMarch){
							endpoint = latestEndpoint
						}
						if (dateInstalledLocalStorage > latestUpdate){
							endpoint = newEndpoint
						}
					}
				}
				const autocompleteMode = editorContext.globalState.get("autocompleteVersion")
				const goBeastAutocomplete = (
					(
						dateInstalledLocalStorage > dateToMilliseconds('2024-04-01')
						|| 
						(
							autocompleteMode === undefined 
							|| (
								autocompleteMode &&  autocompleteMode === 'speed'
							)
						)
						|| (
							autocompleteMode && autocompleteMode === 'speed'
						)
					)
				)


				if( goBeastAutocomplete ){
					let startT = Date.now()
					let response = await requestInferenceAutocompleteV2(text, userId)
					if (response){
						result = response
						sentence = result['response']
						sentence = (currentLine.trim().length === 0) ? sentence.trim() : sentence
						acceptType = 'Code Complete'
						if (sentence) {
							resolve({
								complete: sentence,
								save: false,
								acceptType: acceptType,
								line: lastLine
							})
							return
						}
						
					}
				}
				if (premium_status){
					// text = formattingContext(text, context)
					let url_request = ''
					try{
						const response = await fetch(`https://www.useblackbox.io/${endpoint}`, {
							method: 'POST',
							body: JSON.stringify({
								inputCode: text,
								source: "visual studio",
								userId: userId,
								languageId: languageId,
								when: Date.now()/1000.0,
								premium: premium_status,
								context
							}),
							headers: {
								'Content-Type': 'application/json',
								Accept: 'application/json',
							},
						});
						result = await response.json();
						try{
							sentence = result['response']
							sentence = (currentLine.trim().length === 0) ?  sentence.trim() : sentence
							acceptType = 'Code Complete'
						}catch(e){}
					}catch(e){}
				}else{
					// text = formattingContext(text, context)
					let url_request = ''
					try{
						const response = await fetch(`https://www.useblackbox.io/${endpoint}`, {
							method: 'POST',
							body: JSON.stringify({
								inputCode: text,
								source: "visual studio",
								userId: userId,
								languageId: languageId,
								when: Date.now()/1000.0,
								premium: premium_status,
								context
							}),
							headers: {
								'Content-Type': 'application/json',
								Accept: 'application/json',
							},
						});
						result = await response.json();
						try{
							sentence = result['response']
							sentence = (currentLine.trim().length === 0) ?  sentence.trim() : sentence
							acceptType = 'Code Complete'
						}catch(e){}
					}catch(e){}
				}
				selectionFct('Code Complete New', userId)
			}
			lastSentence = text
			if (sentence) {
				resolve({
					complete: sentence,
					save: false,
					acceptType: acceptType,
					line: lastLine
				})
			} else {
				resolve({
					complete: false,
					save: false,
					acceptType: ''
				})
			}
		} else {
			addToStorage = false
			if (obj[lastSentence] === undefined) {
				addToStorage = true
			}
			resolve({
				complete: false,
				save: false,
				line: lastSentence,
				acceptType: ''
			})
		}
	})
	return promise
}
async function savedLines(text, obj) {
	const promise = new Promise(async (resolve, reject) => {
		text = text.trim()
		if (text.length > 10) {
			lastSentence = text
			var sentence = ""
			var count = 0

			for (const k in obj) {
				var lastLine = text
				if (text.includes("\n"))
					lastLine = text
						.split("\n")
						[text.split("\n").length - 1].trim()
				if (k.startsWith(lastLine)) {
					if (count === 0) {
						count = obj[k].uses
						sentence = k
					} else {
						if (obj[k].uses > count) {
							count = obj[k].uses
							sentence = k
						}
					}
				}
			}

			if (sentence.length) {
				resolve({
					complete: sentence.slice(text.length, sentence.length),
					save: false
				})
			} else {
				resolve({
					complete: false,
					save: false
				})
			}
		} else {
			var addToStorage = false
			if (
				obj[lastSentence] === undefined &&
				lastSentence.trim().length > 0
			) {
				addToStorage = true
			}
			resolve({
				complete: false,
				save: addToStorage,
				line: lastSentence
			})
		}
	})
	return promise
}
function keepOneLine(response){
    //find index of not \n character
    let non_linebreak_index = 0
    for (let i=0;i<response.length;i++){
        if (/\s/.test(response[i]) == false){
            non_linebreak_index = i
            break
        }
    }
    let end_index = response.indexOf('\n', non_linebreak_index)
    let first_actual_line = ''
    if (end_index == -1){
        first_actual_line = response
    }else{
        first_actual_line = response.slice(0, end_index)
    }
	first_actual_line = filterOutput(first_actual_line)
    return first_actual_line
}


function formattingContext(text, context){
	if (context.length == 2){
		if (context[1] != ''){
			text = `<fim_prefix>${context[0]}<fim_suffix>${context[1]}<fim_middle>`
		}
	}
	return text
}

function filterOutput(response){
	if (response == '<|endoftext|>'){
		response = ''
	}else if (response.includes('<|endoftext|>')){
		response = response.replace('<|endoftext|>', '')
	}
	return response
}

async function selectionFct(event, userId) {
	try{
		const response = await fetch(
			"https://www.useblackbox.io/selection",
			{
				method: "POST",
				body: JSON.stringify({
					userId: userId,
					selected: event,
					source: "visual studio"
				}),
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json"
				}
			}
		)
		try{
			const result = await response.json()
		}catch(e){
			console.log(e)
		}
	}catch(e){
		console.log(e)
	}
}

exports.autoCompleteSave = autoCompleteSave
exports.savedLines = savedLines