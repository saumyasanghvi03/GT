export const fileContentsForNodeProject = [
    {
      filename: ".gitignore",
      content: `node_modules
  .env
  `,
    },
    {
      filename: ".env",
      content: `PORT=3000`,
    },
    {
      filename: "package.json",
      content: `{
    "name": "nodejs-backend-starter",
    "version": "1.0.0",
    "main": "src/server.js",
    "scripts": {
      "start": "node src/server.js",
      "dev": "nodemon src/server.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "description": "",
    "dependencies": {},
    "devDependencies": {
      "nodemon": "^3.1.9"
    }
  }
  `,
    },
    {
      filename: "README.md",
      content: `# Node.js Backend Starter
  
  This is a simple Node.js template for building backend applications without any frameworks like Express.
  
  ## Features
  - Lightweight
  - Example route included
  - Environment variable support
  
  ## Getting Started
  
  ### Installation
  1. Clone the repository:
     \`\`\`
     git clone <repository-url>
     cd nodejs-backend-starter
     \`\`\`
  
  2. Install dependencies:
     \`\`\`
     npm install
     \`\`\`
  
  ### Running the Server
  - Development mode:
    \`\`\`
    npm run dev
    \`\`\`
  
  - Production mode:
    \`\`\`
    npm start
    \`\`\`
  
  ## API Endpoints
  - **GET** \`/example\`: Returns a simple JSON response.
  `,
    },
    {
      filename: "src",
      contents: [
        {
          filename: "server.js",
          content: `const http = require("http");
  const routes = require("./routes");
  
  const PORT = process.env.PORT || 3000;
  
  const server = http.createServer((req, res) => {
    routes.handleRequest(req, res);
  });
  
  server.listen(PORT, () => {
    console.log(\`Server running at http://localhost:\${PORT}/\`);
  });
  `,
        },
        {
          filename: "routes.js",
          content: `const exampleController = require("./controllers/exampleController");
  
  const handleRequest = (req, res) => {
    if (req.url === "/example" && req.method === "GET") {
      return exampleController.sayHello(req, res);
    }
    res.statusCode = 404;
    res.end("Not Found");
  };
  
  module.exports = { handleRequest };
  `,
        },
        {
          filename: "controllers",
          contents: [
            {
              filename: "exampleController.js",
              content: `exports.sayHello = (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Hello, World!" }));
  };
  `,
            },
          ],
        },
      ],
    },
  ];
  
  export default fileContentsForNodeProject;
  