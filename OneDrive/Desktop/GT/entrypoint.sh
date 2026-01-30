#!/bin/bash

# Start the FastAPI backend in the background
echo "Starting FastAPI Backend..."
python local_server.py &

# Start the Streamlit frontend
echo "Starting Streamlit Frontend..."
streamlit run app.py --server.port 8501 --server.address 0.0.0.0
