CREATE TABLE saved_topics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    project_type TEXT NOT NULL,
    domain TEXT NOT NULL,
    client TEXT NOT NULL,
    challenge TEXT NOT NULL,
    deliverables TEXT[] NOT NULL,
    difficulty TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

