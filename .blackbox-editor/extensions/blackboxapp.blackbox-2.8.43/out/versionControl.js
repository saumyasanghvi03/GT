const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

class VersionControl {
    constructor(context) {
        this.versions = new Map(); // Store versions of files
        this.timestamps = new Map(); // Store timestamps for versions
        this.storageUri = context.globalStorageUri;
        this.loadFromDisk(); // Load saved versions when initializing
    }

    // Load saved versions from disk
    loadFromDisk() {
        try {
            if (!fs.existsSync(this.storageUri.fsPath)) {
                fs.mkdirSync(this.storageUri.fsPath, { recursive: true });
            }

            const dataPath = path.join(this.storageUri.fsPath, 'versions.json');
            if (fs.existsSync(dataPath)) {
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                this.versions = new Map(Object.entries(data.versions));
                this.timestamps = new Map(Object.entries(data.timestamps));
            }
        } catch (error) {
            console.error('Error loading versions:', error);
        }
    }

    searchInVersions(searchQuery) {
        const results = new Map();

        // Iterate through all versioned files
        for (const [uriString, versions] of this.versions.entries()) {
            // Search in each version of the file
            versions.forEach((content, versionIndex) => {
                if (content.toLowerCase().includes(searchQuery.toLowerCase())) {
                    // If we find a match, store the file URI and version index
                    if (!results.has(uriString)) {
                        results.set(uriString, []);
                    }
                    results.get(uriString).push({
                        versionIndex,
                        timestamp: this.getVersionTimestamp(uriString, versionIndex)
                    });
                }
            });
        }

        return results;
    }

    // Save versions to disk
    saveToDisk() {
        try {
            const data = {
                versions: Object.fromEntries(this.versions),
                timestamps: Object.fromEntries(this.timestamps)
            };

            const dataPath = path.join(this.storageUri.fsPath, 'versions.json');
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving versions:', error);
        }
    }

    saveVersion(uri) {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.uri.toString() === uri.toString()) {
            const newContent = editor.document.getText();
            const uriString = uri.toString();

            // Get the previous version
            const versionHistory = this.versions.get(uriString) || [];
            const lastVersion = versionHistory.length > 0 ? versionHistory[versionHistory.length - 1] : null;

            // Only save if content is different from the last version
            if (lastVersion !== newContent) {
                // Save version content
                versionHistory.push(newContent);
                this.versions.set(uriString, versionHistory);

                // Save timestamp
                const timestampHistory = this.timestamps.get(uriString) || [];
                timestampHistory.push(new Date().toISOString());
                this.timestamps.set(uriString, timestampHistory);

                // Save to disk after each new version
                this.saveToDisk();
            }
        }
    }

    getVersionTimestamp(uri, index) {
        const uriString = typeof uri === 'string' ? uri : uri.toString();
        const timestamps = this.timestamps.get(uriString);
        if (timestamps && timestamps[index]) {
            return new Date(timestamps[index]).toLocaleString();
        }
        return 'Unknown date';
    }

    getLastVersion(uri) {
        const uriString = typeof uri === 'string' ? uri : uri.toString();
        const versionHistory = this.versions.get(uriString);
        if (versionHistory && versionHistory.length > 0) {
            return versionHistory[versionHistory.length - 1];
        }
        return null;
    }

    getAllVersionedFiles() {
        // Convert the versions Map keys to an array and sort it
        return Array.from(this.versions.keys()).sort((a, b) => {
            // Get timestamps for both files
            const timestampsA = this.timestamps.get(a) || [];
            const timestampsB = this.timestamps.get(b) || [];

            // Get the most recent timestamp for each file
            const latestA = timestampsA[timestampsA.length - 1] || '';
            const latestB = timestampsB[timestampsB.length - 1] || '';

            // Sort in descending order (most recent first)
            return new Date(latestB) - new Date(latestA);
        });
    }

    getAllVersions(uri) {
        const uriString = typeof uri === 'string' ? uri : uri.toString();
        const versions = this.versions.get(uriString) || [];
        return [...versions];  // Return array without reversing
    }

    // Optional: Add method to clear storage
    clearStorage() {
        this.versions.clear();
        this.timestamps.clear();
        this.saveToDisk();
    }
}

module.exports = VersionControl;