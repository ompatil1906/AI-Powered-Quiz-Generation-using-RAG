import sqlite3
import os
import secrets
import hashlib
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "quiz_studio.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            hashed_password TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    # Quiz History Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS quiz_history (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            lesson_id TEXT NOT NULL,
            question_count INTEGER NOT NULL,
            difficulty TEXT NOT NULL,
            bloom_taxonomy TEXT NOT NULL,
            question_types TEXT NOT NULL,
            quiz_data TEXT NOT NULL,
            rag_stats TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    conn.commit()

    # Seed Default Demo User if not exists
    cursor.execute("SELECT id FROM users WHERE email = ?", ("demo@learnyst.com",))
    if not cursor.fetchone():
        salt = secrets.token_hex(8)
        hashed = hashlib.sha256(("password123" + salt).encode('utf-8')).hexdigest()
        now_str = datetime.now().isoformat()
        cursor.execute("""
            INSERT INTO users (id, email, full_name, hashed_password, salt, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, ("usr-demo-101", "demo@learnyst.com", "Demo Assessor", hashed, salt, now_str))
        conn.commit()

    conn.close()

# Initialize DB structure on import
init_db()
