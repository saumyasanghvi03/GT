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
exports.AudioRenderer = void 0;
const react_1 = __importStar(require("react"));
const components_react_1 = require("@livekit/components-react");
const livekit_client_1 = require("livekit-client");
const AudioRenderer = ({ room, sendDataToMain }) => {
    // Monitor the same tracks as RoomAudioRenderer
    const tracks = (0, components_react_1.useTracks)([livekit_client_1.Track.Source.Microphone, livekit_client_1.Track.Source.ScreenShareAudio, livekit_client_1.Track.Source.Unknown], {
        updateOnlyOn: [],
        onlySubscribed: false,
    }).filter((ref) => !ref.participant.isLocal && ref.publication.kind === livekit_client_1.Track.Kind.Audio);
    (0, react_1.useEffect)(() => {
        // Monitor room connection state
        const handleConnectionStateChange = (state) => {
            sendDataToMain({
                type: 'connection-status',
                status: state,
                timestamp: new Date().toISOString()
            });
        };
        // Monitor track subscription failures
        const handleTrackSubscriptionFailed = (trackSid, participant, error) => {
            sendDataToMain({
                type: 'track-error',
                status: 'subscription-failed',
                trackId: trackSid,
                participantId: participant.identity,
                error: error || 'Unknown error',
                timestamp: new Date().toISOString()
            });
        };
        room.on(livekit_client_1.RoomEvent.ConnectionStateChanged, handleConnectionStateChange);
        room.on(livekit_client_1.RoomEvent.TrackSubscriptionFailed, handleTrackSubscriptionFailed);
        // Monitor track state changes
        tracks.forEach(trackRef => {
            const publication = trackRef.publication;
            if (publication) {
                publication.on('subscribed', () => {
                    sendDataToMain({
                        type: 'track-status',
                        status: 'track-subscribed',
                        trackId: publication.trackSid,
                        trackName: publication.trackName,
                        timestamp: new Date().toISOString()
                    });
                });
                publication.on('unsubscribed', () => {
                    sendDataToMain({
                        type: 'track-status',
                        status: 'track-unsubscribed',
                        trackId: publication.trackSid,
                        trackName: publication.trackName,
                        timestamp: new Date().toISOString()
                    });
                });
            }
        });
        return () => {
            room.off(livekit_client_1.RoomEvent.ConnectionStateChanged, handleConnectionStateChange);
            room.off(livekit_client_1.RoomEvent.TrackSubscriptionFailed, handleTrackSubscriptionFailed);
        };
    }, [room, tracks, sendDataToMain]);
    (0, react_1.useEffect)(() => {
        // Log tracks whenever they change
        sendDataToMain({
            type: 'track-status',
            status: 'tracks-updated',
            count: tracks.length,
            tracks: tracks.map(track => ({
                id: track.publication.trackSid,
                name: track.publication.trackName,
                kind: track.publication.kind,
                source: track.source,
                isSubscribed: track.publication.isSubscribed,
                participantId: track.participant.identity,
                participantName: track.participant.name,
                connectionQuality: track.participant.connectionQuality,
                isSpeaking: track.participant.isSpeaking
            }))
        });
        // Subscribe to all tracks
        tracks.forEach(track => {
            const publication = track.publication;
            if (publication) {
                publication.setSubscribed(true);
            }
        });
    }, [tracks, sendDataToMain]);
    (0, react_1.useEffect)(() => {
        // Send mount status
        sendDataToMain({
            type: 'audio-renderer-status',
            status: 'mounted',
            message: 'AudioRenderer component mounted successfully'
        });
        // Set up MutationObserver to detect when audio elements are added
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    // Check for audio elements
                    const audioElements = document.getElementsByTagName('audio');
                    if (audioElements.length > 0) {
                        // Monitor each audio element's state
                        Array.from(audioElements).forEach(audio => {
                            audio.addEventListener('play', () => {
                                sendDataToMain({
                                    type: 'audio-element-status',
                                    status: 'playing',
                                    elementId: audio.id,
                                    src: audio.src
                                });
                            });
                            audio.addEventListener('pause', () => {
                                sendDataToMain({
                                    type: 'audio-element-status',
                                    status: 'paused',
                                    elementId: audio.id,
                                    src: audio.src
                                });
                            });
                            // Add error listener
                            audio.addEventListener('error', (e) => {
                                const error = e;
                                sendDataToMain({
                                    type: 'audio-element-error',
                                    elementId: audio.id,
                                    src: audio.src,
                                    error: error.message || 'Unknown error',
                                    timestamp: new Date().toISOString()
                                });
                            });
                            // Add stalled and waiting events to detect buffering issues
                            audio.addEventListener('stalled', () => {
                                sendDataToMain({
                                    type: 'audio-element-status',
                                    status: 'stalled',
                                    elementId: audio.id,
                                    src: audio.src,
                                    timestamp: new Date().toISOString()
                                });
                            });
                            audio.addEventListener('waiting', () => {
                                sendDataToMain({
                                    type: 'audio-element-status',
                                    status: 'buffering',
                                    elementId: audio.id,
                                    src: audio.src,
                                    timestamp: new Date().toISOString()
                                });
                            });
                            // Add canplay event listener to detect when audio is ready
                            audio.addEventListener('canplay', () => {
                                sendDataToMain({
                                    type: 'audio-element-status',
                                    status: 'ready',
                                    elementId: audio.id,
                                    src: audio.src
                                });
                            });
                        });
                        sendDataToMain({
                            type: 'audio-renderer-status',
                            status: 'audio-elements-check',
                            count: audioElements.length,
                            message: `Found ${audioElements.length} audio elements in the DOM`,
                            elements: Array.from(audioElements).map(el => ({
                                id: el.id,
                                src: el.src,
                                readyState: el.readyState,
                                paused: el.paused,
                                muted: el.muted,
                                volume: el.volume
                            }))
                        });
                        observer.disconnect(); // Stop observing once we find the elements
                    }
                }
            });
        });
        // Start observing the document with the configured parameters
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        // Cleanup function
        return () => {
            observer.disconnect();
            sendDataToMain({
                type: 'audio-renderer-status',
                status: 'unmounted',
                message: 'AudioRenderer component unmounted'
            });
        };
    }, [sendDataToMain]);
    return (react_1.default.createElement(components_react_1.RoomContext.Provider, { value: room },
        react_1.default.createElement("div", { style: { display: 'none' } },
            react_1.default.createElement(components_react_1.RoomAudioRenderer, { volume: 1.0, muted: false }))));
};
exports.AudioRenderer = AudioRenderer;
