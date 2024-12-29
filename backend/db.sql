CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL, 
    username TEXT NOT NULL UNIQUE, 
    hash TEXT NOT NULL
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY NOT NULL, 
    user_id TEXT NOT NULL, 
    level INTEGER NOT NULL, 
    is_super_user BOOLEAN,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY NOT NULL, 
    account_id INTEGER NOT NULL, 
    exercise_id TEXT NOT NULL,
    wpm_record INTEGER NOT NULL, 
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id),
    CONSTRAINT fk_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- id format
-- e.j '1fml42-1:1'
-- 1 = level to which the exercise corresponds
-- f = First alphabetic character with which the content begins
-- m = The 10th alphabetic character of the content (without counting spaces or punctuation marks)
-- l = Last alphabetic character with which the content ends
-- 42 = Total number of characters the content has
-- -1 = Exercise Number
CREATE TABLE exercises (
    id TEXT PRIMARY KEY NOT NULL UNIQUE,
    level INTEGER NOT NULL,
    exercise_number INTEGER NOT NULL,
    content TEXT ARRAY NOT NULL,
    char_length INTEGER ARRAY NOT NULL
);

INSERT INTO users (id, username, hash) VALUES (1, 'Jorge', 'jorge123'),(2, 'Victor', 'victor123'),(3, 'Mario', 'mario123');

INSERT INTO accounts (user_id, level, exercises_completed) VALUES ('cf99d7ff-31bf-4403-97ba-cf0b0d768381', 1, ARRAY['1Tes112-1', '1Tek102-2']);

INSERT INTO exercises (id, level, exercise_number, content, char_length) VALUES (
    '1Tss112-1', 
    1, 
    1, 
    {
        'The sun sets slowly over the horizon, casting a warm glow across the landscape. Birds chirp softly in the trees.', 
        'The book sat on the shelf, untouched for years. It was covered in dust and forgotten by everyone who walked by.', 
        'She walked down the quiet street, listening to the leaves rustle in the gentle breeze. It was a peaceful evening.'
    }, 
    {112, 111, 113});

INSERT INTO scores (account_id, exercise_id, wpm_record) VALUES (1, '1Tes112-1', 35);

-- update completed exercises array
UPDATE accounts SET exercises_completed = ARRAY['abc123', 'xyz123'] WHERE id = 2;

-- Get all scores from a given account joinning exercises table to get the level and exercise_number and order by level, exercise_number
SELECT scores.id, exercise_id, exercises.level, exercises.exercise_number FROM scores JOIN exercises ON scores.exercise_id = exercises.id WHERE account_id = 1 ORDER BY exercises.level, exercises.exercise_number;