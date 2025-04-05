from flask import Flask, render_template, request, jsonify
import os
import speech_recognition as sr
import shutil
from datetime import datetime
from database import init_db, insert_result
from gtts import gTTS
import parselmouth
import numpy as np

app = Flask(__name__)
UPLOAD_FOLDER = 'user_audio'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure folders exist
os.makedirs('phrases', exist_ok=True)
os.makedirs('user_audio', exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    audio = request.files['audio']
    filename = datetime.now().strftime("%Y%m%d%H%M%S") + '.wav'
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    audio.save(filepath)

    # Speech recognition
    recognizer = sr.Recognizer()
    with sr.AudioFile(filepath) as source:
        audio_data = recognizer.record(source)
        try:
            result = recognizer.recognize_google(audio_data, language='ko-KR')
        except sr.UnknownValueError:
            result = "(Couldn't understand)"
        except sr.RequestError:
            result = "(API error)"

    # Pronunciation accuracy (naive)
    native_text = "안녕하세요"
    accuracy = round(similarity_score(result, native_text) * 100, 2)

    # Intonation using parselmouth (basic)
    pitch_diff = compare_pitch('phrases/annyeonghaseyo.mp3', filepath)

    insert_result(result, accuracy, pitch_diff)

    return jsonify({
        'transcription': result,
        'accuracy': accuracy,
        'pitch_diff': round(pitch_diff, 2)
    })

def similarity_score(s1, s2):
    return len(set(s1) & set(s2)) / max(len(s1), len(s2))

def compare_pitch(file1, file2):
    snd1 = parselmouth.Sound(file1).to_pitch()
    snd2 = parselmouth.Sound(file2).to_pitch()
    f1 = snd1.selected_array['frequency']
    f2 = snd2.selected_array['frequency']
    f1 = f1[f1 > 0]
    f2 = f2[f2 > 0]
    if len(f1) == 0 or len(f2) == 0:
        return 100
    return np.abs(np.mean(f1) - np.mean(f2))

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
import parselmouth
import numpy as np

def compare_pitch(reference_path, user_path):
    """
    Compares the pitch contours of the reference and user audio files.
    Returns a percentage similarity score.
    """
    try:
        ref_snd = parselmouth.Sound(reference_path)
        user_snd = parselmouth.Sound(user_path)

        ref_pitch = ref_snd.to_pitch()
        user_pitch = user_snd.to_pitch()

        # Extract pitch values as numpy arrays
        ref_values = ref_pitch.selected_array['frequency']
        user_values = user_pitch.selected_array['frequency']

        # Remove unvoiced frames (zero values)
        ref_values = ref_values[ref_values > 0]
        user_values = user_values[user_values > 0]

        if len(ref_values) == 0 or len(user_values) == 0:
            return 0  # No voiced data detected

        # Normalize lengths
        min_length = min(len(ref_values), len(user_values))
        ref_values = ref_values[:min_length]
        user_values = user_values[:min_length]

        # Calculate pitch similarity
        pitch_diff = np.abs(ref_values - user_values)
        similarity_score = max(0, 100 - np.mean(pitch_diff))

        return round(similarity_score, 2)

    except Exception as e:
        print("Error in pitch comparison:", e)
        return 0
