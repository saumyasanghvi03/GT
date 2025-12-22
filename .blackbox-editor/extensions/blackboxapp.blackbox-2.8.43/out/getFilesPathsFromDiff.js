const fs = require("fs")
const path = require("path")
const vscode = require("vscode")
const { SUPPORTED_PROGRAMMING_LANGUAGES } = require('./file-filtering')
/**
 * This function takes a diff string as input and returns an array of file paths that have been changed.
 * @param {string} diffString - The diff string to parse.
 * @return {string[]} An array of file paths that have been changed.
 */
function getChangedFilePaths(diffString) {
    // Initialize an empty array to store the file paths
    const filePaths = [];

    // Split the input string into lines
    const lines = diffString.split('\n');

    // Iterate over each line
    for (let i = 0; i < lines.length; i++) {
        // If the line starts with 'diff --git', it means a new file path is being introduced
        if (lines[i].startsWith('diff --git')) {
            // Extract the file path by splitting the line and getting the third element, then removing the 'a/' prefix
            const filePath = lines[i].split(' ')[2].substring(2);
            
            // Check if the file path ends with one of the supported programming languages
            const fileExtension = filePath.slice(filePath.lastIndexOf('.') + 1);
            if (!SUPPORTED_PROGRAMMING_LANGUAGES.includes('.' + fileExtension)) {
                // return null;
            }else{
                // Add the file path to the array
                filePaths.push(filePath);
            }
        }
    }

    // Return the array of file paths
    return filePaths;
}

/**
 * This function reads the contents of a file.
 * @param {string} filePath - The file path to read.
 * @return {string|null} The contents of the file, or null if the file does not exist.
 */

function readFileContent(filePath) {
    let currentDirs = vscode.workspace.workspaceFolders[0].uri.fsPath;
    // Convert the file path to an absolute file path
    const absoluteFilePath = currentDirs+'/'+filePath

    try {
        // Read the file contents
        const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8');

        // Return the file contents
        return fileContent;
    } catch (error) {
        // If the file does not exist, return null
        if (error.code === 'ENOENT') {
            return null;
        }

        // Otherwise, throw the error
        throw error;
    }
}

module.exports = {
    getChangedFilePaths,
    readFileContent
}