const vscode = require('vscode');
const { getFilesInCurrentDirectory } = require('../../utils');

class FileSelector {
    constructor(context) {
        this.context = context;
        this.selectedFiles = [];
    }

    async selectFiles() {
        const filePaths = await getFilesInCurrentDirectory();
        const files = filePaths.map(filePath => (vscode.Uri.file(filePath)));

        const fileItems = files.map(file => ({
            label: vscode.workspace.asRelativePath(file.fsPath),
            fsPath: file.fsPath
        }));

        const selectedItems = await vscode.window.showQuickPick(fileItems, {
            canPickMany: true,
            placeHolder: 'Select files to include in the query context'
        });

        if (selectedItems && selectedItems.length > 0) {
            const allSelectedFiles = [...this.selectedFiles, ...selectedItems];
            const uniqueFiles = Array.from(new Map(allSelectedFiles.map(file => [file.fsPath, file])).values());
            this.selectedFiles = uniqueFiles;

            // this.updateHeader();
        }
    }

    getSelectedFiles() {
        return this.selectedFiles;
    }

    removeFile(filePath) {
        this.selectedFiles = this.selectedFiles.filter(file => file.fsPath !== filePath);
        // this.updateHeader();
    }

    updateHeader() {
        const selectedFiles = this.getSelectedFiles().map(file => file.fsPath);
        vscode.window.showInformationMessage(`Selected Files: ${selectedFiles.join(', ') || 'None'}`);
    }
}

module.exports = FileSelector;