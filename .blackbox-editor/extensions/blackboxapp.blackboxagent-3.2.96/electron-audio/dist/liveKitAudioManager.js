"use strict";
//audioChatManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveKitAudioChatManager = void 0;
const livekit_client_1 = require("livekit-client");
function log(...args) {
    console.log('[LiveKitAudioChatManager]', ...args);
}
class LiveKitAudioChatManager {
    constructor(sendDataToMain) {
        this.audioRoom = null;
        this.audioLocalStream = null;
        this.sendDataToMain = sendDataToMain;
    }
    async connectAudioRoom(wsServerUrl, participantToken) {
        console.log('Starting to connect room');
        this.sendDataToMain({ "message": 'Test message to main: Starting to connect room' });
        this.audioRoom = new livekit_client_1.Room();
        await this.audioRoom.connect(wsServerUrl, participantToken, { autoSubscribe: true });
        this.sendDataToMain({ "room-details": this.audioRoom.name, "localparticipantKind": this.audioRoom.localParticipant.kind });
        this.audioRoom.on("trackSubscribed", (track, publication) => {
            this.sendDataToMain({ type: 'room-event-track-subscribed', "publication": publication.trackName, "isLocal": publication.isLocal, "source": publication.source });
        });
        this.audioRoom.on("trackPublished", (publication, participant) => {
            this.sendDataToMain({ type: 'room-event-track-subscribed', "publication": publication.trackName, "isLocal": publication.isLocal, "source": publication.source });
        });
        console.log('Finished to connect room', this.audioRoom);
        return this.audioRoom;
    }
    //   private async initializeAudio() {
    //     if (!navigator?.mediaDevices?.getUserMedia) {
    //       throw new Error('Audio capture not supported in this environment.')
    //     }
    //     this.audioLocalStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    //     log('Local audio stream initialized.')
    //   }
    async startRecording() {
        try {
            log('Starting audio recording...');
            this.sendDataToMain({ type: 'recording-status', status: 'starting' });
            if (!this.audioRoom) {
                throw new Error('Audio room not connected');
            }
            // Get available audio devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevices = devices.filter(d => d.kind === "audioinput");
            if (audioDevices.length === 0) {
                throw new Error('No audio input devices found');
            }
        }
        catch (error) {
            log('Error starting audio recording:', error);
            this.sendDataToMain({
                type: 'recording-status',
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    async sendText(text) {
        if (this.audioRoom) {
            this.audioRoom?.localParticipant.sendText(text, { topic: "lk.chat" });
        }
    }
    async stopRecording() {
        try {
            log('Stopping audio recording...');
            this.sendDataToMain({ type: 'recording-status', status: 'stopping' });
            if (!this.audioRoom) {
                throw new Error('Audio room not connected');
            }
            await this.audioRoom?.localParticipant.setMicrophoneEnabled(false);
            // Clean up any local audio stream if it exists
            if (this.audioLocalStream) {
                this.audioLocalStream.getTracks().forEach(track => track.stop());
                this.audioLocalStream = null;
            }
            log('Audio recording stopped successfully');
            this.sendDataToMain({ type: 'recording-status', status: 'stopped' });
        }
        catch (error) {
            log('Error stopping audio recording:', error);
            this.sendDataToMain({
                type: 'recording-status',
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
}
exports.LiveKitAudioChatManager = LiveKitAudioChatManager;
