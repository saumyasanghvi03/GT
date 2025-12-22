// @ts-nocheck

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();
    const { Marked } = globalThis.marked;
    const { markedHighlight } = globalThis.markedHighlight;

    const marked = new Marked(
        markedHighlight({
          emptyLangClass: 'code-input-background hljs',
          langPrefix: 'code-input-background hljs language-',
          highlight(code, lang, info) {
            return hljs.highlightAuto(code).value;
          }
        })
    );
    const renderer = new marked.Renderer();
    const originalCodeRenderer = renderer.code;

    marked.use({
        renderer: renderer,
        pedantic: false,
        gfm: true,
        breaks: true,
        sanitize: false,
        smartypants: false,
        xhtml: false
    });

    const list = document.getElementById("qa-list");
    const emptyState = document.getElementById("empty-state");
    let loaderCounter = 0;
    let rotatingTextInterval;
    let currentResponseDiv = null;
    let accumulatedResponse = '';
    
    function toggleEmptyState() {
        if (list.innerHTML.trim() === "") {
            emptyState.classList.remove("hidden");
        } else {
            emptyState.classList.add("hidden");
        }
    }

    function toggleSelectedFilesSection(filesCount) {
        const selectedFilesSection = document.getElementById("selected-files-section");
        if (filesCount > 0) {
            selectedFilesSection.classList.remove("hidden");
        } else {
            selectedFilesSection.classList.add("hidden");
        }
    }

    toggleEmptyState(); // cross-check initial state

    function processResponse(text) {
        // First convert all inline code blocks to temporary placeholders
        // to avoid interference with the main code block conversion
        let processedText = text.replace(/`([^`]+)`/g, '§§§$1§§§');

        // Convert <source> blocks to markdown code blocks
        processedText = processedText
            .replace(/<source>\n?/g, '\n```\n')
            .replace(/\n?<\/source>/g, '\n```\n');

        // Now convert back the inline code placeholders
        processedText = processedText.replace(/§§§([^§]+)§§§/g, '`$1`');
        
        return marked.parse(processedText);
    }

    function startRotatingText(messagesWithTimeouts, element) {
        let index = 0;
    
        function updateText() {
            const [text, timeoutInSecs] = messagesWithTimeouts[index];
            element.textContent = text;
    
            index = (index + 1) % messagesWithTimeouts.length;
    
            rotatingTextInterval = setTimeout(updateText, timeoutInSecs * 1000);
        }
    
        updateText();
    }
    
    function stopRotatingText() {
        clearTimeout(rotatingTextInterval);
        rotatingTextInterval = null;
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener("message", (event) => {
        const message = event.data;

        switch (message.type) {
            case "addQuestion":
                loaderCounter++;
                const loaderId = `message-loader-${loaderCounter}`
                const rotatingTextId = `rotating-text-${loaderCounter}`;
                const html = message.code != null
                    ? marked.parseInline(message.value + "<br /> <br /><pre class='overflow-auto'><code>```" + message.code + "```</code></pre>")
                    : message.value;

                list.innerHTML +=
                    `<div class="px-4 self-end mb-4">
                        <p class="font-bold mb-5 flex">
                            You
                        </p>
                        <div>${html}</div>
                    </div>`;

                currentResponseDiv = document.createElement('div');
                currentResponseDiv.className = "px-4 self-end mb-4";
                currentResponseDiv.innerHTML = `
                    <p class="font-bold mb-5 flex">
                        BLACKBOXAI
                    </p>
                    <div class="flex gap-2">
                        <span id="${rotatingTextId}" class="shine-text text-sm text-gray-300"></span>
                        <span id="${loaderId}" class="loader pt-3">
                            <div class="loader-dot"></div>
                            <div class="loader-dot"></div>
                            <div class="loader-dot"></div>
                        </span>
                    </div>
                    <div id="current-response"></div>
                `;

                list.appendChild(currentResponseDiv);
                const rotatingTextElement = currentResponseDiv.querySelector(`#${rotatingTextId}`);
                startRotatingText([["Processing", 3], ["Analyzing the Code", 10]], rotatingTextElement);

                toggleEmptyState();

                break;
            case "updateResponse":
                if (currentResponseDiv) {
                    const responseContent = currentResponseDiv.querySelector('#current-response');
                    const loaderElement = currentResponseDiv.querySelector(`[id^="message-loader-"]`);
                    const rotatingTextElement = currentResponseDiv.querySelector(`[id^="rotating-text-"]`);
                    if (rotatingTextElement) {
                        stopRotatingText();
                        startRotatingText([["Thinking", 3], ["Writing the Code", 8], ["Finalizing", 20]], rotatingTextElement);
                    }
                    if (responseContent) {
                        const token = message.value;
                        
                        accumulatedResponse += message.value;
                        console.log(`Original: ${accumulatedResponse}`);
                        responseContent.innerHTML = processResponse(accumulatedResponse);
                        // responseContent.innerHTML = marked.parse(accumulatedResponse);
                        console.log(`After: ${responseContent.innerHTML}`)
                    }
                }
                break;
            case "addResponse":
                if (currentResponseDiv) {
                    const responseContent = currentResponseDiv.querySelector('#current-response');
                    const loaderElement = currentResponseDiv.querySelector(`[id^="message-loader-"]`);
                    const rotatingTextElement = currentResponseDiv.querySelector(`[id^="rotating-text-"]`);
                    if (loaderElement) {
                        loaderElement.remove();
                    }
                    if (rotatingTextElement) {
                        rotatingTextElement.remove();
                    }
                    if (responseContent) {
                        responseContent.innerHTML = processResponse(message.value);
                        // responseContent.innerHTML = marked.parse(message.value);
                        const divider = document.createElement('div');
                        divider.className = "border-b border-gray-200 opacity-25 mt-4";
                        currentResponseDiv.appendChild(divider);
                        console.log(`FINAL: ${responseContent.innerHTML}`)
                    }
                    stopRotatingText();
                }
                currentResponseDiv = null;
                accumulatedResponse = '';
                break;
            case "updateSelectedFiles":
                const fileListContainer = document.getElementById("selected-files-list");
                fileListContainer.innerHTML = '';

                message.files.forEach(file => {
                    const fileItem = document.createElement('div');
                    fileItem.className = "file-row flex items-center gap-2 p-2";
                    fileItem.innerHTML = `
                        <span class="file-label">${file.label}</span>
                        <button class="delete-button ml-auto !bg-transparent hover:!bg-transparent">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                </path>
                            </svg>
                        </button>
                    `;

                    fileItem.querySelector('.delete-button').addEventListener('click', () => {
                        vscode.postMessage({ type: 'removeFile', filePath: file.fsPath });
                    });

                    fileListContainer.appendChild(fileItem);
                });
                toggleSelectedFilesSection(message.files.length);
                break;
            default:
                break;
        }
    });

    let submitHandler = function (e) {
        e.preventDefault();
        e.stopPropagation();
        const input = document.getElementById("question-input");
        if (input.value?.length > 0) {
            vscode.postMessage({
                type: "askBlackbox",
                value: input.value,
            });

            input.value = "";
            input.style.height = 'auto';
            input.parentNode.dataset.replicatedValue = input.value;
        }
    };

    document.getElementById("clear-button")?.addEventListener("click", () => {
        list.innerHTML = "";
        toggleEmptyState();
        vscode.postMessage({ type: "clearChat", });
    });
    document.getElementById("select-files-button")?.addEventListener("click", () => {
        vscode.postMessage({ type: "selectFiles" });
    });
    document.getElementById("ask-button")?.addEventListener("click", submitHandler);
    document.getElementById("question-input")?.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            submitHandler(e);
        }
    });

})();