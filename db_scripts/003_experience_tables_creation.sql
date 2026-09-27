CREATE TABLE experience_conversations (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    topic_id INTEGER NOT NULL,

    title TEXT NOT NULL,
    project_type TEXT NOT NULL,
    domain TEXT NOT NULL,
    client TEXT NOT NULL,
    challenge TEXT NOT NULL,
    deliverables TEXT[] NOT NULL,
    difficulty TEXT NOT NULL,

    status TEXT NOT NULL DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);


CREATE TABLE experience_messages (
    id SERIAL PRIMARY KEY,

    conversation_id INTEGER NOT NULL
        REFERENCES experience_conversations(id)
        ON DELETE CASCADE,

    sender TEXT NOT NULL,

    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE experience_files (
    id SERIAL PRIMARY KEY,

    conversation_id INTEGER NOT NULL
        REFERENCES experience_conversations(id)
        ON DELETE CASCADE,

    message_id INTEGER NOT NULL
        REFERENCES experience_messages(id)
        ON DELETE CASCADE,

    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,

    resource_type TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);