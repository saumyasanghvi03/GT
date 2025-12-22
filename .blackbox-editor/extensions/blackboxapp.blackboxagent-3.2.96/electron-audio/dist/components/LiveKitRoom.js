"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LiveKitRoom;
const React = __importStar(require("react"));
const components_react_1 = require("@livekit/components-react");
const livekit_client_1 = require("livekit-client");
function LiveKitRoom({ room, sendDataToMain, terminateElectron }) {
    // const [room] = React.useState(() => new Room({
    //   adaptiveStream: true,
    //   dynacast: true,
    // } as RoomOptions));
    const onConnectButtonClicked = React.useCallback(async () => {
        try {
            console.log('Connecting to LiveKit room with:', { room });
            // const url = serverUrl || process.env.LIVEKIT_SERVER_URL || "ws://localhost:7880";
            // const participantToken = token || process.env.LIVEKIT_TOKEN || "your-test-token";
            console.log('Attempting connection to:', room.name);
            // await room.connect(url, participantToken);
            console.log('Connected to room successfully');
            console.log('Enabling microphone...');
            await room.localParticipant.setMicrophoneEnabled(true);
            console.log('Microphone enabled successfully');
        }
        catch (error) {
            console.error('Failed to connect to LiveKit room:', error);
        }
    }, [room]);
    React.useEffect(() => {
        const onError = (error) => {
            console.error('Media device error:', error);
        };
        const onConnected = () => {
            console.log('Room connected event fired');
        };
        const onDisconnected = () => {
            console.log('Room disconnected event fired');
        };
        const onParticipantLeft = async (participantLeft) => {
            if ((participantLeft.identity.includes('voice_assistant_room_') || participantLeft.identity.includes('voice_assistant_user_')) ||
                (room.remoteParticipants.size === 1 && room.remoteParticipants.has(room.localParticipant.identity)) ||
                room.remoteParticipants.size === 0) {
                console.log('No participants remain, initiating app closure');
                try {
                    // First stop recording and disconnect
                    sendDataToMain({
                        type: 'stop-audio-recording',
                        reason: 'no-participants-remain'
                    });
                    await room.disconnect();
                    // Notify about recording stop
                    await window.postMessage({
                        type: "VoiceAssistantStopRecording",
                    });
                    // Signal exit intent
                    sendDataToMain({
                        type: 'exit-app',
                        reason: 'no-participants-remain'
                    });
                    // Use terminateElectron if available for more reliable closure
                    if (terminateElectron) {
                        console.log('Using terminateElectron for reliable app closure');
                        terminateElectron();
                    }
                    else {
                        console.log('Falling back to window.close()');
                        window.close();
                    }
                }
                catch (error) {
                    console.error('Error during app closure:', error);
                    // Force terminate as last resort
                    if (terminateElectron) {
                        terminateElectron();
                    }
                }
            }
        };
        room.on(livekit_client_1.RoomEvent.MediaDevicesError, onError);
        room.on(livekit_client_1.RoomEvent.Connected, onConnected);
        room.on(livekit_client_1.RoomEvent.Disconnected, onDisconnected);
        room.on(livekit_client_1.RoomEvent.ParticipantDisconnected, onParticipantLeft);
        return () => {
            room.off(livekit_client_1.RoomEvent.MediaDevicesError, onError);
            room.off(livekit_client_1.RoomEvent.Connected, onConnected);
            room.off(livekit_client_1.RoomEvent.Disconnected, onDisconnected);
            room.off(livekit_client_1.RoomEvent.ParticipantDisconnected, onParticipantLeft);
        };
    }, [room]);
    // Auto-connect when component mounts
    React.useEffect(() => {
        onConnectButtonClicked();
    }, [onConnectButtonClicked]);
    React.useEffect(() => {
        console.log('[LiveKitRoom] Component mounted');
        return () => {
            console.log('[LiveKitRoom] Component unmounted');
        };
    }, []);
    const [isConnected, setIsConnected] = React.useState(false);
    React.useEffect(() => {
        const onConnected = () => {
            console.log('[LiveKitRoom] Room connected');
            setIsConnected(true);
        };
        room.on(livekit_client_1.RoomEvent.Connected, onConnected);
        return () => {
            room.off(livekit_client_1.RoomEvent.Connected, onConnected);
        };
    }, [room]);
    return (React.createElement("main", { "data-lk-theme": "default", style: { height: '100%', width: '100%' } },
        React.createElement(components_react_1.RoomContext.Provider, { value: room },
            React.createElement("div", { className: "lk-room-container", style: { visibility: 'visible', opacity: 1 } },
                React.createElement(React.Fragment, null,
                    React.createElement(components_react_1.RoomAudioRenderer, null),
                    React.createElement("div", null, "Audio Room Active"))))));
}
