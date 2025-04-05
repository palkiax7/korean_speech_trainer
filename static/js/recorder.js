let mediaRecorder;
let audioChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = uploadAudio;
            mediaRecorder.start();
        });
}

function stopRecording() {
    mediaRecorder.stop();
}

function uploadAudio() {
    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    fetch('/upload', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            document.getElementById("transcription").innerText = data.transcription;
            document.getElementById("accuracy").innerText = data.accuracy;
            document.getElementById("pitch").innerText = data.pitch_diff;
        });

    audioChunks = [];
}