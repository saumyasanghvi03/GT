import os
import wave
import numpy as np
import sounddevice as sd
from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from scipy.io.wavfile import write as wav_write
import openai
from fastapi.middleware.cors import CORSMiddleware
import socketio

# Set your OpenAI API key (consider using environment variables for security)
openai.api_key = ''  # Replace with your actual key

# Initialize FastAPI app
app = FastAPI()
allowed_origins = [
    # "vscode-webview://19bdbvprqochslefppcem9ugji6b50pgk7vae4nesohgjq7qpht7",
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
    "http://localhost:5000",
]

# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Initialize SocketIO server
# link refering to allow origin https://github.com/miguelgrinberg/python-socketio/discussions/855
sio = socketio.AsyncServer(async_mode='asgi',cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio)

is_recording = False
audio_data = []
sample_rate = 44100
filename = "backend_recording.wav"
stream = None

def transcribe_audio_to_text(file_path):
    with open(file_path, "rb") as audio_file:
        try:
            transcription_response = openai.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file, 
                response_format="text"
            )
            return transcription_response
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")

@sio.event
async def start_recording(sid):
    global is_recording, audio_data, stream

    if is_recording:
        await sio.emit('error', {"message": "Already recording"}, to=sid)
        return

    try:
        is_recording = True
        audio_data = []

        def audio_callback(indata, frames, time, status):
            if is_recording:
                audio_data.append(indata.copy())
        print("inside try")
        stream = sd.InputStream(samplerate=sample_rate, channels=1, dtype='int16', callback=audio_callback)
        stream.start()
        await sio.emit('recording_started', {"message": "Recording started"}, to=sid)

    except Exception as e:
        await sio.emit('error', {"message": str(e)}, to=sid)

@sio.event
async def stop_recording(sid):
    global is_recording, stream

    if not is_recording:
        await sio.emit('error', {"message": "Not currently recording"}, to=sid)
        return

    try:
        is_recording = False
        stream.stop()
        stream.close()

        audio_array = np.concatenate(audio_data, axis=0)
        wav_write(filename, sample_rate, audio_array)
        print(f"Audio saved to {filename}")

        transcription = transcribe_audio_to_text(filename)
        await sio.emit('transcription', {"transcription": transcription}, to=sid)

    except Exception as e:
        await sio.emit('error', {"message": str(e)}, to=sid)

@app.get("/ping")
async def ping():
    return JSONResponse(content={"status": "200"})

app.mount("/", socket_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True) 