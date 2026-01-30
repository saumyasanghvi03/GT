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
from utils import init_airllm, load_knowledge_base, generate_response, parse_slides
from prompts import SYSTEM_PROMPT_JUDGE, SYSTEM_PROMPT_ADVISOR

# ... [Keep AudioRecorder and other unrelated parts the same] ...

    # --- PHASE 1: PITCH VERIFICATION ---
    elif st.session_state.stage == "pitch":
        st.title("🎤 Phase 1: The Pitch")
        
        # Slide Selector
        slide_map = parse_slides(kb['pnotes'])
        slide_keys = list(slide_map.keys())
        current_slide = st.selectbox("📌 Current Audience Slide:", slide_keys, index=0)
        
        st.info("Deliver your presentation slide by slide. The AI is listening for key data points from the selected slide.")
        
        col_video, col_context = st.columns([1, 1])
        
        with col_video:
            st.write("### Camera Feed")
            ctx = webrtc_streamer(
                key="speech-recognition",
                mode=WebRtcMode.SENDRECV,
                audio_processor_factory=AudioRecorder,
                media_stream_constraints={"video": True, "audio": True},
            )

        with col_context:
            st.write(f"### Live Analysis: {current_slide}")
            
            # Show hints for the speaker
            with st.expander("Show Cheatsheet for this Slide"):
                st.markdown(slide_map[current_slide])

            status_box = st.empty()
            transcription_box = st.empty()
            
            if ctx.audio_processor:
                if st.button("Analyze Last Segment"):
                    status_box.info("Transcribing...")
                    audio_data = ctx.audio_processor.get_audio_data()
                    
                    if audio_data is not None:
                        # Process audio (flattening stereo to mono logic simplified)
                        if audio_data.ndim > 1:
                            audio_data = audio_data.mean(axis=1)
                        
                        text = transcribe_audio(audio_data, stt_model)
                        ctx.audio_processor.clear() # Clear buffer after reading
                        
                        transcription_box.success(f"**Heard:** {text}")
                        st.session_state.transcript_log.append(f"[{current_slide}] {text}")
                        
                        # AI Verification
                        status_box.info("Verifying against Slide Notes...")
                        verify_prompt = f"""
                        Task: Verify if the user mentioned the key stats for the current slide.
                        
                        TARGET SLIDE CONTENT:
                        {slide_map[current_slide]}
                        
                        USER SPOKEN TEXT:
                        "{text}"
                        
                        INSTRUCTIONS:
                        1. Did they cover the main "Hook" or "Data Points"?
                        2. If yes, output [VALID].
                        3. If no, output [MISSING] and state exactly what number/phrase was left out.
                        4. Keep it brief.
                        """
                        feedback = generate_response(llm, verify_prompt, "")
                        st.write(feedback)
                    else:
                        st.warning("No audio data captured yet. Speak up!")

        if st.button("Move to Q&A Round ->"):
            st.session_state.stage = "qna"
            st.rerun()

    # --- PHASE 2: Q&A INTERROGATION ---
    elif st.session_state.stage == "qna":
        st.title("🔥 Phase 2: The Inquisition")
        
        # Select Target
        target = st.radio("Who is on the hot seat?", st.session_state.team, horizontal=True)
        
        # Generate Question
        if "current_q" not in st.session_state:
            st.session_state.current_q = "Press 'Generate Question' to start."
            
        if st.button("🎲 Throw Curveball"):
            # Pick random q from KB
            import random
            qs = [q for q in kb['questions'].split('\n') if "?" in q]
            if qs:
                st.session_state.current_q = random.choice(qs).replace("**Q:**", "").strip()
        
        st.markdown(f"### Q for {target}:")
        st.markdown(f"> ## {st.session_state.current_q}")
        
        # Recording Reponse
        st.write("### Record Answer")
        ctx_qna = webrtc_streamer(
            key="qna-feed",
            audio_processor_factory=AudioRecorder,
            media_stream_constraints={"video": True, "audio": True},
        )
        
        if st.button("Evaluate Answer"):
             if ctx_qna.audio_processor:
                audio_data = ctx_qna.audio_processor.get_audio_data()
                if audio_data is not None:
                    if audio_data.ndim > 1: audio_data = audio_data.mean(axis=1)
                    answer_text = transcribe_audio(audio_data, stt_model)
                    st.write(f"**Answer:** {answer_text}")
                    
                    # AI Grading
                    grading_prompt = f"""
                    Role: Board Member.
                    Question: {st.session_state.current_q}
                    User Answer: {answer_text}
                    Strategy: {kb['answers']}
                    
                    Grade this answer (1-10) and explain why based on the strategy.
                    """
                    grade = generate_response(llm, grading_prompt, "")
                    st.markdown(grade)
                    
                    # Store Score
                    st.session_state.team_scores[target] = grade
                else:
                    st.error("No audio detected.")

        if st.button("Finish Session"):
            st.session_state.stage = "scorecard"
            st.rerun()

    # --- PHASE 3: SCORECARD ---
    elif st.session_state.stage == "scorecard":
        st.title("🏆 Final Verdict")
        st.balloons()
        
        st.write("### Session Summary")
        for member, score in st.session_state.team_scores.items():
            st.write(f"**{member}**: {score} score")
            
        st.download_button("Download Transcript", "\n".join(st.session_state.transcript_log))
        
        if st.button("Start New Session"):
            st.session_state.stage = "setup"
            st.rerun()

if __name__ == "__main__":
    main()
