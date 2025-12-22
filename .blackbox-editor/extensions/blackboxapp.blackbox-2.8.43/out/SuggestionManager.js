const vscode = require("vscode");
const { calculateEndPosition } = require("./utils");

class SuggestionManager {
  constructor() {
    this.suggestions = new Map();
    this.onDidChangeCodeLensesEmitter = new vscode.EventEmitter();
    this.onDidChangeCodeLenses = this.onDidChangeCodeLensesEmitter.event;
  }

  overrideRangeAndPosition(id, startPosition, endPosition) {
    const suggestion = this.suggestions.get(id);
    if (suggestion) {
      suggestion.position = startPosition;
      suggestion.range = new vscode.Range(startPosition, endPosition);
    }
  }

  addSuggestion(uri, position, text, originalText, originalPrompt) {
    const id = (Math.random() * 1000000).toFixed(0);
    const addedDecorationType = vscode.window.createTextEditorDecorationType({
      isWholeLine: false,
      backgroundColor: "#4d5645",
    });
    const removedDecorationType = vscode.window.createTextEditorDecorationType({
      isWholeLine: false,
      backgroundColor: "#784545",
    });
    const mainDecorationType = vscode.window.createTextEditorDecorationType({
      backgroundColor: new vscode.ThemeColor("editor.selectionBackground"),
    });
    const suggestion = {
      id,
      uri,
      position,
      text,
      originalText,
      originalPrompt,
      range: new vscode.Range(position, position),
      mainDecorationType,
      addedDecorationType,
      removedDecorationType,
      showingDiff: false,
    };

    this.suggestions.set(id, suggestion);
    this.updateCodeLenses();
    return id;
  }

  async revertSuggestion(id) {
    const suggestion = this.getSuggestion(id);
    if (!suggestion) {
      return "";
    }
    const editor = await vscode.window.showTextDocument(suggestion.uri);
    this.clearDecoration(id);

    await editor.edit((editBuilder) => {
      editBuilder.replace(suggestion.range, suggestion.originalText);
    });
  }

  async updateSuggestionText(id, newText, range) {
    const suggestion = this.suggestions.get(id);
    if (suggestion) {
      const editor = await vscode.window.showTextDocument(suggestion.uri);

      suggestion.text = newText;

      await editor.edit((editBuilder) => editBuilder.replace(range, newText));

      const newRange = calculateEndPosition(suggestion.position, newText);
      suggestion.range = new vscode.Range(suggestion.position, newRange);

      editor.setDecorations(suggestion.mainDecorationType, [suggestion.range]);
    }
  }

  getSuggestion(id) {
    return this.suggestions.get(id);
  }

  removeSuggestion(id) {
    this.clearDecoration(id);
    this.suggestions.delete(id);
    this.updateCodeLenses();
  }

  async clearDecoration(id) {
    const suggestion = this.suggestions.get(id);
    if (suggestion) {
      const editor = await vscode.window.showTextDocument(suggestion.uri);
      editor.setDecorations(suggestion.addedDecorationType, []);
      editor.setDecorations(suggestion.mainDecorationType, []);
      editor.setDecorations(suggestion.removedDecorationType, []);
    }
  }

  updateCodeLenses() {
    this.onDidChangeCodeLensesEmitter.fire();
  }

  async decorateFinalLine(id, range) {
    const suggestion = this.suggestions.get(id);
    if (suggestion) {
      const editor = await vscode.window.showTextDocument(suggestion.uri);
      editor.setDecorations(suggestion.mainDecorationType, [range]);
    }
  }

  provideCodeLenses(document) {
    const codeLenses = [];
    this.suggestions.forEach((suggestion) => {
      if (suggestion.uri.toString() === document.uri.toString()) {
        const range = new vscode.Range(
          suggestion.position,
          suggestion.position
        );
        codeLenses.push(
          new vscode.CodeLens(range, {
            title: "Accept",
            command: "blackbox.acceptCode",
            arguments: [suggestion.id],
          })
        );
        codeLenses.push(
          new vscode.CodeLens(range, {
            title: "Reject",
            command: "blackbox.rejectCode",
            arguments: [suggestion.id],
          })
        );
        suggestion.showingDiff
          ? codeLenses.push(
              new vscode.CodeLens(range, {
                title: "Hide Diff",
                command: "blackbox.hideDiff",
                arguments: [suggestion.id],
              })
            )
          : codeLenses.push(
              new vscode.CodeLens(range, {
                title: "Show Diff",
                command: "extension.showDiff",
                arguments: [suggestion.id],
              })
            );

        //UNCOMMENT: to enable edit prompt function
        // codeLenses.push(
        //   new vscode.CodeLens(range, {
        //     title: "Edit Prompt",
        //     command: "blackbox.editPrompt",
        //     arguments: [suggestion.id],
        //   })
        // );
      }
    });
    return codeLenses;
  }
}

module.exports = {
  SuggestionManager,
};
