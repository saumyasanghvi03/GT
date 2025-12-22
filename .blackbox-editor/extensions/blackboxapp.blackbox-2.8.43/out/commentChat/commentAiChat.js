const vscode = require('vscode');
const path = require('path');
const fs = require('fs/promises');
const { askBlackbox } = require('./blackboxService');
const { CommentCodeLensProvider, InLineChatCodeLensProvider, SuggestionCodeLensProvider} = require('./CodeLensProvider');
let isCommentInitialized = false;
let userId = ''

let previousEditor0 = null;
let previousEditor1 = null;

module.exports.initCommentAiChat = async (context, shouldInit = false)  => {
    if(vscode.window.activeTextEditor){
      previousEditor1 = vscode.window.activeTextEditor;
    }
    vscode.window.onDidChangeActiveTextEditor(e=>{
    // console.log(previousEditor0, previousEditor1, e)
    previousEditor0 = previousEditor1
    previousEditor1 = e
    // console.log(e)
  })
  
  try{
    if (context.globalState.get("userId")){
      userId = context.globalState.get("userId")
    }
  }catch(e){
    console.log('Error inline get userId')
  }
  initCodeLens(context, shouldInit);

  vscode.workspace.onDidOpenTextDocument(() => {
    if (isCommentInitialized) {
      return;
    }
    
    commentControllerProvider(context);
  });

  vscode.commands.registerCommand('blackbox.comment.add', comment => threadCommentProvider(comment, context));
};

let isLoading = true;

function initCodeLens(context, shouldInit) {
  vscode.languages.registerCodeLensProvider('*', new InLineChatCodeLensProvider());
  if (true) {// dont show codelens
    vscode.languages.registerCodeLensProvider('*', new SuggestionCodeLensProvider());
    vscode.languages.registerCodeLensProvider('*', new CommentCodeLensProvider());
  }
  commentControllerProvider(context);
}

function commentControllerProvider(context, startThread) {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  isCommentInitialized = true;

  const range = getCurrentRange(editor);

  const commentController = vscode.comments.createCommentController('blackboxComment', 'Blackbox AI Chat');
  commentController.options = {
    prompt: 'Enter your follow up question',
    placeHolder: 'Ask Blackbox any coding question',
  };

  if (isLoading) {
    commentController.options.prompt = 'Loading';
  }

  commentController.commentingRangeProvider = {
    provideCommentingRanges: (document, token) => {
      const lineCount = document.lineCount;
      return [new vscode.Range(0, 0, lineCount - 1, 0)];
    },
  };

  context.subscriptions.push(commentController);

  if (!startThread) {
    return;
  }

  const initialCommand = getInitialComment();
  const thread = commentController.createCommentThread(editor.document.uri, range, [initialCommand]);
  thread.collapsibleState = vscode.CommentThreadCollapsibleState.Expanded;
}

async function threadCommentProvider(comment, context) {
  let code = previousEditor0.document.getText();
  let line = previousEditor0.selection.active.line;

  // code and line here

  code = code.split('\n')
  const start = line - 50 < line ? 0: line - 50;
  // const end = start + 50;

  const selectedLines = code.slice(start, line).join('\n').trim();


  const userPrompt = comment.text;
  const thread = comment.thread;

  // const activeLines = await getActiveLines(thread.range.start.line, thread.uri);

  const userComment = {
    body: new vscode.MarkdownString(userPrompt),
    author: { name: 'You' },
    message: userPrompt,
    mode: vscode.CommentMode.Preview,
  };

  const loaderIconUri = vscode.Uri.file(path.join(context.extensionPath, 'out/imgs/loading-icon.svg'));
  const loadingComment = {
    body: new vscode.MarkdownString('![Loading](' + loaderIconUri.path + '|"height=50,width=50")'),
    author: { name: 'Thinking ... ' },
    mode: vscode.CommentMode.Preview,
  };

  const currentChatHistory = thread.comments.map(comment => {
    const { body, message } = comment;
    const { name } = comment.author;

    const nameField = name != 'Blackbox AI' ? 'user' : 'blackbox';

    return { [nameField]: message };
  });

  currentChatHistory.push({ user: userPrompt });

  thread.comments = [...thread.comments, userComment, loadingComment];

  thread.canReply = false;
  const blackboxAnswer = await askBlackbox(context, userPrompt, currentChatHistory, selectedLines);

  thread.comments.pop();

  const blackboxComment = {
    body: new vscode.MarkdownString(blackboxAnswer),
    message: blackboxAnswer, 
    author: { name: 'Blackbox AI' },
    mode: vscode.CommentMode.Preview,
  };

  currentChatHistory.push({ blackbox: blackboxAnswer });

  thread.comments = [...thread.comments, blackboxComment];
  thread.canReply = true;
  selectionFct('inline chat request')
}

function getCurrentRange(editor) {
  const position = editor.selection.active;
  const { line, character } = position;
  const range = new vscode.Range(line, character, line, character);

  return range;
}

function getInitialComment() {
  const comment = {
    body: 'Ask some help for Blackbox AI',
    mode: 1,
    author: { name: 'Blackbox' },
  };

  return comment;
}

async function selectionFct(event) {
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
  }catch(e){
    console.log(e)
  }
}

async function getActiveLines(line, uri) {
  const fileContent = await fs.readFile(uri.fsPath, 'utf-8');
  const fileContentLines = fileContent.split('\n')
  const start = line - 25 < 0 ? 0: line - 25;
  const end = start + 50;

  const selected = fileContentLines.slice(start, end).join('\n').trim();
  return selected;
}