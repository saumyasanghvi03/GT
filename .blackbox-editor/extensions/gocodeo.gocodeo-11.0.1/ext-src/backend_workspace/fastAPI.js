const fileContentsForFastAPIProject = [
    {
      filename: ".gitignore",
      content: `env/
  __pycache__/
  *.pyc
  *.pyo
  *.pyd
  .Python
  .env
  `,
    },
    {
      filename: ".env",
      content: `APP_NAME=FastAPI Starter
  DEBUG=True
  `,
    },
    {
      filename: "requirements.txt",
      content: `fastapi==0.100.0
  uvicorn==0.22.0
  python-dotenv==1.0.0
  `,
    },
    {
      filename: "README.md",
      content: `# FastAPI Starter Template
  
  A simple template for FastAPI projects.
  
  ## Setup
  
  1. Create a virtual environment:
     \`\`\`bash
     python -m venv env
     source env/bin/activate
     \`\`\`
  
  2. Install dependencies:
     \`\`\`bash
     pip install -r requirements.txt
     \`\`\`
  
  3. Run the server:
     \`\`\`bash
     uvicorn app.main:app --reload
     \`\`\`
  `,
    },
    {
      filename: "app",
      contents: [
        {
          filename: "main.py",
          content: `from fastapi import FastAPI

from app.api.v1.endpoints import example

app = FastAPI()

# Include routers
app.include_router(example.router, prefix="/api/v1", tags=["Example"])

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI Starter!"}`,
        },
        {
          filename: "api",
          contents: [
            {
              filename: "__init__.py",
              content: "",
            },
            {
              filename: "v1",
              contents: [
                {
                  filename: "__init__.py",
                  content: "",
                },
                {
                  filename: "endpoints",
                  contents: [
                    {
                      filename: "example.py",
                      content: `from fastapi import APIRouter

router = APIRouter()

@router.get("/hello")
def say_hello():
    return {"message": "Hello, World!"}`,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          filename: "core",
          contents: [
            {
              filename: "__init__.py",
              content: "",
            },
            {
              filename: "config.py",
              content: `from pydantic import BaseSettings
  
class Settings(BaseSettings):
  app_name: str = "FastAPI Starter"
  debug: bool = True
  
class Config:
  env_file = ".env"
  
settings = Settings()
  `,
            },
          ],
        },
        {
          filename: "models",
          contents: [
            {
              filename: "__init__.py",
              content: "# Define Pydantic models here in future if needed.",
            },
          ],
        },
      ],
    },
  ];
  
  export default fileContentsForFastAPIProject;
  