CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS videos (
    video_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    credits VARCHAR(100),
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    video_id uuid REFERENCES videos(video_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
    like_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(video_id) ON DELETE CASCADE,
    is_like BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION check_registered_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = NEW.user_id) THEN
        RAISE EXCEPTION 'Only registered users can upload videos.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION validate_video_privacy()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_public = FALSE AND NOT EXISTS (SELECT 1 FROM users WHERE user_id = NEW.user_id) THEN
        RAISE EXCEPTION 'Private videos must be associated with a registered user.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_publish_date()
RETURNS TRIGGER AS $$
BEGIN
    NEW.publish_date := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION to_invert_like()
  RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM likes
    WHERE user_id = NEW.user_id AND video_id = NEW.video_id
  ) THEN
    UPDATE likes
    SET is_like = NOT is_like
    WHERE user_id = NEW.user_id AND video_id = NEW.video_id;
    RETURN NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'before_insert_like_trigger') THEN
            EXECUTE 'CREATE TRIGGER before_insert_like_trigger BEFORE INSERT ON likes FOR EACH ROW EXECUTE FUNCTION to_invert_like()';
        END IF;
    END
$$;

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'check_registered_user_trigger') THEN
            EXECUTE 'CREATE TRIGGER check_registered_user_trigger BEFORE INSERT ON videos FOR EACH ROW EXECUTE FUNCTION check_registered_user()';
        END IF;
    END
$$;

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_publish_date_trigger') THEN
            EXECUTE 'CREATE TRIGGER update_publish_date_trigger BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_publish_date()';
        END IF;
    END
$$;

DO
$$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'validate_video_privacy_trigger') THEN
            EXECUTE 'CREATE TRIGGER validate_video_privacy_trigger BEFORE INSERT OR UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION validate_video_privacy()';
        END IF;
    END
$$;




