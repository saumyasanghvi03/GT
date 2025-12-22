const vscode = require('vscode');
const fs = require('fs/promises');
const fsNative = require('fs');
const path = require('path');
const tar = require('tar');
const { sessionManager } = require('./session');
const ignore = require('ignore');
const FileSelector = require('./file-selector');
const { telemetry, eventTypes } = require('../../tlm')

const API_ENDPOINT = "http://129.146.22.206:8001";

async function writeFile(workdir, filePath, newContent) {
    const wholePath = path.resolve(workdir, filePath);

    try {
        await fs.mkdir(path.dirname(wholePath), { recursive: true });
        await fs.writeFile(wholePath, newContent.join(''), 'utf-8');
    } catch (e) {
        throw e;
    }
}

async function editFile(workdir, filePath, searchString, replaceString){
    const wholePath = path.resolve(workdir, filePath);
    
    try {
        // Create directory if it doesn't exist
        await fs.mkdir(path.dirname(wholePath), { recursive: true });
        
        let updatedContent = replaceString;
        if (searchString.trim().length > 0) {
            let fileContent;
            try {
                fileContent = await fs.readFile(wholePath, 'utf-8');
            } catch (error) {
                if (error.code === 'ENOENT') {
                    // File doesn't exist, use empty string as initial content
                    fileContent = '';
                } else {
                    throw error;
                }
            }
            
            const normalizedContent = fileContent.replace(/\r\n/g, '\n').trim();
            const normalizedSearch = searchString.replace(/\r\n/g, '\n').trim();
            const normalizedReplace = replaceString.replace(/\r\n/g, '\n').trim();

            updatedContent = normalizedSearch 
                ? normalizedContent.replace(normalizedSearch, normalizedReplace)
                : normalizedReplace;
        }

        await fs.writeFile(wholePath, updatedContent, 'utf-8');
    } catch (error) {
        console.error(`Error editing file: ${error}`);
        throw error;
    }
}
function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

class BlackboxAIEditorViewProvider {
    static column = vscode.ViewColumn.Two;
    static viewType = 'chatgptEditorView';

    constructor(context) {
        this.context = context;
        this.message = null;
        this.currentPanel = null;
        this.fileSelector = new FileSelector();
    }

    resolveChatPanel() {
        this.currentPanel.webview.html = this.getHtml(this.currentPanel.webview);

        // Handle messages from the webview
        this.currentPanel.webview.onDidReceiveMessage(async (data) => {
            if (data.type === 'askBlackbox') {
                this.sendApiRequest(data.value);
            } else if (data.type === 'clearChat') {
                this.clearChatRequest();
                this.message = null;
            } else if (data.type === 'stopGenerating') {
                // Placeholder for additional actions
            } else if (data.type === 'selectFiles') {
                await this.fileSelector.selectFiles();
                this.sendMessageToWebView({
                    type: 'updateSelectedFiles',
                    files: this.fileSelector.getSelectedFiles()
                });
            } else if (data.type === 'removeFile') {
                this.fileSelector.removeFile(data.filePath);
                this.sendMessageToWebView({
                    type: 'updateSelectedFiles',
                    files: this.fileSelector.getSelectedFiles()
                });
            }
        });

        if (this.message !== null) {
            this.sendMessageToWebView(this.message);
            this.message = null;
        }

        this.currentPanel.onDidDispose(() => {
            this.currentPanel = null;
        });
    }

    createOrShow() {
        if (this.currentPanel && this.currentPanel.webview) {
            this.currentPanel.reveal();
        } else {
            const panel = vscode.window.createWebviewPanel(
                BlackboxAIEditorViewProvider.viewType,
                'BLACKBOXAI',
                BlackboxAIEditorViewProvider.column,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [this.context.extensionUri],
                }
            );

            this.currentPanel = panel;
            this.resolveChatPanel();
        }
    }

    async clearChatRequest() {
        try {
            const sid = sessionManager.getSessionId();
            const response = await fetch(`${API_ENDPOINT}/clear_chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sid })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error clearing chat:', error);
            throw error;
        }
    }

    async sendApiRequest(prompt, code) {
        let question = code ? `${prompt}: ${code}` : prompt;
        const workDir = vscode.workspace.workspaceFolders?.[0];

        if (!workDir) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        this.currentPanel.reveal();

        this.sendMessageToWebView({ type: 'addQuestion', value: prompt, code });

        const selectedFiles = this.fileSelector.getSelectedFiles().map((file) => file.label);
        question = selectedFiles.length > 0
            ? `
                Files I want you to consider while analyzing: \r\n 
                ${selectedFiles.join('\r\n')} \r\n
                Here is what I want you to do: \r\n
                ${prompt}
            `
            : question;

        try {
            const tempTarPath = path.join(workDir.uri.fsPath, 'workspace.tar');
            const ig = ignore();
            const skipPatterns = ['.git', '.next', 'node_modules', '.venv', '.DS_Store', 'Thumbs.db', '*.log', tempTarPath];

            try {
                const gitignorePath = path.join(workDir.uri.fsPath, '.gitignore');
                if (fsNative.existsSync(gitignorePath)) {
                    const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
                    ig.add(gitignoreContent);
                    console.log("Loaded .gitignore patterns", workDir.uri.fsPath);
                }
            } catch (error) {
                console.error("Error reading .gitignore file:", error);
            }

            await tar.create(
                {
                    file: tempTarPath,
                    cwd: workDir.uri.fsPath,
                    filter: (filePath) => {
                        if (filePath === '.') {
                            return true;
                        }

                        const absoluteFilePath = path.normalize(filePath);
                        const posixPath = absoluteFilePath.split(path.sep).join('/');

                        if (ig.ignores(posixPath)) {
                            return false;
                        }

                        if (skipPatterns.some(pattern => posixPath.includes(pattern))) {
                            return false;
                        }
                        return true;
                    },
                    portable: true,
                    preservePaths: true,
                    follow: true,
                    noMtime: true
                },
                ['.']
            );

            const tarBuffer = await fs.readFile(tempTarPath);
            await fs.unlink(tempTarPath);

            const formData = new FormData();
            formData.append('repository', new Blob([tarBuffer], { type: 'application/x-tar' }), 'workspace.tar');
            formData.append('prompt', question);
            formData.append('sid', sessionManager.getSessionId());

            selectionFct('request mulit-file edit')
            telemetry(eventTypes.other, '', {
                tag: 'request-multifile',
                status: 'request-done'
            })
            const response = await fetch(`${API_ENDPOINT}/chat`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            telemetry(eventTypes.other, '', {
                tag: 'request-multifile',
                status: 'request-success'
            })

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = '';
            let buffer = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    buffer += chunk;
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        const jsonString = line.startsWith('data: ') ? line.slice(6) : line;
                        if (isValidJSON(jsonString)) {
                            const jsonData = JSON.parse(jsonString);

                            if (jsonData.token) {
                                accumulatedResponse += jsonData.token;
                                this.sendMessageToWebView({ type: 'updateResponse', value: jsonData.token });
                            } else if (jsonData.edits) {
                                for (const edit of jsonData.edits) {
                                    if (jsonData.format === 'whole') {
                                        await writeFile(workDir.uri.fsPath, edit[0], edit[2]);
                                    } else {
                                        await editFile(workDir.uri.fsPath, edit[0], edit[1], edit[2]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.sendMessageToWebView({ type: 'addResponse', value: accumulatedResponse });
        } catch (error) {
            vscode.window.showErrorMessage("Error sending request to BLACKBOXAI", error);
        }
    }

    sendMessageToWebView(message) {
        if (this.currentPanel.webview) {
            this.currentPanel.webview.postMessage(message);
        } else {
            this.currentPanel.message = message;
        }
    }

    getHtml(webview) {
        const htmlPath = path.join(this.context.extensionUri.fsPath, 'out', 'media', 'index.html');
        let htmlContent = fsNative.readFileSync(htmlPath, 'utf-8');

        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'out', 'media', 'main.js'));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'out', 'media', 'main.css'));
        const vendorHighlightCss = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'out', 'media', 'vendor', 'highlight.min.css'));
        const vendorHighlightJs = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'out', 'media', 'vendor', 'highlight.min.js'));

        htmlContent = htmlContent
            .replace('{{scriptUri}}', scriptUri.toString())
            .replace('{{stylesMainUri}}', stylesMainUri.toString())
            .replace('{{vendorHighlightCss}}', vendorHighlightCss.toString())
            .replace('{{vendorHighlightJs}}', vendorHighlightJs.toString());

        return htmlContent;
    }
}

async function selectionFct(event) {
    try {
        const response = await fetch(
            "https://www.useblackbox.io/selection",
            {
                method: "POST",
                body: JSON.stringify({
                    userId: '',
                    selected: event,
                    source: "visual studio"
                }),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }
        )
        try {
            const result = await response.json()
        } catch (e) {
            console.log(e)
        }
    } catch (e) {
        console.log(e)
    }
}

module.exports = BlackboxAIEditorViewProvider;
