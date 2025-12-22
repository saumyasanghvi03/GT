"use strict";
//audioChatManager.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioChatManager = void 0;
const socket_io_client_1 = require("socket.io-client");
const audioConfiguration = {
    iceTransportPolicy: 'all',
    iceServers: [
        {
            urls: ['stun:bn-turn1.xirsys.com'],
        },
        {
            username: 'MvoeAGyQkHfadBQK3FYv4DVKig4Njm3MgwbfwHAP111_l3xfDHcWqQX969ZkI0lDAAAAAGQr_wlhbnVyYWc=',
            credential: '5e5a5a28-d2d5-11ed-b3dc-0242ac140004',
            urls: [
                'turn:bn-turn1.xirsys.com:80?transport=udp',
                'turn:bn-turn1.xirsys.com:3478?transport=udp',
                'turn:bn-turn1.xirsys.com:80?transport=tcp',
                'turn:bn-turn1.xirsys.com:3478?transport=tcp',
                'turns:bn-turn1.xirsys.com:443?transport=tcp',
                'turns:bn-turn1.xirsys.com:5349?transport=tcp',
            ],
        },
    ],
};
function log(...args) {
    console.log('[AudioChatManager]', ...args);
}
//const SOCKET_SERVER_URL = 'https://websocket-messaging-2.onrender.com';
const SOCKET_SERVER_URL = 'https://websocket-messaging-2.onrender.com';
class AudioChatManager {
    constructor(userId, sendDataToMain) {
        this.serverUrl = SOCKET_SERVER_URL;
        this.socket = null;
        this.audioRoomId = null;
        this.audioPeerConnections = {};
        this.audioLocalStream = null;
        this.isAudioMuted = false;
        this.userId = userId;
        this.sendDataToMain = sendDataToMain;
    }
    initialize() {
        this.initializeSocket();
    }
    initializeSocket() {
        if (this.socket) {
            return;
        }
        this.socket = (0, socket_io_client_1.io)(this.serverUrl);
        this.socket.on('connect', () => {
            log('Socket connected:', this.socket?.id);
        });
        this.registerSocketEvents();
    }
    async createPeerConnection(targetSocketId, initiator, remoteUserId) {
        if (this.audioPeerConnections[targetSocketId]) {
            return this.audioPeerConnections[targetSocketId];
        }
        const pc = new RTCPeerConnection(audioConfiguration);
        this.audioPeerConnections[targetSocketId] = pc;
        pc.onicecandidate = (evt) => {
            if (!this.socket) {
                return;
            }
            if (evt.candidate) {
                this.socket.emit('audio-send-ice-candidate', evt.candidate, this.audioRoomId, targetSocketId, remoteUserId);
            }
        };
        pc.ontrack = (evt) => {
            const [remoteStream] = evt.streams;
            if (!remoteStream)
                return;
            const audioEl = new Audio();
            audioEl.srcObject = remoteStream;
            audioEl
                .play()
                .then(() => {
                log('Playing remote audio for user:', remoteUserId);
            })
                .catch((err) => {
                log('Audio autoplay blocked or error playing remote stream:', err);
            });
        };
        if (this.audioLocalStream) {
            this.audioLocalStream.getTracks().forEach((track) => pc.addTrack(track, this.audioLocalStream));
        }
        if (initiator) {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            if (this.socket && this.audioRoomId) {
                this.socket.emit('audio-send-offer', offer, this.audioRoomId, targetSocketId, remoteUserId);
            }
        }
        return pc;
    }
    registerSocketEvents() {
        if (!this.socket) {
            return;
        }
        this.socket.on('audio-offer', async (offer, fromSocketId, remoteUserId) => {
            log('Received audio-offer from:', fromSocketId);
            const pc = await this.createPeerConnection(fromSocketId, false, remoteUserId);
            await pc.setRemoteDescription(offer);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            this.socket.emit('audio-send-answer', answer, this.audioRoomId, fromSocketId, remoteUserId);
        });
        this.socket.on('audio-answer', async (answer, fromSocketId, remoteUserId) => {
            log('Received audio-answer from:', fromSocketId);
            const pc = this.audioPeerConnections[fromSocketId];
            if (pc) {
                await pc.setRemoteDescription(answer);
            }
        });
        this.socket.on('audio-ice-candidate', async (candidate, fromSocketId, remoteUserId) => {
            log('Received audio-ice-candidate from:', fromSocketId);
            const pc = this.audioPeerConnections[fromSocketId];
            if (pc) {
                await pc.addIceCandidate(candidate);
            }
        });
        this.socket.on('audio-user-joined', (data) => {
            log('audio-user-joined =>', data);
            this.sendCallback('audio-user-joined', data);
        });
        this.socket.on('audio-user-left', (data) => {
            const { socketId } = data;
            log('audio-user-left =>', data);
            if (this.audioPeerConnections[socketId]) {
                this.audioPeerConnections[socketId].close();
                delete this.audioPeerConnections[socketId];
            }
            this.sendCallback('audio-user-left', data);
        });
        this.socket.on('audio-room-created', (roomId) => {
            log('audio-room-created =>', roomId);
            this.audioRoomId = roomId;
            this.sendCallback('audio-room-created', this.audioRoomId);
        });
        this.socket.on('audio-room-joined', (data) => {
            log('audio-room-joined =>', data.roomId);
            this.audioRoomId = data.roomId;
            this.sendCallback('audio-room-joined', this.audioRoomId);
        });
        this.socket.on('audio-participants', async (participants) => {
            log('audio-participants =>', participants);
            for (const p of participants) {
                await this.createPeerConnection(p.socketId, true, p.userId);
            }
            this.sendCallback('audio-participants', this.audioRoomId);
        });
        this.socket.on('audio-left-room', (data) => {
            log('audio-left-room', data.roomId);
            this.sendCallback('audio-left-room', data);
        });
        /*this.socket.on('audio-call-notification', (data: any) => {
            log('audio-call-notification', data.roomId);
            this.sendCallback('audio-call-notification', data);
        })
        this.socket.on('audio-call-notification-all', (data: any) => {
          log('audio-call-notification-all', data.roomId);
          this.sendCallback('audio-call-notification-all', data);
        })
        this.socket.on('audio-call-disconnected', (data: any) => {
            log('audio-call-disconnected', data.roomId)
            this.sendCallback('audio-call-disconnected', data);
        })*/
    }
    async initializeAudio() {
        if (!navigator?.mediaDevices?.getUserMedia) {
            throw new Error('Audio capture not supported in this environment.');
        }
        this.audioLocalStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        log('Local audio stream initialized.');
    }
    async audioCreateRoom(roomId) {
        if (!this.socketInitialized()) {
            return;
        }
        await this.initializeAudio();
        this.socket?.emit('audio-create-room', { roomId, userId: this.getUserId() });
    }
    async audioJoinRoom(roomId) {
        if (!this.socketInitialized()) {
            return;
        }
        if (!roomId.trim()) {
            throw new Error('Room ID is required.');
        }
        await this.initializeAudio();
        this.socket?.emit('audio-join-room', { roomIdToJoin: roomId, userId: this.getUserId() });
    }
    audioLeaveRoom(roomId) {
        if (!this.socket) {
            return;
        }
        if (this.audioLocalStream) {
            this.audioLocalStream.getTracks().forEach((track) => track.stop());
            this.audioLocalStream = null;
        }
        Object.values(this.audioPeerConnections).forEach((pc) => pc.close());
        this.audioPeerConnections = {};
        if (roomId) {
            this.socket.emit('audio-leave-room', roomId);
            this.audioRoomId = null;
            log('Left audio room.');
        }
    }
    audioToggleMute() {
        if (!this.audioLocalStream)
            return;
        const track = this.audioLocalStream.getAudioTracks()[0];
        track.enabled = !track.enabled;
        this.isAudioMuted = !track.enabled;
        log('audioToggleMute => now muted?', this.isAudioMuted);
    }
    getUserId() {
        return this.userId;
    }
    sendCallback(eventType, data) {
        const param = data ? { ...data } : {};
        param.type = eventType;
        this.sendDataToMain(param);
    }
    ;
    socketInitialized() {
        if (!this.socket) {
            console.error('Socket not initialized');
            return false;
        }
        return true;
    }
    ;
    dispose() {
        if (!this.socket) {
            return;
        }
        this.socket.off('audio-offer');
        this.socket.off('audio-answer');
        this.socket.off('audio-ice-candidate');
        this.socket.off('audio-user-joined');
        this.socket.off('audio-user-left');
        this.socket.off('audio-room-created');
        this.socket.off('audio-room-joined');
        this.socket.off('audio-participants');
        this.socket.off('audio-left-room');
        /*this.socket.off('audio-call-notification');
        this.socket.off('audio-call-notification-all')
        this.socket.off('audio-call-disconnected');*/
        if (this.socket.connected) {
            this.socket.disconnect();
        }
        log('AudioChatManager disposed, socket disconnected.');
    }
}
exports.AudioChatManager = AudioChatManager;
