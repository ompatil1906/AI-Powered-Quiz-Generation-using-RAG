import hashlib
import json
import secrets
from datetime import datetime
from typing import Dict, List
from app.models.schemas import UserRegisterRequest, UserLoginRequest
from app.db.database import get_db_connection

class AuthService:
    def _hash_password(self, password: str, salt: str = None) -> tuple:
        if not salt:
            salt = secrets.token_hex(8)
        hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
        return hashed, salt

    def register_user(self, req: UserRegisterRequest) -> Dict:
        email = req.email.strip().lower()
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            conn.close()
            raise ValueError("An account with this email address already exists.")

        hashed, salt = self._hash_password(req.password)
        user_id = f"usr-{secrets.token_hex(6)}"
        created_at = datetime.now().isoformat()

        cursor.execute("""
            INSERT INTO users (id, email, full_name, hashed_password, salt, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, email, req.fullName.strip(), hashed, salt, created_at))
        conn.commit()
        conn.close()

        token = f"token_{user_id}_{secrets.token_hex(12)}"
        return {
            "token": token,
            "user": {
                "id": user_id,
                "email": email,
                "fullName": req.fullName.strip(),
                "createdAt": created_at
            }
        }

    def login_user(self, req: UserLoginRequest) -> Dict:
        email = req.email.strip().lower()
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user_row = cursor.fetchone()
        conn.close()

        if not user_row:
            raise ValueError("Invalid email or password.")

        user_dict = dict(user_row)
        hashed, _ = self._hash_password(req.password, user_dict["salt"])
        if hashed != user_dict["hashed_password"]:
            raise ValueError("Invalid email or password.")

        token = f"token_{user_dict['id']}_{secrets.token_hex(12)}"
        return {
            "token": token,
            "user": {
                "id": user_dict["id"],
                "email": user_dict["email"],
                "fullName": user_dict["full_name"],
                "createdAt": user_dict["created_at"]
            }
        }

    def save_history_entry(self, user_id: str, lesson_id: str, config: dict, quiz: list, rag_stats: dict) -> Dict:
        entry_id = f"quiz-hist-{int(datetime.now().timestamp()*1000)}"
        now_str = datetime.now().isoformat()
        
        difficulty = config.get("difficulty", "medium") if config else "medium"
        bloom_taxonomy = config.get("bloomTaxonomy", "Remembering") if config else "Remembering"
        question_types = json.dumps(config.get("questionTypes", ["mcq"]) if config else ["mcq"])
        quiz_data_str = json.dumps(quiz)
        rag_stats_str = json.dumps(rag_stats) if rag_stats else None

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO quiz_history (id, user_id, lesson_id, question_count, difficulty, bloom_taxonomy, question_types, quiz_data, rag_stats, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (entry_id, user_id, lesson_id, len(quiz), difficulty, bloom_taxonomy, question_types, quiz_data_str, rag_stats_str, now_str))
        conn.commit()
        conn.close()

        return {
            "id": entry_id,
            "userId": user_id,
            "timestamp": now_str,
            "lessonId": lesson_id,
            "questionCount": len(quiz),
            "difficulty": difficulty,
            "bloomTaxonomy": bloom_taxonomy,
            "questionTypes": json.loads(question_types),
            "quiz": quiz,
            "ragStats": rag_stats
        }

    def get_user_history(self, user_id: str) -> List[Dict]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM quiz_history WHERE user_id = ? ORDER BY created_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        conn.close()

        items = []
        for r in rows:
            rd = dict(r)
            items.append({
                "id": rd["id"],
                "userId": rd["user_id"],
                "timestamp": rd["created_at"],
                "lessonId": rd["lesson_id"],
                "questionCount": rd["question_count"],
                "difficulty": rd["difficulty"],
                "bloomTaxonomy": rd["bloom_taxonomy"],
                "questionTypes": json.loads(rd["question_types"]) if rd["question_types"] else ["mcq"],
                "quiz": json.loads(rd["quiz_data"]) if rd["quiz_data"] else [],
                "ragStats": json.loads(rd["rag_stats"]) if rd["rag_stats"] else None
            })
        return items

    def delete_history_entry(self, user_id: str, entry_id: str) -> bool:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM quiz_history WHERE id = ? AND user_id = ?", (entry_id, user_id))
        deleted_count = cursor.rowcount
        conn.commit()
        conn.close()
        return deleted_count > 0

auth_service = AuthService()
