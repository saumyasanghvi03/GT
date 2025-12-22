<h1>From Code to Agents: GoCodeo with MCP</h1>

GoCodeo is your AI **dev agent** inside Visual Studio Code — capable of building, refactoring, and deploying full-stack apps in minutes.

Designed for modern teams, it combines intelligent code generation with seamless workflows: one-click Vercel deployment, native Supabase integration, and structured project scaffolding out of the box.

With **Model Context Protocol (MCP)**, GoCodeo goes beyond code — becoming **environment-aware**. Connect tools like GitHub, Notion, Postgres, and Stripe through the **MCP server**, and watch as agents take meaningful actions: raise PRs, read product specs, seed databases, or update billing — autonomously and in real-time.

Powered by top-tier models like **Claude Sonnet 3.7 & 3.5, Gemini 2.5 Pro, DeepSeek-R1, GPT-4.1, and OpenAI o3-mini**, GoCodeo delivers an agentic development experience where context meets execution, now with the power of the **Model Context Protocol**.


## GoCodeo: Vibe Code Full-Stack Apps

### 🛠 BUILD: 
<p><strong>BUILD</strong> is an AI-powered automation framework that simplifies development with modular code generation, pre-configured templates, and one-click deployment, streamlining the entire lifecycle within your IDE.</p>

- **Build Full-Stack Web Apps**: Build full-stack web applications with Supabase and deploy seamlessly with Vercel.
- **Framework Starter Templates**: Jumpstart your project by selecting from 25+ frameworks to generate optimized starter templates, complete with essential files and configurations.
- **Code Generation**: Automatically create full-fledged and functional projects tailored to your specific requirements.
- **Visual Build Generation**: Attach an image to generate production-ready code with structured project files and configurations instantly.
- **Enhanced Prompts**: Turn simple input into full-fledged, AI-optimized prompts with functional and technical specifications. 
- **Build History Management**: Keep your projects organized by easily switching between multiple build sessions with GoCodeo’s Build History feature. 
- **Code Referencing**: Use the @ symbol to reference files or code symbols for smarter, context-aware AI assistance. Simply type @ to see a list of all the files and code symbols in your folder.
- **Model Selector**: Choose from top-tier models like OpenAI, Claude, Gemini, and Deepseek to generate precise code outputs tailored to your needs.


 ![Watch Build Video](https://gocodeo-asset.s3.ap-south-1.amazonaws.com/vs+code+renewed.gif)

### MCP: Model Context Protocol

MCP is GoCodeo’s agentic tools framework that enables real-time, context-aware development by connecting GoCodeo agents to your external tools and services. Build custom MCP agents that fetch data, execute commands, and collaborate intelligently within your environment using a unified MCP client and MCP server architecture.

**Custom Tool Integrations**<br>
  Define your own tools using the <span style="color:green">mcp.json</span> file — including GitHub, Notion, Postgres, Stripe, and more.

**Environment-Aware Agents**<br>
  MCP agents understand your toolchain and fetch live context to tailor actions based on your dev setup.

**Real-Time Context Fetching**<br>
  Dynamically pull specs, comments, or data from connected tools using the **MCP client**, and act on them immediately.

**Dynamic Tool Selection**<br>
  GoCodeo automatically selects the most relevant tool to fulfill your request based on intent and context.

**Inline Logs and Reasoning**<br>
  Get visibility into every tool call, including arguments, raw output, and the agent’s decision-making process — all inside chat.

### Step-by-Step Process to Integrate MCP Server with GoCodeo:

**Step 1: Open the MCP Section**<br>
Navigate to the **BUILD** panel in the GoCodeo chat interface and switch to the **MCP** tab.

**Step 2: Add a Global MCP Server**<br>
Click on the **“Add Global MCP Server”** button to open a new <span style="color:green">mcp.json</span>
 configuration file.

**Step 3: Insert MCP Configuration**<br>
Paste your custom MCP configuration (tool name, endpoint, args, tokens) into the opened <span style="color:green">mcp.json</span> file.

**Step 4: Save the File**<br>
Save the file to complete the MCP server integration.

**Step 5: Confirm Integration**<br>
Once saved, your MCP server is successfully connected to GoCodeo and ready to use.

**Step 6: Use MCP from the BUILD Panel**<br>
In the **BUILD** section, type queries or feature requests, and GoCodeo will intelligently route them to your connected MCP tool.

**Step 7: Browse Community MCP Servers**<br>
Click on **“Browse Community MCP Servers”** to explore and add prebuilt tools shared by the developer community.

![Watch MCP Video](https://gocodeo-asset.s3.ap-south-1.amazonaws.com/configure+mcp+gif+hd.gif)

### 💡 ASK: 
<p><strong>ASK</strong> is an AI-powered assistant that transforms your IDE into an intelligent workspace, offering context-aware coding assistance, AI-powered chat, and real-time insights for enhanced productivity.</p>


-  **Chat with GoCodeo Agent**: Get instant help for file queries or programming-related discussions right inside your IDE.
-  **Ask Documents**: Upload PDFs, Word document files and query their content directly, to get precise, context-aware answers and insights. 
-  **Context from Images**:  Attach images directly, and ask context-specific questions to gain instant insights or clarification.
-  **Organized Chat History**: Seamlessly manage multiple conversations by switching between sessions to keep your thoughts organized.
-  **Terminal Helper**: Use `Ctrl+Shift+T` to get instant terminal command suggestions tailored to your input for faster development.
-  **Terminal Debugger**: Use `Ctrl+Shift+D` to debug failed terminal commands using AI-powered explanations and fixes.  
-  **Quick Edits**: `Ctrl+Shift+E`: Select a section of code and edit it with a single prompt. 


![Watch Overview Video](https://gocodeo-asset.s3.ap-south-1.amazonaws.com/walkthrough+-+ask.gif)


### 🧪 TEST: 
<p><strong>TEST</strong> simplifies unit test creation, execution, and debugging with AI-driven automation and smart insights, ensuring reliable and optimized code across multiple languages.</p>

- **Generate Test First**: Automatically generate comprehensive unit test cases tailored to your codebase, ensuring robust coverage right from the start.  
- **Run Tests with Ease**: Execute tests directly from the built-in Test Panel for a seamless experience.
- **Regenerate Tests**: Quickly refine and recreate test cases with a single click to better align with your desired outcomes. 
- **Custom Configurations**: Choose your test framework, code style, and the number of tests per run — all configurable to fit your workflow.  
- **Generate Additional Tests**: Expand your test coverage effortlessly by generating additional test cases tailored to your application’s functionality and edge cases.  
- **Feedback Loop**: Share your insights on generated tests to improve their accuracy and relevance for your specific needs.  
- **AI-Powered Fixes**: Diagnose and resolve failing tests effortlessly with intelligent AI suggestions.  

![Watch Test Video](https://gocodeo-asset.s3.ap-south-1.amazonaws.com/walkthrough+-+Tests.gif)
 

### Additional Features:
<h4>CODE AUTOCOMPLETION</h4> 

<p>Streamline development with AI-powered autocompletion:</p>

- **Context-Aware Suggestions**: Delivers intelligent, relevant code suggestions based on active files, language, and surrounding context.  
- **Library Integration**: Suggests functions, methods, and properties from imported libraries or frameworks.  
- **Error Prevention**: Ensures syntax and semantic accuracy that aligns with project-specific configurations.
- **Predictive Snippets**: Anticipates entire code snippets or boilerplate structures based on context, allowing developers to focus on logic.

![Image of CODE AUTOCOMPLETION](https://gocodeo-asset.s3.ap-south-1.amazonaws.com/autocompo_1.png)

<h4>CODE EDITING</h4> 

<p>Effortlessly refine code with smart, syntax-aware tools:</p>

- **Shortcut-Driven In-Editor Editing**: Edit code directly within the editor using `Cmd+Shift+E` (MacOS) or `Ctrl+Shift+E` (Windows/Linux). 
- **Targeted Section Edits**: Select specific sections of code and apply precise updates, without impacting unrelated areas of the project.
- **Syntax-Aware Editing**: Maintains code integrity by recognizing the structure and syntax of the active programming language during manual edits‍.
- **Integrated Style Enforcement**: Ensures consistency with project-specific coding standards by automatically applying formatting rules during edits.

![Image of CODE EDITING](https://gocodeo-asset.s3.ap-south-1.amazonaws.com/walkthrough+-+Inline-code-edit.png)

 
## Integrations

### 🛠 Seamless Supabase Integration – AI-Powered Backend Automation
GoCodeo streamlines your Supabase workflow, connecting to existing projects and automating backend setup.
- **Instant Project Integration** – Connect to Supabase and retrieve configurations automatically.
- **End-to-End Setup** – Run SQL queries, set up authentication and enable real-time data persistence with a single command.
- **AI-Generated Code** – Get ready-to-use Supabase integration code tailored to your project.

### 🚀 Deploy with Vercel – Instant Full-Stack Hosting
GoCodeo automates deployment with Vercel for fast, hassle-free hosting.
- **One-Click Deployment**: GoCodeo automates the deployment process, ensuring a hassle-free experience.
- **Optimized for Production**: Get scalable, high-performance hosting with minimal configuration.
- **CI/CD Integration**: Push updates effortlessly while maintaining a smooth development workflow.

### 🛠 Seamless Git Integration – AI-Driven PR Automation
GoCodeo simplifies pull request management with intelligent automation.
- **Automated PR Creation** – Simply mention the target branch, and GoCodeo analyzes your repository, commits changes, pushes updates, and raises a pull request, instantly.
- **Hands-Free Git Operations** – No need to switch contexts or execute multiple commands, GoCodeo handles everything in one go.
- **Instant PR Link** – Once your pull request is created, get an instant PR link, keeping your workflow smooth and efficient.

### 🌐 WebSearch (Powered by Perplexity AI)
GoCodeo now features real-time, AI-powered web search without leaving your IDE.
- **Instant AI-Powered Web Search**: Use ***@Web*** to fetch API references, documentation, and best practices from across the internet.
- **Context-Aware & Intelligent Results**: GoCodeo dynamically constructs smart search queries based on your prompt and coding history.
- **Source-Based Insights**: Get accurate, up-to-date insights backed by credible sources.
- **Seamless Integration**: Search the web and apply insights directly into your code, all within GoCodeo.

### 📄 Auto-Generate Documentation for Your Full Repository
GoCodeo analyzes your repository and instantly generates a structured README.md or PRD. with a single command.
- **Analyze Your Repository** – GoCodeo scans your project, gathering key details about its structure, dependencies, and configurations.
- **Instant Documentation** – Generates an overview, quick start guide, configuration options, project structure, advanced usage, and contribution guidelines.
- **Auto-Save to Root Directory**– Ensures the file is instantly placed in your project’s main folder for easy access.
 
## 🌟 Why GoCodeo Is a Game-Changer for Developers

### 1. Build Entire Projects with AI: From Prompts to Production-Ready Code
- Turn plain **English into functional code with GoCodeo’s AI code generation capabilities** by providing a natural language prompt - like “Build a fitness app with user registration, workout tracking, and progress visualization” - and watch GoCodeo generate a complete, **production-ready project** with all the necessary files, dependencies, and structure.
- With GoCodeo’s **AI-powered code assistant**, get **ready-to-use project architecture** optimized for your chosen framework and programming language, ensuring scalability and maintainability.
- **One-Click Vercel Deployment**: Deploy to Vercel instantly from within VSCode. GoCodeo auto-generates deployment configs, handles environment variables, and sets up the CI/CD pipeline—so you can preview, test, and ship without leaving your editor.
- **Seamless Supabase Integration**: GoCodeo automatically configures your Supabase backend, scaffolding database tables, auth flows, and storage logic from your prompt. It wires everything—from schema to client setup—so your backend is ready to go without extra setup.
- Keep track of every change with a **detailed build history**. Revisit past builds to monitor progress or reference previous iterations as needed.
- The output is **editable and customizable**. Refine the auto-generated code, tweak structures, or add new components based on your specific project needs - or refactor code with a prompt to meet tight deadlines efficiently.
- With **quality-first AI code generation**, GoCodeo ensures that the code produced is efficient and production-ready, saving you time and effort.

### 2. Intelligent Multi-Agent Workflows with Model Context Protocol (MCP)
- **Build AI agents that connect to your toolchain** using GoCodeo’s implementation of the Model Context Protocol (MCP), enabling real-time, context-aware actions across tools like GitHub, Notion, Postgres, Stripe, and more.
- **Automate complex multi-step tasks** - like reading a PRD from Notion, generating app code, creating a GitHub repo, and deploying via Vercel—executed by intelligent agents through a unified MCP client-server setup.
- **Define custom tools with `mcp.json`**, allowing full flexibility to integrate internal APIs and external platforms, and ensure your agents operate with live, actionable context from your environment.
- **Leverage environment-aware agents** that dynamically fetch data, select the most relevant tool, and explain their reasoning and decisions with inline logs for complete transparency.
- **Orchestrate toolchains with zero friction** - no hardcoded APIs, no plugins. Just AI agents working in sync to get your job done inside VSCode.

### 3. Streamline Your Workflow with Powerful Integrations
- **Seamlessly sync with GitHub** — commit changes, switch branches, and manage your repo without ever leaving VSCode.
- **Auto-generate full-repo documentation** — GoCodeo intelligently reads your codebase to create docstrings and structured documentation for files, functions, and components.
- Use **Web Search inside VSCode** to enrich your workflow—pull in code references, framework usage, or live StackOverflow examples, right when you need them.
- **Stay context-aware across tools**—GoCodeo keeps track of your repo structure, dependencies, and updates as you build and iterate.
- From commit to deploy, GoCodeo connects the dots across your stack — minimizing context switching and maximizing productivity.

### 4. Code in Your Stack, Your Way — With Framework and LLM Flexibility
- Generate backend logic, APIs, and UI components across frontend and full-stack web projects.
- Supports 25+ popular frameworks like React, Next.js, Django, Flask, Express.js, Spring Boot, and more
- **Choose your favorite LLM** on demand — Claude 3.5/3.7 Sonnet, Gemini 2.5 Pro, DeepSeek-R1, GPT-4o, or o3-mini—all seamlessly routed for the best output.
- **Stay loyal to VSCode** — GoCodeo runs natively inside your favorite editor, no new IDEs, no extra setup.



## Getting Started with GoCodeo

- **Install** the GoCodeo extension to leverage the power of cutting-edge Large Language Models (LLMs) like Claude Sonnet 3.7 & 3.5, GPT-4, DeepSeek-R1 and OpenAI o3-mini.

- **Ask** features:
 
  **Instant Access to Chat and Explanations**: Use `Ctrl+Shift+L` for Windows or `Cmd+Shift+L` for Mac to quickly generate docstrings, get file explanations, or interact with GoCodeo’s AI agent for any programming-related queries. 
  1. **File explanations** for any file in your project.
  2. **Interactive chat with GoCodeo agent** to ask questions about specific files or programming concepts.
  3. **Auto-generated docstrings** for functions, classes, and components.
  4. **File context search** to easily search and ask about files within your codebase.
  5. **Updated chat history** to switch between multiple conversations and stay organized.

 
- **Build** features:

  Open **Build** quickly: `Ctrl+Shift+K` for Windows and `Cmd+Shift+K` for Mac

  1. **Generate project structures**, define **steps**, and generate all required **files** automatically.
  2. **Track** each project's progress with detailed build history.
  3. **Edit and update** project structures and components as needed.
  3. **Build full-stack web apps with Supabase and deploy with Vercel** —all within the comfort of your VSCode.

- **Test** features:
  1. Click the `GoCodeo-TEST` button at the top of the class/function to **auto-generate tests**.
  2. Get tests that cover positive, negative, edge, and error cases.
  3. Provide **feedback** to instantly improve test accuracy with AI-powered test refinement.
  4. Click the `Run Tests` button to **execute tests** for Python and JavaScript and understand test failures with in-depth failure explanations.
  5. Click the `Fix Test/Code` button to **fix errors** with AI test/code correction recommendations.
  6. Use the `Copy or save tests` option to integrate the generated tests with your existing test suite.

- **MCP** features:
  1. **Connect external tools via mcp.json** to integrate services like GitHub, Notion, Postgres, Stripe, and more into your development workflow.
  2. **Trigger tool-specific actions from chat** -like reading a PRD from Notion or pushing to GitHub - using natural language queries.
  3. **Dynamically fetch real-time context** such as environment variables, database schema, or project specs from connected tools.
  4. **Let GoCodeo auto-select the best tool** based on intent, using your defined MCP config - no manual switching needed.
  5. **Debug with transparency**: View which tool is being called and see the final result directly in chat - with upcoming support for inline tool arguments and execution logs to trace agent reasoning step-by-step.
  6. **Leverage community MCP servers** via the "Browse Community MCP Servers" option and instantly add powerful integrations built by other developers.
  7. **Create intelligent, chained workflows** - like: fetch data from Notion → build the app → upload to GitHub → deploy to Vercel - all orchestrated by MCP agents.


## FAQ
<details>
<summary> Why isn't GoCodeo completely free?</summary>
We love supporting developers, which is why our AI coding and testing agent on the VS Code extension is free forever with limited requests. However, running large language models comes with significant costs. To ensure GoCodeo can grow sustainably while maintaining exceptional service quality, we need to cover these operational expenses.
</details>
<br/><br/>

<details>
<summary>What are premium model requests?</summary>
GPT-4o, Claude Sonnet 3.7 & 3.5, DeepSeek-R1, and OpenAI o3-mini are classified as premium models. Each month, in the pro plan you receive 500 premium model requests, along with unlimited requests for basic models, ensuring flexibility and extensive usage.
</details>
<br/><br/>

<details>
<summary> Does GoCodeo store any code?</summary>
No, GoCodeo does not store or use your code for any purpose, including training. We only collect anonymized telemetry and usage data to improve our services. Your code remains completely secure and private.
</details>
<br/><br/>

<details>
<summary> Who owns the code generated in GoCodeo?</summary>
Whether you're using the free, pro, or enterprise version of GoCodeo,  all the code generated by our platform are entirely yours. You're free to use them however you like, including for commercial purposes.
</details>
<br/><br/>

<details>
<summary>Does the paid plan include add-on options?</summary>
Yes! If you exceed the monthly usage limit on any paid plan (Pro or Business), you can purchase an add-on for just US$10, which grants you 250 additional premium model requests for that month.
</details>
<br/><br/>

<details>
<summary>Where can I ask more questions?</summary>
Feel free to join and post on our discord. If you'd rather keep your question private, you can email us directly at support@gocodeo.com.
</details>
<br/><br/>

## Have Questions or Feedback?
 We’d love to hear from you! Join our community on Discord or reach out to us via email at support@gocodeo.com. Your input is invaluable in making GoCodeo even better! 🚀


## AI-Powered by OpenAI, Claude, and Gemini - Your Privacy Matters

 GoCodeo is dedicated to ensuring the security and privacy of your code. While the AI models enhance your testing and development experience, we prioritize your confidentiality.

 For more details on our AI partners' privacy policies, check out the following links:

  - [OpenAI's Privacy Policy](https://openai.com/policies/row-privacy-policy/)
  - [Claude's Privacy Policy](https://www.anthropic.com/legal/privacy)
  - [Gemini's Privacy Policy](https://policies.google.com/privacy)

## Resources
- **Website**: [GoCodeo](https://www.gocodeo.com)
- **Join Discord Community**: [Join Now](https://discord.gg/VzkJNt8C4b)
- **Check Blog**: [GoCodeo Blog](https://www.gocodeo.com/blog)

**Happy Coding!** ❤  
© 2024 GoCodeo
