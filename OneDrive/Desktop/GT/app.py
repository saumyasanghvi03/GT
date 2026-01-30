import streamlit as st
from streamlit_webrtc import webrtc_streamer, WebRtcMode, AudioProcessorBase
import av
import numpy as np
import threading
import queue
import whisper
import tempfile
import soundfile as sf
import os
import time
import random
from utils import init_airllm, load_knowledge_base, generate_response, parse_slides
from prompts import SYSTEM_PROMPT_JUDGE, SYSTEM_PROMPT_ADVISOR

# --- Audio Processing ---
class AudioRecorder(AudioProcessorBase):
    def __init__(self):
        self._frame_queue = queue.Queue()
        self._frames = []
        self._lock = threading.Lock()

    def recv(self, frame: av.AudioFrame) -> av.AudioFrame:
        with self._lock:
            self._frames.append(frame.to_ndarray())
        return frame

    def get_audio_data(self):
        with self._lock:
            if not self._frames:
                return None
            return np.concatenate(self._frames)
            
    def clear(self):
        with self._lock:
            self._frames = []

@st.cache_resource
def load_whisper_model():
    # Only load if needed to save RAM
    return whisper.load_model("base")

def transcribe_audio(audio_data, model):
    if audio_data is None: return ""
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        sf.write(tmp.name, audio_data, 48000)
        tmp_path = tmp.name
    result = model.transcribe(tmp_path)
    os.remove(tmp_path)
    return result["text"]

# --- Main App ---
def main():
    st.set_page_config(page_title="GT Semi-Final | War Room", layout="wide", page_icon="📱")

    # Session State
    if "stage" not in st.session_state: st.session_state.stage = "setup"
    if "team_scores" not in st.session_state: st.session_state.team_scores = {}
    if "transcript_log" not in st.session_state: st.session_state.transcript_log = []

    # Sidebar Config
    with st.sidebar:
        st.header("⚙️ War Room Config")
        persona = st.radio("AI Persona", ["🔥 Ruthless Board Member", "🛡️ Strategic Coach"])
        input_mode = st.radio("Input Mode", ["🎤 Voice (Multimodal)", "⌨️ Text (Quiet Mode)"], index=1)
        
        st.divider()
        use_mock = st.checkbox("⚡ Fast Mode (Mock AI)", value=True, help="Use simplified logic to skip large model download.")
        
        kb = load_knowledge_base()
        if st.button("Reset Session"):
            st.session_state.stage = "setup"
            st.session_state.team_scores = {}
            st.session_state.transcript_log = []
            st.rerun()

    # Load AI
    llm = init_airllm(mock=use_mock)
    stt_model = None
    if "Voice" in input_mode:
        with st.spinner("Loading Ears (Whisper)..."):
            stt_model = load_whisper_model()

    # --- PHASE 0: TEAM SETUP ---
    if st.session_state.stage == "setup":
        st.title("🚀 GT Presentation - War Room Setup")
        with st.form("team_setup"):
            st.subheader("Assemble Your Squad")
            cols = st.columns(5)
            names = []
            for i, col in enumerate(cols):
                names.append(col.text_input(f"Member {i+1}", f"Member {i+1}"))
            
            if st.form_submit_button("Enter War Room"):
                st.session_state.team = [n for n in names if n]
                st.session_state.stage = "pitch"
                st.rerun()

    # --- PHASE 1: PITCH VERIFICATION ---
    elif st.session_state.stage == "pitch":
        st.title("🎤 Phase 1: Pitch Verification")
        st.caption("Select the slide you are presenting. The AI will verify if you hit the key notes.")

        # Slide Selector
        slide_map = parse_slides(kb['pnotes'])
        current_slide = st.selectbox("📌 Current Audience Slide:", list(slide_map.keys()))
        
        with st.expander("Show Cheatsheet for Speaker"):
            st.markdown(slide_map[current_slide])

        col_input, col_output = st.columns([1, 1])
        
        user_input = ""
        
        with col_input:
            st.subheader("Your Input")
            if "Voice" in input_mode:
                ctx = webrtc_streamer(key="pitch-mic", mode=WebRtcMode.SENDRECV, audio_processor_factory=AudioRecorder)
                if st.button("Analyze Audio Segment"):
                    if ctx.audio_processor:
                        audio = ctx.audio_processor.get_audio_data()
                        if audio is not None:
                            if audio.ndim > 1: audio = audio.mean(axis=1)
                            user_input = transcribe_audio(audio, stt_model)
                            ctx.audio_processor.clear()
            else:
                user_input = st.text_area("Type pitch script segment here...")
                if st.button("Check Text"):
                    pass # Trigger rerender to process

        with col_output:
            st.subheader("AI Verification")
            if user_input:
                st.success(f"**Heard/Read:** {user_input}")
                st.session_state.transcript_log.append(f"[{current_slide}] {user_input}")
                
                with st.spinner("Verifying..."):
                    prompt = f"""
                    Task: Verify if the user mentioned the key stats for the current slide.
                    CONTEXT: {slide_map[current_slide]}
                    INPUT: "{user_input}"
                    
                    OUTPUT: [VALID] or [MISSING...]. Be brief.
                    """
                    feedback = generate_response(llm, prompt, "")
                    st.info(feedback)

        if st.button("Next Phase: Q&A ->"):
            st.session_state.stage = "qna"
            st.rerun()

    # --- PHASE 2: Q&A ---
    elif st.session_state.stage == "qna":
        st.title("🔥 Phase 2: The Inquisition")
        
        target = st.radio("Who is on the hot seat?", st.session_state.team, horizontal=True)
        
        if "current_q" not in st.session_state: st.session_state.current_q = "Ready?"
        
        if st.button("🎲 Throw Curveball"):
            qs = [q for q in kb['questions'].split('\n') if "?" in q]
            st.session_state.current_q = random.choice(qs).replace("**Q:**", "").strip()
            
        st.markdown(f"### Q: {st.session_state.current_q}")
        
        user_answer = ""
        if "Voice" in input_mode:
            ctx_q = webrtc_streamer(key="qna-mic", audio_processor_factory=AudioRecorder)
            if st.button("Evaluate Answer"):
                if ctx_q.audio_processor:
                    audio = ctx_q.audio_processor.get_audio_data()
                    if audio is not None:
                        if audio.ndim > 1: audio = audio.mean(axis=1)
                        user_answer = transcribe_audio(audio, stt_model)
        else:
            user_answer = st.text_area("Your Strategic Answer:")
            if st.button("Evaluate Text"):
                pass

        if user_answer:
            st.write(f"**Answer:** {user_answer}")
            with st.spinner("Grading..."):
                sys_p = SYSTEM_PROMPT_JUDGE if "Ruthless" in persona else SYSTEM_PROMPT_ADVISOR
                final_p = sys_p.format(pnotes=kb['pnotes'], answers=kb['answers'], current_question=st.session_state.current_q)
                feedback = generate_response(llm, final_p, user_answer)
                st.markdown(feedback)
                st.session_state.team_scores[target] = feedback

        if st.button("Finish"):
            st.session_state.stage = "scorecard"
            st.rerun()

    # --- PHASE 3: SCORECARD ---
    elif st.session_state.stage == "scorecard":
        st.title("🏆 Final Verdict")
        st.balloons()
        for t, s in st.session_state.team_scores.items():
            st.write(f"**{t}**")
            st.write(s)
            st.divider()
        st.download_button("Download Transcript", "\n".join(st.session_state.transcript_log))

if __name__ == "__main__":
    main()
