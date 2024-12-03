CREATE TABLE users (id SERIAL PRIMARY KEY NOT NULL, username TEXT NOT NULL UNIQUE, hash TEXT NOT NULL)

INSERT INTO users (id, username, hash) VALUES (1, 'Jorge', 'jorge123'),(2, 'Victor', 'victor123'),(3, 'Mario', 'mario123');