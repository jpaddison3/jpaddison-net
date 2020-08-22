-- Your SQL goes here
CREATE TABLE guest_entries (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    public INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL
);
