from fastapi import FastAPI,HTTPException
from database import get_connection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://study-notes-f79f26v0c-shreyas-3e85.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from pydantic import BaseModel


class Subject(BaseModel):
    name: str
    code: str
class Note(BaseModel):
    subject_id: int
    title: str
    content: str
@app.get("/subjects")
def get_subjects():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM subjects")

    rows = cursor.fetchall()

    conn.close()

    subjects = []

    for row in rows:
        subjects.append({
            "id": row[0],
            "name": row[1],
            "code": row[2]
        })

    return subjects
@app.post("/subjects")
def create_subject(subject: Subject):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO subjects (name, code) VALUES (?, ?)",
        (subject.name, subject.code)
    )

    conn.commit()
    conn.close()
    new_id = cursor.lastrowid

    conn.close()

    return {
        "id": new_id,
        "name": subject.name,
        "code": subject.code
    }

@app.delete("/subjects/{subject_id}")
def delete_subject(subject_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM subjects WHERE id = ?",
        (subject_id,)
    )

    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Subject not found")

    conn.close()

    return {"message": "Subject deleted successfully"}
@app.post("/notes")
def create_note(note: Note):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO notes (subject_id, title, content)
        VALUES (?, ?, ?)
        """,
        (note.subject_id, note.title, note.content)
    )

    conn.commit()

    new_id = cursor.lastrowid

    conn.close()

    return {
        "id": new_id,
        "subject_id": note.subject_id,
        "title": note.title,
        "content": note.content
    }
@app.get("/notes")
def get_notes():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM notes")

    rows = cursor.fetchall()

    conn.close()

    notes = []

    for row in rows:
        notes.append({
            "id": row[0],
            "subject_id": row[1],
            "title": row[2],
            "content": row[3]
        })

    return notes
@app.put("/notes/{note_id}")
def update_note(note_id: int, note: Note):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE notes
        SET subject_id=?, title=?, content=?
        WHERE id=?
        """,
        (note.subject_id, note.title, note.content, note_id)
    )

    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Note not found")

    conn.close()

    return {"message": "Note updated successfully"}
@app.delete("/notes/{note_id}")
def delete_note(note_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM notes WHERE id = ?",
        (note_id,)
    )

    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Note not found")

    conn.close()

    return {"message": "Note deleted successfully"}