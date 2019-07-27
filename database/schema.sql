DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  user_id TEXT PRIMARY KEY,
  display_name VARCHAR(255),
  user_handle VARCHAR(255),
  photo_link TEXT,
  token TEXT,
  token_secret TEXT
);

CREATE TABLE goals
(
  goal_id SERIAL PRIMARY KEY,
  goal_user_id TEXT NOT NULL,
  goal_name VARCHAR(255),
  goal_start BIGINT,
  goal_end BIGINT,
  frequency_ms BIGINT,
  FOREIGN KEY(goal_user_id) REFERENCES users(user_id)
);

CREATE TABLE progress
(
  progress_id SERIAL PRIMARY KEY,
  progress_user_id TEXT NOT NULL,
  progress_goal_id INTEGER NOT NULL,
  streak INTEGER DEFAULT 0,
  num_of_completed_goals INTEGER,
  num_of_total_goals INTEGER,
  next_due_date BIGINT,
  FOREIGN KEY(progress_user_id) REFERENCES users(user_id),
  FOREIGN KEY(progress_goal_id) REFERENCES goals(goal_id)
);