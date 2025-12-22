/**
 * Analyzes the last line of a given code string and determines whether it's the beginning of a class, function, or endpoint.
 * 
 * @param {string} code - The code string to analyze.
 * @returns {string} - 'class', 'function', 'endpoint', or 'unknown' depending on the analysis result.
 */
function analyzeLastLine(code) {
    const lines = code.trim().split('\n');
    const lastLine = lines[lines.length - 1].trim();
    
    const regexPatterns = {
        class: /(class|interface|enum|struct)\s+\w+/i,
        function: /(function|def|func)\s+\w+/i,
        endpoint: /(get|post|put|delete|patch|options|head|connect)\s+\/\w+/i,
        switch: /(switch)\s*\(/i,
        while: /(while)\s*\(/i,
        try: /(try)\s*\{/i,
        catch: /(catch)\s*\{/i,
        throw: /(throw)\s+/i,
        if: /(if)\s*\(/i,
        for: /(for)\s*\(/i,
        return:  /(return)/i
    };

    for (const [type, regex] of Object.entries(regexPatterns)) {
        if (regex.test(lastLine)) {
            return true
        }
    }

    return false
}

module.exports = {
    analyzeLastLine
}
