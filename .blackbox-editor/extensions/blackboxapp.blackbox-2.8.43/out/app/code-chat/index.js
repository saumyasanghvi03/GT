const vscode = require('vscode');
const BlackboxAIEditorViewProvider = require('./blackboxai-editor-view-provider');

async function activateCodeChat(context) {
    const chatViewProvider = new BlackboxAIEditorViewProvider(context);

    context.subscriptions.push(
        vscode.commands.registerCommand('blackbox.askGPT', askBlackbox),
        vscode.commands.registerCommand('blackbox.explainPls', askGPTToExplain),
        vscode.commands.registerCommand('blackbox.refactor', askGPTToRefactor),
        vscode.commands.registerCommand('blackbox.addTests', askGPTToAddTests),
        vscode.commands.registerCommand('blackbox.openChat', async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                // Get downloads folder path based on OS
                const homeDir = process.env.HOME || process.env.USERPROFILE;
                const downloadsPath = vscode.Uri.file(`${homeDir}/Downloads`);
                
                const newFolderName = `blackbox-ai-${Date.now()}-project`;
                const newFolderPath = vscode.Uri.joinPath(downloadsPath, newFolderName);
                
                try {
                    await vscode.workspace.fs.createDirectory(newFolderPath);
                    await vscode.commands.executeCommand('vscode.openFolder', newFolderPath);
                    context.globalState.update("clickEmptyDir", true);
                } catch (error) {
                    vscode.window.showErrorMessage('Failed to create directory in Downloads folder');
                }
            }
            chatViewProvider.createOrShow(context);
        })
    );

    if (context.globalState.get("clickEmptyDir")){
        //clear this localstorage item
        context.globalState.update("clickEmptyDir", false)
        chatViewProvider.createOrShow(context);
    }

    async function askGPTToExplain() { await askBlackbox('Can you explain what this code does?'); }
    async function askGPTToRefactor() { await askBlackbox('Can you refactor this code and explain what\'s changed?'); }
    async function askGPTToAddTests() { await askBlackbox('Can you add tests for this code?'); }

    async function askBlackbox(userInput) {
        if (!userInput) {
            userInput = await vscode.window.showInputBox({ prompt: "Ask BLACKBOXAI a question" }) || "";
        }

        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const selectedCode = editor.document.getText(editor.selection);
            const entireFileContents = editor.document.getText();

            const code = selectedCode
                ? selectedCode
                : `This is the ${editor.document.languageId} file I'm working on: \n\n${entireFileContents}`;

            chatViewProvider.sendApiRequest(userInput, code);
        }
    }
}

module.exports = {
    activateCodeChat
};
