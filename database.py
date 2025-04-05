import sqlite3

def init_db():
    conn = sqlite3.connect('speech_trainer.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS results (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 transcript TEXT,
                 accuracy REAL,
                 pitch_diff REAL,
                 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

def insert_result(transcript, accuracy, pitch_diff):
    conn = sqlite3.connect('speech_trainer.db')
    c = conn.cursor()
    c.execute("INSERT INTO results (transcript, accuracy, pitch_diff) VALUES (?, ?, ?)",
              (transcript, accuracy, pitch_diff))
    conn.commit()
    conn.close()