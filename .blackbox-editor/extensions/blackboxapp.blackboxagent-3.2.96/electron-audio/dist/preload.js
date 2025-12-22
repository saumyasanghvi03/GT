"use strict";
// electron-audio/src/preload.ts
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    terminateElectron: () => electron_1.ipcRenderer.send('terminate-electron'),
    sendCommand: (command) => electron_1.ipcRenderer.send('command', command),
    sendDataToMain: (data) => electron_1.ipcRenderer.send('data-from-renderer', data),
    receiveDataFromMain: (callback) => electron_1.ipcRenderer.on('data-from-main', (event, data) => {
        console.log("here");
        return callback(data);
    }),
    getParams: (propName) => {
        const arg = process.argv.find((arg) => arg.startsWith(propName));
        let value = '';
        if (arg) {
            value = arg.split('=')[1];
        }
        return value;
    },
});
