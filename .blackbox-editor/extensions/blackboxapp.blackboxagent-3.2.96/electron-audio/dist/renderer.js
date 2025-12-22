"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const LiveKitRoom_1 = __importDefault(require("./components/LiveKitRoom"));
const audioChatManager_1 = require("./audioChatManager");
const liveKitAudioManager_1 = require("./liveKitAudioManager");
window.addEventListener('DOMContentLoaded', async () => {
    const { sendCommand, sendDataToMain, receiveDataFromMain, getParams, terminateElectron } = window.electronAPI;
    try {
        const userId = getParams('userId');
        console.log("UserId in Electron is", userId);
        const audioManager = new audioChatManager_1.AudioChatManager(userId, sendDataToMain);
        const livekitAudioManager = new liveKitAudioManager_1.LiveKitAudioChatManager(sendDataToMain);
        receiveDataFromMain(async (args) => {
            console.log("From main ", args.type);
            switch (args.type) {
                case 'audio-initialize': {
                    //audioManager.initialize();
                    break;
                }
                case 'audio-create-room': {
                    console.log("audio-create-room", args);
                    audioManager.audioCreateRoom(args.roomId);
                    break;
                }
                case 'audio-join-room': {
                    audioManager.audioJoinRoom(args.roomId);
                    break;
                }
                case 'audio-leave-room': {
                    audioManager.audioLeaveRoom(args.roomId);
                    break;
                }
                case 'audio-unmute': {
                    audioManager.audioToggleMute();
                    break;
                }
                case 'audio-mute': {
                    audioManager.audioToggleMute();
                    break;
                }
                case 'connect-livekit': {
                    console.log("[RENDERER] connect-livekit", args);
                    try {
                        console.log("[RENDERER] connect-livekit", args);
                        const AudioRoom = await livekitAudioManager.connectAudioRoom(args.serverUrl, args.participantToken);
                        console.log("[RENDERER] Attempting to mount LiveKitRoom");
                        const rootElement = document.getElementById('react-root');
                        if (!rootElement) {
                            throw new Error('Could not find root element');
                        }
                        console.log("[RENDERER] Found root element, clearing children");
                        while (rootElement.firstChild) {
                            rootElement.removeChild(rootElement.firstChild);
                        }
                        try {
                            console.log("[RENDERER] Creating React root");
                            const root = (0, client_1.createRoot)(rootElement);
                            console.log("[RENDERER] Rendering LiveKitRoom with room", AudioRoom.name);
                            root.render(react_1.default.createElement(react_1.default.StrictMode, null, react_1.default.createElement(LiveKitRoom_1.default, {
                                room: AudioRoom,
                                sendDataToMain: sendDataToMain,
                                terminateElectron: terminateElectron
                            })));
                            // Verify mount
                            setTimeout(() => {
                                const lkContainer = document.querySelector('.lk-room-container');
                                console.log("[RENDERER] LiveKitRoom container present:", !!lkContainer);
                                if (lkContainer) {
                                    console.log("[RENDERER] Container styles:", window.getComputedStyle(lkContainer));
                                }
                            }, 100);
                        }
                        catch (mountError) {
                            console.error("[RENDERER] Error mounting React component:", mountError);
                            throw mountError;
                        }
                        console.log("[RENDERER] LiveKitRoom mounted successfully");
                        // Play test sound to verify audio output
                        const testSound = document.getElementById('test-sound');
                        if (testSound) {
                            testSound.volume = 0.5; // Set to 50% volume
                            // testSound.play()
                            //   .then(() => console.log("[RENDERER] Test sound played successfully"))
                            //   .catch(err => console.error("[RENDERER] Error playing test sound:", err));
                        }
                        // }
                    }
                    catch (error) {
                        console.error("[RENDERER] Error connecting to LiveKit room:", error);
                        sendDataToMain({ type: 'error', error: error });
                    }
                    break;
                }
                case 'start-audio-recording': {
                    console.log("start-audio-recording", args);
                    await livekitAudioManager.startRecording();
                    break;
                }
                case 'send-text': {
                    console.log("send-text", args);
                    await livekitAudioManager.sendText(args.text);
                    break;
                }
                case 'stop-audio-recording': {
                    console.log("stop-audio-recording");
                    await livekitAudioManager.stopRecording();
                    break;
                }
            }
        });
    }
    catch (err) {
        console.error('[RENDERER] Error Occured:', err);
        sendDataToMain({ type: 'error', error: err });
    }
});
