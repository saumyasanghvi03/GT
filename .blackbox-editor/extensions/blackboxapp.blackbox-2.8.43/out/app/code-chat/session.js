const uuidv4 = require('uuid').v4;

class SessionManager {
    constructor() {
        this.sessionId = null;
        this.expirationTime = null;
        this.SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
        this.createSession();
    }

    createSession() {
        this.sessionId = this.generateSessionId();
        this.expirationTime = Date.now() + this.SESSION_DURATION;
    }

    generateSessionId() {
        return uuidv4();
    }

    getSessionId() {
        if (this.isSessionExpired()) {
            this.createSession();
        }
        return this.sessionId;
    }

    isSessionExpired() {
        return this.expirationTime !== null && Date.now() > this.expirationTime;
    }
}

const sessionManager = new SessionManager();
module.exports = { sessionManager };
