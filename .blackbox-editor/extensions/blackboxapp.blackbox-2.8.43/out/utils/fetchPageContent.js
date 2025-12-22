"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPageTextContent = void 0;
function fetchPageTextContent(url) {
    return new Promise((resolve, reject) => {
        return fetch(url)
            .then(rs => rs.text())
            .then(textContent => resolve({ textContent, url }))
            .catch(reject);
    });
}
exports.fetchPageTextContent = fetchPageTextContent;
