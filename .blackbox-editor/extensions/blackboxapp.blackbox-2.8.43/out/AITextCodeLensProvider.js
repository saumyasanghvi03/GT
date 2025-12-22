const vscode = require("vscode");
const { SuggestionManager } = require("./SuggestionManager");

class AITextCodeLensProvider {
  constructor(suggestionManager) {
    this.suggestionManager = suggestionManager;
    this.onDidChangeCodeLenses = this.suggestionManager.onDidChangeCodeLenses;
  }

  provideCodeLenses(document, token) {
    return this.suggestionManager.provideCodeLenses(document);
  }
}

module.exports = {
  AITextCodeLensProvider,
};
