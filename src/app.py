import os
import tempfile
import re
from flask import Flask, request, jsonify, send_file, render_template
from dotenv import load_dotenv
from openai import OpenAI
from gtts import gTTS

# Whisper (faster-whisper)
try:
    from faster_whisper import WhisperModel
except Exception as e:
    raise RuntimeError(
        "faster-whisper not installed or failed to import. Run: pip install faster-whisper"
    ) from e

load_dotenv()
app = Flask(__name__)

# --- OpenAI client for chat generation (text only) ---
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_KEY:
    raise RuntimeError("Set OPENAI_API_KEY in your environment or .env")
client = OpenAI(api_key=OPENAI_KEY)

# --- Load WhisperModel once at startup ---
WHISPER_MODEL_NAME = "small"
whisper_device = "cpu"  # change to "cuda" if you have GPU
print("Loading Whisper model...")
whisper_model = WhisperModel(WHISPER_MODEL_NAME, device=whisper_device)
print("Whisper model loaded.")

# ---------------- Helper Functions ----------------

def transcribe_with_whisper(file_path):
    segments, info = whisper_model.transcribe(file_path, beam_size=5)
    text = " ".join([seg.text for seg in segments]).strip()
    return text

def get_bilingual_reply(user_message):
    system_msg = (
        "You are Nabha Health Bot for Nabha Civil Hospital. Help patients understand symptoms simply.\n\n"
        "For symptoms like headache, fever, cough:\n"
        "1. Explain the symptom briefly.\n"
        "2. List 2-3 common causes simply.\n"
        "3. Say: 'Please consult our healthcare professional.'\n\n"
        "Respond in TWO sections:\n"
        "Punjabi: <Punjabi reply>\n\n"
        "English: <English reply>\n\n"
        "Keep responses short and friendly. No treatment advice."
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_message}
        ],
        max_tokens=300,
        temperature=0.7
    )
    return response.choices[0].message.content.strip()

def parse_bilingual(text):
    punjabi = ""
    english = ""
    m_pa = re.search(r"Punjabi\s*:\s*(.*?)(?=English\s*:|$)", text, flags=re.S | re.I)
    m_en = re.search(r"English\s*:\s*(.*)$", text, flags=re.S | re.I)

    if m_pa:
        punjabi = m_pa.group(1).strip()
    if m_en:
        english = m_en.group(1).strip()

    if not punjabi and not english:
        parts = text.split("\n\n")
        if len(parts) >= 2:
            punjabi = parts[0].strip()
            english = parts[1].strip()
        else:
            punjabi = text
            english = text

    return punjabi, english

def make_punjabi_audio(text):
    tts = gTTS(text=text, lang="pa")
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tmp_path = tmp.name
    tmp.close()
    tts.save(tmp_path)
    return tmp_path

# ---------------- Routes ----------------

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json() or {}
    user_message = data.get("message", "").strip()
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # --- Initial Prompt Case ---
    if user_message == "InitialPrompt":
        reply_text = (
            "Punjabi: ਕੀ ਤੁਹਾਨੂੰ ਜ਼ੁਕਾਮ, ਖੰਘ ਜਾਂ ਬੁਖਾਰ ਹੈ? "
            "ਕਿੰਨੇ ਘੰਟਿਆਂ ਜਾਂ ਦਿਨਾਂ ਤੋਂ ਤੁਸੀਂ ਇਸ ਨੂੰ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ? "
            "ਆਪਣੀ ਆਖ਼ਰੀ ਖੁਰਾਕ ਵਿੱਚ ਕੀ ਖਾਧਾ ਸੀ? ਜੇ ਹੋਰ ਕੋਈ ਸਮੱਸਿਆ ਹੈ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ।\n\n"
            "English: Do you have cold, cough, or fever? "
            "For how many days or hours have you been experiencing it? "
            "What food did you take in your last meal? If you have any other problem, please tell me."
        )

        try:
            audio_path = make_punjabi_audio(
                "ਕੀ ਤੁਹਾਨੂੰ ਜ਼ੁਕਾਮ, ਖੰਘ ਜਾਂ ਬੁਖਾਰ ਹੈ? "
                "ਕਿੰਨੇ ਘੰਟਿਆਂ ਜਾਂ ਦਿਨਾਂ ਤੋਂ ਤੁਸੀਂ ਇਸ ਨੂੰ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ? "
                "ਆਪਣੀ ਆਖ਼ਰੀ ਖੁਰਾਕ ਵਿੱਚ ਕੀ ਖਾਧਾ ਸੀ? ਜੇ ਹੋਰ ਕੋਈ ਸਮੱਸਿਆ ਹੈ ਤਾਂ ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ।"
            )
        except Exception as e:
            return jsonify({"error": f"TTS error: {e}", "reply": reply_text}), 500

        return jsonify({
            "reply": reply_text,
            "audio_url": f"/audio?file={audio_path}"
        })

    # --- Normal Chatbot Case ---
    try:
        full_reply = get_bilingual_reply(user_message)
    except Exception as e:
        print(f"OpenAI Error: {e}")  # Debug logging
        # Fallback response if OpenAI fails
        full_reply = "Punjabi: ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਲਈ ਇੱਥੇ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਦੱਸੋ।\n\nEnglish: I'm here to help you. Please tell me about your symptoms."

    punjabi_text, english_text = parse_bilingual(full_reply)

    try:
        audio_path = make_punjabi_audio(punjabi_text)
    except Exception as e:
        return jsonify({"error": f"TTS error: {e}", "reply": full_reply}), 500

    return jsonify({
        "reply": f"Punjabi: {punjabi_text}\n\nEnglish: {english_text}",
        "audio_url": f"/audio?file={audio_path}"
    })

@app.route("/voice", methods=["POST"])
def voice():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    f = request.files["file"]
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(f.filename)[1] or ".wav")
    tmp_path = tmp.name
    tmp.close()
    f.save(tmp_path)

    try:
        text = transcribe_with_whisper(tmp_path)
    except Exception as e:
        return jsonify({"error": f"Transcription failed: {e}"}), 500

    return jsonify({"transcribed_text": text})

@app.route("/audio")
def get_audio():
    file = request.args.get("file")
    if not file or not os.path.exists(file):
        return jsonify({"error": "audio not found"}), 404
    return send_file(file, mimetype="audio/mpeg")

# ---------------- Run ----------------
if __name__ == "__main__":
    print("Starting app. Whisper on:", whisper_device)
    app.run(debug=True)
