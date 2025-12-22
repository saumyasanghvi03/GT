const vscode = require("vscode");
const path = require('path')

function calculateEndPosition(startPosition, text) {
  const lines = text.split("\n");
  const lineCount = lines.length - 1;

  if (lineCount === 0) {
    // Single line, just move the character position forward
    return startPosition.translate(0, text.length);
  } else {
    // Multiple lines, move to the end of the last line
    const lastLineLength = lines[lineCount].length;
    return new vscode.Position(startPosition.line + lineCount, lastLineLength);
  }
}

async function getFilesInCurrentDirectory() {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      return null;
    }

    // Define directories to exclude
    const excludeDirs = [
      'node_modules',
      '.next',
      '__pycache__',
      'dist',
      'build',
      '.git',
      '.svn',
      '.hg',
      'target',
      'bin',
      'obj',
      '.idea',
      '.vscode',
      '.DS_Store',
      'myenv',
      'venv',
      '.venv'
    ];

    // Create an exclude pattern relative to the base folder
    const excludePattern = `**/{${excludeDirs.join(',')}}/**`;

    // Get all files, excluding the specified directories
    const files = await Promise.all(
      workspaceFolders.map(async (folder) => {
        const relativePattern = new vscode.RelativePattern(folder.uri, '**/*');
        const filesInFolder = await vscode.workspace.findFiles(
          relativePattern,
          excludePattern
        );
        return filesInFolder.map((resource) => resource.fsPath);
      })
    );

    return files.flat();
  } catch (error) {
    console.error(error);
    return [];
  }
}

const filePathDelimiter = '[FILE_PATH]: '
const fileContentStartDelimiter = '[FILE_CONTENT]: '
const fileContentEndDelimiter = '[END_FILE]'

// List of supported code file extensions
const supportedExtensions = [
  '.js', '.jsx', '.ts', '.tsx',  // JavaScript/TypeScript
  '.py', '.php', '.rb',          // Python, PHP, Ruby
  '.java', '.cs', '.cpp', '.c',  // Java, C#, C++, C
  '.html', '.css', '.scss',      // Web
  '.json', '.yaml', '.yml', '.jsonl',      // Data formats
  '.md', '.txt',                 // Documentation
  '.sh', '.bash',                // Shell scripts
  '.xml', '.svg',                // Markup
  '.vue', '.go', '.rs'           // Vue, Go, Rust
];

function isCodeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return supportedExtensions.includes(ext);
}

async function getFilesContents(filePaths) {
  try {
    if (!filePaths){
      return null
    }
    const fileDetails = [];
    const promises = filePaths.map(async filePath => {
      try {
        // Skip if not a supported code file
        if (!isCodeFile(filePath)) {
          // console.log(`Skipping unsupported file type: ${filePath}`);
          return;
        }
        
        const fileContent = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
        fileDetails.push(`${filePathDelimiter}${filePath}\n${fileContentStartDelimiter}${fileContent.toString()}\n${fileContentEndDelimiter}\n`);
      } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
      }
    });
    return Promise.all(promises).then(() => fileDetails.join(''));
  } catch (error) {
    console.error(error);
    return null
  }
}
module.exports = {
  getFilesContents,
  calculateEndPosition,
  getFilesInCurrentDirectory
};
