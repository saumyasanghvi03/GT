const vscode = require('vscode');

class VersionedFilesProvider {
    constructor(versionControl) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.versionControl = versionControl;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    calculateDiffStats(versionElement) {
        const versions = this.versionControl.getAllVersions(versionElement.fileUri);
        const currentVersionIndex = versionElement.index;
    
        // If this is the first version, return null
        if (currentVersionIndex === versions.length - 1) {
            return null;
        }
    
        const currentContent = versions[currentVersionIndex];
        const previousContent = versions[currentVersionIndex + 1];
    
        const currentLines = currentContent.split('\n');
        const previousLines = previousContent.split('\n');
    
        let added = 0;
        let removed = 0;
    
        // Create arrays to track line status
        let i = 0, j = 0;
        
        while (i < currentLines.length || j < previousLines.length) {
            if (i >= currentLines.length) {
                // Remaining lines in previous version are deletions
                removed += previousLines.length - j;
                break;
            }
            if (j >= previousLines.length) {
                // Remaining lines in current version are additions
                added += currentLines.length - i;
                break;
            }
    
            if (currentLines[i] === previousLines[j]) {
                // Lines are identical
                i++;
                j++;
            } else {
                // Try to find the next matching line
                let foundMatch = false;
                
                // Look ahead in current version
                for (let lookAhead = i + 1; lookAhead < Math.min(i + 5, currentLines.length); lookAhead++) {
                    if (currentLines[lookAhead] === previousLines[j]) {
                        // Found match: lines between i and lookAhead are additions
                        added += lookAhead - i;
                        i = lookAhead;
                        foundMatch = true;
                        break;
                    }
                }
    
                if (!foundMatch) {
                    // Look ahead in previous version
                    for (let lookAhead = j + 1; lookAhead < Math.min(j + 5, previousLines.length); lookAhead++) {
                        if (previousLines[lookAhead] === currentLines[i]) {
                            // Found match: lines between j and lookAhead are deletions
                            removed += lookAhead - j;
                            j = lookAhead;
                            foundMatch = true;
                            break;
                        }
                    }
                }
    
                if (!foundMatch) {
                    // No match found within lookahead: count as both addition and deletion
                    added++;
                    removed++;
                    i++;
                    j++;
                }
            }
        }
    
        return { added, removed };
    }

    getTreeItem(element) {

        if (element.type === 'search') {
            const treeItem = new vscode.TreeItem(
                element.label,
                vscode.TreeItemCollapsibleState.None
            );
            treeItem.command = {
                command: 'versionedFiles.searchVersions', // You'll need to register this command
                title: 'Search Versions',
                tooltip: 'Search through all versions'
            };
            treeItem.iconPath = new vscode.ThemeIcon('search');
            return treeItem;
        }
        
        if (element.type === 'dateGroup') {
            const treeItem = new vscode.TreeItem(
                element.label,
                vscode.TreeItemCollapsibleState.Collapsed
            );
            treeItem.contextValue = 'dateGroup';
            treeItem.iconPath = new vscode.ThemeIcon('calendar');
            treeItem.description = `${element.versions.length} version${element.versions.length === 1 ? '' : 's'}`;
            return treeItem;
        }

        if (element.type === 'button') {
            const button = new vscode.TreeItem('Open Chat', vscode.TreeItemCollapsibleState.None);
            button.command = { command: 'extension.openChat', title: 'Open Chat' };
            button.iconPath = new vscode.ThemeIcon('comment');
            button.contextValue = 'chatButton';
            return button;
        }   
        // In the getTreeItem method, replace the existing command configuration:
        if (element.type === 'version') {
            const treeItem = new vscode.TreeItem('', vscode.TreeItemCollapsibleState.None);

            const versions = this.versionControl.getAllVersions(element.fileUri);
            const correctVersionNumber = versions.length - element.index;

            // Properly handle the URI
            let fullPath;
            if (typeof element.fileUri === 'string') {
                fullPath = vscode.workspace.asRelativePath(vscode.Uri.parse(element.fileUri));
            } else {
                fullPath = vscode.workspace.asRelativePath(element.fileUri);
            }

            const fileName = fullPath.split('/').pop(); // Get the last part of the path
            const directory = fullPath.split('/').slice(0, -1).join('/'); // Get everything except the last part

            // Format timestamp to show only hour and minute
            const date = new Date(element.timestamp);
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            treeItem.label = `${fileName}`;

            // Start building description with time
            let description = formattedTime;

            // Add diff stats before directory
            if (element.index === 0) {
                description += ' (Initial)';
            } else {
                const diffStats = this.calculateDiffStats(element);
                if (diffStats) {
                    description += ` (+${diffStats.added} -${diffStats.removed})`;
                }
            }

            // Add directory at the end if it exists
            if (directory) {
                description += ` (${directory})`;
            }

            treeItem.description = description;
            treeItem.iconPath = new vscode.ThemeIcon('versions');
            treeItem.contextValue = 'version';

            treeItem.command = {
                command: 'extension.viewVersionDiff',
                title: 'View Version Diff',
                arguments: [element]
            };

            return treeItem;
        }
    
        // If it's a file item
        const uri = vscode.Uri.parse(element);
        const document = vscode.workspace.textDocuments.find(doc => doc.uri.toString() === uri.toString());
        const relativePath = vscode.workspace.asRelativePath(uri);
        const languageId = document ? document.languageId : 'plaintext';
    
        const treeItem = new vscode.TreeItem(
            relativePath,
            vscode.TreeItemCollapsibleState.Collapsed
        );
        
        treeItem.description = this.getLanguageLabel(languageId);
        
        return treeItem;
    }

    async getChildren(element) {
        if (!element) {
            // Root level - group all versions by date
            const allFiles = this.versionControl.getAllVersionedFiles();
            const groupedVersions = {};

            for (const fileUri of allFiles) {
                const versions = this.versionControl.getAllVersions(fileUri);
                versions.forEach((content, index) => {
                    const timestamp = this.versionControl.getVersionTimestamp(fileUri, index);
                    const date = new Date(timestamp);
                    const dateKey = date.toDateString(); // This will give us strings like "Sun Nov 05 2023"

                    if (!groupedVersions[dateKey]) {
                        groupedVersions[dateKey] = [];
                    }
                    groupedVersions[dateKey].push({
                        type: 'version',
                        fileUri: fileUri,
                        versionNumber: versions.length - index,
                        content: content,
                        timestamp: timestamp,
                        index: index
                    });
                });
            }

            // Convert grouped versions to tree items, sort by date (most recent first), and add search and chat buttons
            const sortedDateGroups = Object.entries(groupedVersions)
                .sort(([dateKeyA], [dateKeyB]) => new Date(dateKeyB) - new Date(dateKeyA))
                .map(([dateKey, versions]) => ({
                    type: 'dateGroup',
                    label: dateKey,
                    versions: versions
                }));

            return [
                { type: 'search', label: 'Search Versions' },
                { type: 'button', label: 'Open Chat' },
                ...sortedDateGroups
            ];
        }

        if (element.type === 'dateGroup') {
            // Return versions in the date group
            return element.versions;
        }

        return [];
    }

    getLanguageLabel(languageId) {
        // Map language IDs to their display labels
        const labelMap = {
            javascript: 'JS',
            typescript: 'TS',
            python: 'PY',
            java: 'JAVA',
            html: 'HTML',
            css: 'CSS',
            json: 'JSON',
            markdown: 'MD',
            plaintext: 'TXT'
        };
        
        return labelMap[languageId] || 'TXT';
    }
}

module.exports = VersionedFilesProvider;