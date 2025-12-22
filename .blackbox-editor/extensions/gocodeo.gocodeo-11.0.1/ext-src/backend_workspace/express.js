export const fileContentsForExpressProject = [
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
  "name": "express-backend-starter",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
},
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
`,
  },
  {
    filename: "README.md",
    content: `# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 \`<script setup>\` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
`,
  },
  {
    filename: "src",
    contents: [
      {
        filename: "server.js",
        content: `
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`Server is running on http://localhost:\${PORT}\`);
});
`,
      },
      {
        filename: "app.js",
        content: `require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const routes = require("./routes");

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", routes);

module.exports = app;
`,
      },

      {
        filename: "routes",
        contents: [
          {
            filename: "index.js",
            content: `const express = require("express");
const router = express.Router();
const exampleController = require("../controllers/exampleController");

router.get("/hello", exampleController.sayHello);

module.exports = router;
`,
          },
        ],
      },
      {
        filename: "middlewares",
        contents: [
          {
            filename: "logger.js",
            content: `
            module.exports = (req, res, next) => {
            console.log(\`\${req.method} \${req.url}\`);
            next();
            };
            `,
          },
        ],
      },
      {
        filename: "controllers",
        contents: [
          {
            filename: "exampleController.js",
            content: `
            exports.sayHello = (req, res) => {
            res.status(200).json({ message: "Hello, World!" });
            };
            `,
          },
        ],
      },
    ],
  },
];

export default fileContentsForExpressProject;
