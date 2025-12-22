//@ts-nocheck
/* eslint-disable */
import * as path from "path";
import * as crypto from 'crypto';
import * as vscode from "vscode";
import { TestCodelensProvider, BuildCodeLensProvider, GoCodeoAskCodeLensProvider } from "./CodelensProvider";
import { ComponentsUnderTestDataProvider } from "./Sidebar";
import { getLanguageType, getImportedContent } from "./CodeParser";
import { openWebview } from "./WebViewPanel";
import { StorageService, getStoreKey } from "./StorageService";
import { AICodeCompletionProvider } from "./AICodeCompletionProvider";
import { EmbeddingService } from './embeddingService';
import {
  AUTH_TOKEN,
  CMD_GET_STARTED,
  CMD_SIGNIN,
  SIGNIN_GOOGLE_URL,
  BASE_URL,
  PRICING_PAGE
} from "./Constants";
import {
  authenticateUser,
  getUserProfile,
  getUserUsage,
  updateUserProfile,
  getIPAddress,
  getServiceKeys,
  parseJwt,
  getUniqueId
} from "./CommonServices";
import {
  Analytics,
  getSystemDetails,
  getUserTrackPoints,
} from "./MixpanelAnalytics";
import * as AnalyticsEvents from "./AnalyticsConstants";
import { encrypt, decrypt } from "./EncryptDecrypt";
import { rootDirCreation } from "./util";
import { handleGitInitAndPush, handleGitInit } from './Integrations/github_integration/github_init';

// Interfaces
interface SessionInfo {
  sessionId: string;
  dateCreated: string;
}

interface AccountProfile {
  uid: string;
  extensionVersion: string;
}

interface ChatHistory {
  sessionId: string;
  chatHistory: Array<{
    question: string;
    answer: string;
    timestamp: string;
    context: string[];
  }>;
  title: string;
}

interface BuildHistory {
  sessionId: string;
  buildHistory: Array<{
    input: string;
    output: string;
    timestamp: string;
  }>;
  title: string;
  rootDirectory: string;
}

// Global state
let sidebarProvider: ComponentsUnderTestDataProvider;
let isAutocompleteActive = false;

// Authentication and User Setup Functions
async function initializeAuthentication(context: vscode.ExtensionContext, localStore: StorageService) {
  const storedAuthToken = getStoreKey(AUTH_TOKEN);
  const encryptedServiceKeys = await getServiceKeys(storedAuthToken);
  const currentUserProfile = await getUserProfile(storedAuthToken);

  let mixpanelKey = "";
  let relaceKey = "";

  try {
    const decryptedData = decrypt(currentUserProfile?.id, encryptedServiceKeys);
    const keys_data_obj = JSON.parse(decryptedData);
    mixpanelKey = keys_data_obj.MIXPANEL_KEY;
    relaceKey = keys_data_obj.RELACE_KEY;
  } catch (error) {
    console.error("Failed to decrypt service keys:", error);
  }

  return {
    mixpanelKey: mixpanelKey || "e52a7a46e52d5bd3ee2dce5fa0a4993f",
    relaceKey,
    storedAuthToken
  };
}

async function setupUserProfile(context: vscode.ExtensionContext, globalStore: StorageService) {
  const systemInfo = getSystemDetails(context);
  const { is_new = false, uid = null } = globalStore.getInstallationId() || {};

  let user_ip_address = globalStore.getValue();
  if (!user_ip_address) {
    user_ip_address = await getIPAddress();
    globalStore.setValue("ipAddress", user_ip_address);
  }

  systemInfo.uid = uid;
  
  return {
    systemInfo,
    is_new,
    uid,
    user_ip_address
  };
}

// Service Initialization Functions
function initializeServices(context: vscode.ExtensionContext, mixpanelKey: string) {
  const localConfig = vscode.workspace.getConfiguration();
  const localStore = new StorageService(localConfig);
  const globalStore = new StorageService(context.globalState, "global");
  const analytics = new Analytics(context, mixpanelKey);

  return {
    localStore,
    globalStore,
    analytics
  };
}

// UI Initialization Functions 
function initializeUI(context: vscode.ExtensionContext) {
  registerEmptyLineDecorator(context);
  registerSelectionHoverProvider(context);

  const statusBarIcon = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarIcon.text = "GoCodeo";
  statusBarIcon.command = CMD_SIGNIN;
  statusBarIcon.show();

  return statusBarIcon;
}

function registerEmptyLineDecorator(context: vscode.ExtensionContext) {
  const emptyLineDecorationType = vscode.window.createTextEditorDecorationType({});

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((event) => {
      const editor = event.textEditor;
      if (!editor) return;

      const selection = editor.selection;
      editor.setDecorations(emptyLineDecorationType, []);

      if (isAutocompleteActive) return;
      if (!selection.isEmpty) return;

      const cursorPosition = selection.start.character;
      if (cursorPosition !== 0) return;

      const line = editor.document.lineAt(selection.start.line);
      const commandKey = process.platform === "darwin" ? "Cmd" : "Ctrl";

      if (line.isEmptyOrWhitespace) {
        const decorationOptions = [{
          range: line.range,
          renderOptions: {
            after: {
              contentText: `GoCodeo-BUILD: ${commandKey}+Shift+K | GoCodeo-ASK: ${commandKey}+Shift+L`,
              color: new vscode.ThemeColor("editorLineNumber.foreground"),
              margin: "0 0 0 10px",
              fontStyle: "italic",
              opacity: "1.5",
            },
          },
        }];
        editor.setDecorations(emptyLineDecorationType, decorationOptions);
      }
    })
  );
}

function registerSelectionHoverProvider(context: vscode.ExtensionContext) {
  const decorationType = vscode.window.createTextEditorDecorationType({});
  let debounceTimer: NodeJS.Timeout | null = null;

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection((event) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        const editor = event.textEditor;
        if (!editor) return;

        const selection = editor.selection;
        if (selection.isEmpty) {
          editor.setDecorations(decorationType, []);
          return;
        }

        const lineNumber = selection.end.line;
        const lineEndPosition = editor.document.lineAt(lineNumber).range.end;
        const decorationRange = new vscode.Range(lineEndPosition, lineEndPosition);
        const commandKey = process.platform === "darwin" ? "Cmd" : "Ctrl";

        const decorationOptions = [{
          range: decorationRange,
          renderOptions: {
            after: {
              contentText: `Ask GoCodeo (${commandKey}+Shift+L) | Edit (${commandKey}+Shift+E)`,
              backgroundColor: new vscode.ThemeColor("editorWidget.background"),
              color: new vscode.ThemeColor("editorWidget.foreground"),
              margin: "0 20px 0 60px",
              border: "1px solid",
              borderColor: new vscode.ThemeColor("editorWidget.border"),
              borderRadius: "3px",
              padding: "2px 8px",
            },
          },
        }];

        editor.setDecorations(decorationType, decorationOptions);
      }, 200);
    })
  );
}

// Main activate function
export async function activate(context: vscode.ExtensionContext) {
  // Initialize services
  const { mixpanelKey, relaceKey, storedAuthToken } = await initializeAuthentication(context, new StorageService(vscode.workspace.getConfiguration()));
  const { localStore, globalStore, analytics } = initializeServices(context, mixpanelKey);
  
  // Setup user profile
  const { systemInfo, is_new, uid, user_ip_address } = await setupUserProfile(context, globalStore);

  // Initialize UI components
  const statusBarIcon = initializeUI(context);

  // Initialize providers
  const highlightedCodes = [];
  sidebarProvider = new ComponentsUnderTestDataProvider(highlightedCodes);

  // Register providers
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("gocodeo-sidebar", sidebarProvider)
  );

  // Register code lens providers
  const provider = new TestCodelensProvider(highlightedCodes);
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider({ scheme: "file" }, provider),
    vscode.languages.registerCodeLensProvider({ scheme: "file" }, new GoCodeoAskCodeLensProvider(highlightedCodes)),
    vscode.languages.registerCodeLensProvider({ scheme: "file" }, new BuildCodeLensProvider(highlightedCodes))
  );

  // Initialize completion provider
  const supportedLanguages = ["javascript", "typescript", "python", "java", "csharp", "typescriptreact"];
  const completionProvider = new AICodeCompletionProvider();
  
  context.subscriptions.push(
    vscode.languages.registerInlineCompletionItemProvider(
      supportedLanguages.map(lang => ({ scheme: "file", language: lang })),
      completionProvider
    )
  );

  // Initialize embedding service
  const embeddingService = new EmbeddingService(relaceKey, context);

  // Register commands
  registerCommands(context, {
    localStore,
    globalStore,
    analytics,
    systemInfo,
    user_ip_address,
    embeddingService,
    highlightedCodes
  });

  // Focus sidebar
  vscode.commands.executeCommand("gocodeo-sidebar.focus");

  // Show walkthrough for new users
  const config = vscode.workspace.getConfiguration('gocodeo');
  const hasShownWalkthrough = config.get<boolean>('hasShownWalkthrough', false);
  
  if (!hasShownWalkthrough) {
    try {
      const extension = vscode.extensions.getExtension('GoCodeo.gocodeo');
      if (extension) {
        await vscode.commands.executeCommand('workbench.action.openWalkthrough', {
          category: 'GoCodeo.gocodeo#gocodeo',
          step: 'launch',
          viewColumn: vscode.ViewColumn.One
        });
        await config.update('hasShownWalkthrough', true, vscode.ConfigurationTarget.Global);
      }
    } catch (error) {
      console.error("Error showing walkthrough:", error);
    }
  }
}

// Helper function to register all commands
function registerCommands(context: vscode.ExtensionContext, services: any) {
  // Register all the command handlers here
  // This keeps the activate function clean while maintaining all command registrations in one place
  
  const commands = [
    {
      command: 'gocodeo.watchTutorial',
      handler: () => {
        const tutorialUrl = vscode.Uri.parse("https://youtu.be/-H2a7HRELy8?si=tG1wk2BblfESuUBn");
        vscode.env.openExternal(tutorialUrl);
      }
    },
    // Add other commands here
  ];

  commands.forEach(({ command, handler }) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, handler)
    );
  });
}