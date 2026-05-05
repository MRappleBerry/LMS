-- Subject-based monetization schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  user_id TEXT NOT NULL,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'cancelled')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subject ON user_subscriptions(subject_id);

-- Google-authenticated users (payment-ready)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  google_id TEXT UNIQUE,
  avatar_url TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due')),
  active_subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- Weekly law challenge gamification schema
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  duration_seconds INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weekly_challenge_questions (
  id TEXT PRIMARY KEY,
  challenge_id TEXT NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('bar', 'case', 'concept')),
  prompt TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  ordinal INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS weekly_challenge_choices (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES weekly_challenge_questions(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS weekly_challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  answers JSONB NOT NULL,
  anomaly_flag BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_weekly_submissions_challenge ON weekly_challenge_submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_weekly_submissions_user ON weekly_challenge_submissions(user_id);

CREATE OR REPLACE VIEW weekly_leaderboard AS
SELECT
  challenge_id,
  user_id,
  score,
  time_taken_seconds,
  RANK() OVER (
    PARTITION BY challenge_id
    ORDER BY score DESC, time_taken_seconds ASC, created_at ASC
  ) AS rank_position
FROM weekly_challenge_submissions;

-- Ranked 1v1 matchmaking schema
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating INTEGER NOT NULL DEFAULT 1000;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rank TEXT NOT NULL DEFAULT 'Scholar I';
ALTER TABLE users ADD COLUMN IF NOT EXISTS wins INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS losses INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS draws INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS ranked_questions (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  choices JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ranked_matches (
  id TEXT PRIMARY KEY,
  player1_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  player2_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  result TEXT NOT NULL CHECK (result IN ('player1_win', 'player2_win', 'draw')),
  player1_score INTEGER NOT NULL,
  player2_score INTEGER NOT NULL,
  player1_time_ms INTEGER NOT NULL,
  player2_time_ms INTEGER NOT NULL,
  player1_rating_before INTEGER NOT NULL,
  player2_rating_before INTEGER NOT NULL,
  player1_rating_after INTEGER NOT NULL,
  player2_rating_after INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ranked_match_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_id TEXT NOT NULL REFERENCES ranked_matches(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  time_used_ms INTEGER NOT NULL,
  anomaly_flag BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, match_id)
);

CREATE INDEX IF NOT EXISTS idx_ranked_matches_created_at ON ranked_matches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ranked_matches_player1 ON ranked_matches(player1_id);
CREATE INDEX IF NOT EXISTS idx_ranked_matches_player2 ON ranked_matches(player2_id);
CREATE INDEX IF NOT EXISTS idx_ranked_answers_user ON ranked_match_answers(user_id);
