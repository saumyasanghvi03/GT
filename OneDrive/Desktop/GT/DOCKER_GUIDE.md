# 🐳 Docker Setup Guide - Pitch Review Assistant

This guide helps you set up the **Pitch Review Assistant** using Docker. This ensures all team members have the exact same environment, regardless of their OS.

## 📋 Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
- (Optional) [Ngrok](https://ngrok.com/) if you want to use the Cloud UI with a local backend.

## 🚀 Quick Start (Recommended)

1.  **Clone the Repository** (if not already done):
    ```bash
    git clone https://github.com/saumyasanghvi03/GT.git
    cd GT
    ```

2.  **Build and Run**:
    Run the following command in your terminal:
    ```bash
    docker-compose up --build
    ```

3.  **Access the App**:
    -   **Frontend (Streamlit)**: [http://localhost:8501](http://localhost:8501)
    -   **Backend (FastAPI)**: [http://localhost:8000](http://localhost:8000)

## 🛠️ How it Works
The Docker setup runs two services in parallel:
1.  **FastAPI Backend**: Hosts the AI models (TinyLlama & Whisper).
2.  **Streamlit Frontend**: The user interface.

### **Internal AI Setup**
Once the app is running:
-   In the sidebar, select **🏠 Local (Hybrid)**.
-   The default URL `http://localhost:8000` will point to the Docker backend.
-   Click **"Wake Up AI"** to start the engines inside the container.

## 📦 Troubleshooting

### **Shared Volumes**
The `docker-compose.yml` uses a volume mount. If you change `pnotes.md` or `pitch_questions.md` on your host machine, the changes will reflect **instantly** inside the running container.

### **Llama-2 Setup**
If you want to use the 13GB high-quality model:
1.  Enter the container: `docker exec -it <container_id> /bin/bash`
2.  Run the download script: `python download_weights.py`
3.  *Note*: This requires a lot of disk space and a fast connection.

### **Common Errors**
-   **Port Conflict**: If port 8501 or 8000 is already in use, stop the local processes first.
-   **Resource Limits**: Give Docker at least 8GB of RAM in settings for smooth AI performance.
