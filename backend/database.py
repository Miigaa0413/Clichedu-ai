import sqlite3

DATABASE = "clichedu.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id INTEGER NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (conversation_id)
            REFERENCES conversations(id)
        )
    """)

    connection.commit()
    connection.close()


def create_conversation():
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO conversations DEFAULT VALUES
    """)

    conversation_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return conversation_id


def save_message(conversation_id, role, content):
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO messages (
            conversation_id,
            role,
            content
        )
        VALUES (?, ?, ?)
    """, (
        conversation_id,
        role,
        content
    ))

    connection.commit()
    connection.close()


def get_messages(conversation_id):
    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT role, content, created_at
        FROM messages
        WHERE conversation_id = ?
        ORDER BY id ASC
    """, (conversation_id,))

    messages = cursor.fetchall()

    connection.close()

    return messages