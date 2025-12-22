"use strict";
// electron-audio/src/main.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ws_1 = __importDefault(require("ws"));
function internalShowMessage(type, ...args) {
    try {
        if (typeof console[type] === "function") {
            console[type]("[Electron Main]", ...args);
        }
        else {
            console.log("[Electron Main]", ...args);
        }
    }
    catch (error) {
    }
}
const logger = {
    log(...args) {
        internalShowMessage("log", ...args);
    },
    info(...args) {
        internalShowMessage("info", ...args);
    },
    warn(...args) {
        internalShowMessage("warn", ...args);
    },
    error(...args) {
        internalShowMessage("error", ...args);
    },
    debug(...args) {
        internalShowMessage("debug", ...args);
    },
};
process?.stdout?.on('error', (err) => {
    if (err) {
        if (err.code === 'EPIPE') {
        }
        else {
            throw err;
        }
    }
});
let shouldLog = false;
let mainWindow = null;
const args = process.argv.slice(2);
let extensionWsPort = 12345; // must match whatever port extensionHelper used
let userId = '';
args.forEach(arg => {
    if (arg.startsWith('--port=')) {
        extensionWsPort = parseInt(arg.split('=')[1], 10);
    }
    if (arg.startsWith('--userId=')) {
        userId = arg.split('=')[1];
    }
});
logger.log(`[Electron Main] Connecting to port: ${extensionWsPort}`);
let ws = null;
const wsUrl = `ws://127.0.0.1:${extensionWsPort}`;
function createWindow() {
    const preloadPath = path_1.default.join(__dirname, 'preload.js');
    if (!fs_1.default.existsSync(preloadPath)) {
        throw new Error(`preload.js not found at path: ${preloadPath}`);
    }
    //await clearAudioPermission();
    mainWindow = new electron_1.BrowserWindow({
        width: 400,
        height: 300,
        show: false, // Show window by default
        webPreferences: {
            nodeIntegration: true, // Enhanced security
            contextIsolation: true, // Set to true and use preload scripts for better security
            preload: path_1.default.join(__dirname, 'preload.js'), // Preload script
            additionalArguments: [`userId=${userId}`],
        },
    });
    mainWindow.loadFile(path_1.default.join(__dirname, 'index.html'));
    // Open DevTools
    // mainWindow.webContents.openDevTools();
    // // Show window when content is loaded
    // mainWindow.webContents.on('did-finish-load', () => {
    //   mainWindow?.show();
    //   mainWindow?.focus();
    // });
    // Prevent the window from being closed; hide instead
    mainWindow.on('close', (event) => {
        //event.preventDefault();
        //mainWindow?.hide();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
function connectToExtensionWebSocket() {
    try {
        ws = new ws_1.default(wsUrl);
        ws.on('open', () => {
            shouldLog = true;
            logger.log('[Electron Main] Connected to Extension WebSocket server.');
            // Example: send a message
            ws?.send(JSON.stringify({ type: 'audio-pluggin-initialized' }));
        });
        ws.on('message', (dataBuffer) => {
            logger.log('[Electron Main] Received from Extension:', dataBuffer.toString());
            let data = null;
            try {
                data = JSON.parse(dataBuffer.toString());
                logger.log('[Electron Main] Received from Extension with type:', data.type);
                if (data.type === 'exit-app') {
                    closeApp();
                }
                else {
                    logger.log('[Electron Main] Received from Extension inside else:', dataBuffer.toString());
                    sendDataToElectronWeb(data);
                }
            }
            catch (err) {
                logger.error('Failed to parse WebSocket message as JSON:', err);
            }
        });
        ws.on('error', (err) => {
            logger.error('[Electron Main] WS Error:', err);
        });
        ws.on('close', () => {
            logger.log('[Electron Main] WebSocket closed.');
            shouldLog = false;
        });
    }
    catch (err) {
        logger.error("[Electron Main] Error in socket ", err);
    }
}
electron_1.app.whenReady().then(() => {
    createWindow();
    connectToExtensionWebSocket();
    logger.log("Window Created");
    // HIDE DOCK ICON ON MAC
    if (process.platform === 'darwin') {
        try {
            if (electron_1.app.dock) {
                electron_1.app.dock?.hide();
            }
            logger.error("doc is hidden in MAC");
        }
        catch (error) {
            logger.error("Error in hiding doc in MAC");
        }
    }
    // Notify the parent process (VSCode extension) that Electron is ready
    sendDataToExtension('ready');
});
// Prevent Electron from quitting when all windows are closed
electron_1.app.on('window-all-closed', () => {
    //closeApp();
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
    // else {
    //   mainWindow.show();
    // }
});
//command from extension to main.ts
/*ipcMain.on('command', (event, args: { command: string; payload?: any }) => {
  logger.log('[MAIN] Received command from WebView:', args.command, args.payload);
  sendDataToElectronWeb(args.command, args.payload);
});*/
/*process.on('message', (msg: any) => {
  logger.log('[MAIN] Received message from VSCode extension process:', msg);
  sendDataToElectronWeb(msg.type, msg)
});*/
// data from electron web to main.ts
electron_1.ipcMain.on('data-from-renderer', (event, data) => {
    logger.log('[MAIN] Received data from Renderer:', data);
    getDataFromElectronWeb(data);
});
const sendDataToExtension = (type, data) => {
    if (ws && ws.readyState === ws.OPEN) {
        const params = data ? { ...data } : {};
        params.type = type;
        ws.send(JSON.stringify(params));
    }
    else {
        logger.log('[MAIN] WebSocket not yet open');
    }
    /*if (process.send) {
      const params = data ? {...data} : {};
      params.type = type;
      process.send(params);
    }*/
};
const sendDataToElectronWeb = (data) => {
    if (mainWindow) {
        // mainWindow.webContents.openDevTools(); 
        mainWindow.webContents.send('data-from-main', data);
    }
};
const getDataFromElectronWeb = (data) => {
    sendDataToExtension(data.type, data);
};
const closeApp = () => {
    if (ws) {
        ws.close();
    }
    if (electron_1.app) {
        electron_1.app.quit();
    }
};
/*const clearAudioPermission = () => {
  const currentSession = session.defaultSession;
  currentSession.clearStorageData({
      storages: ["cookies", "filesystem", "indexdb", "localstorage", "shadercache", "websql", "serviceworkers", "cachestorage"]
  }).then(() => {
      logger.log('Session data cleared.');
  }).catch(err => {
      logger.error('Error clearing session data:', err);
  });
}*/
