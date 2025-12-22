const vscode = require('vscode');


function addEmptyDecoration() {

    try {
        // Update settings to hide the "empty file" hint
        vscode.workspace.getConfiguration().update('workbench.editor.empty.hint', 'hidden', true);
    
    
        const isMac = process.platform === 'darwin';
        const shortcutKey = isMac ? '⌘+I' : 'CTRL + I';
        const shorcutForInlineChat = isMac ? '⌘+L' : 'CTRL + L';
    
        let decorationText = `Press (${shortcutKey}) Chat with BLACKBOX.AI / (${shorcutForInlineChat}) Share Code`;
    
        const emptyFileDecoration = vscode.window.createTextEditorDecorationType({
            after: {
                contentText: decorationText,
                color: '#969696ad',
                fontStyle: 'italic',
                margin: '0 0 0 0'
            }
        });
        // Add event listener for active editor change
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                updateEmptyFileDecoration(editor);
            }
        });
        // Add event listener for document changes
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                updateEmptyFileDecoration(editor);
            }
        });
        function updateEmptyFileDecoration(editor) {
            const text = editor.document.getText().trim();
            if (text === '') {
                // File is empty, add decoration
                const position = new vscode.Position(0, 0);
                editor.setDecorations(emptyFileDecoration, [{
                    range: new vscode.Range(position, position)
                }]);
            } else {
                // File has content, remove decoration
                editor.setDecorations(emptyFileDecoration, []);
            }
        }
        // Initialize decoration for current editor
        if (vscode.window.activeTextEditor) {
            updateEmptyFileDecoration(vscode.window.activeTextEditor);
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    addEmptyDecoration
}