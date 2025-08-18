-- =============================================
-- HabitLink Database Schema
-- =============================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create challenges table
CREATE TABLE public.challenges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0),
    type TEXT NOT NULL CHECK (type IN ('individual', 'grupal')),
    emoji TEXT NOT NULL,
    participants INTEGER DEFAULT 1 CHECK (participants >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    share_code TEXT UNIQUE -- Unique code for sharing public challenges
);

-- 3. Create progress_entries table
CREATE TABLE public.progress_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT, -- For anonymous users
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    completed BOOLEAN NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(challenge_id, user_id, day_number), -- Prevent duplicate entries per user per day
    UNIQUE(challenge_id, session_id, day_number) -- Prevent duplicate entries per session per day
);

-- 4. Create challenge_participants table
CREATE TABLE public.challenge_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT, -- For anonymous users
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(challenge_id, user_id), -- Prevent duplicate participants per user
    UNIQUE(challenge_id, session_id) -- Prevent duplicate participants per session
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- Challenges policies
CREATE POLICY "Public challenges are viewable by everyone" 
ON public.challenges FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can insert their own challenges" 
ON public.challenges FOR INSERT 
WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY "Users can update their own challenges" 
ON public.challenges FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own challenges" 
ON public.challenges FOR DELETE 
USING (auth.uid() = created_by);

-- Progress entries policies
CREATE POLICY "Users can view progress for public challenges" 
ON public.progress_entries FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.challenges 
        WHERE challenges.id = progress_entries.challenge_id 
        AND challenges.is_public = true
    )
);

CREATE POLICY "Users can insert their own progress" 
ON public.progress_entries FOR INSERT 
WITH CHECK (
    auth.uid() = user_id OR 
    (user_id IS NULL AND session_id IS NOT NULL)
);

CREATE POLICY "Users can update their own progress" 
ON public.progress_entries FOR UPDATE 
USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND session_id IS NOT NULL)
);

-- Challenge participants policies
CREATE POLICY "Users can view participants for public challenges" 
ON public.challenge_participants FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.challenges 
        WHERE challenges.id = challenge_participants.challenge_id 
        AND challenges.is_public = true
    )
);

CREATE POLICY "Users can join challenges" 
ON public.challenge_participants FOR INSERT 
WITH CHECK (
    auth.uid() = user_id OR 
    (user_id IS NULL AND session_id IS NOT NULL)
);

-- =============================================
-- Indexes for Performance
-- =============================================

CREATE INDEX idx_challenges_created_by ON public.challenges(created_by);
CREATE INDEX idx_challenges_type ON public.challenges(type);
CREATE INDEX idx_challenges_created_at ON public.challenges(created_at DESC);

CREATE INDEX idx_progress_challenge_id ON public.progress_entries(challenge_id);
CREATE INDEX idx_progress_user_id ON public.progress_entries(user_id);
CREATE INDEX idx_progress_session_id ON public.progress_entries(session_id);

CREATE INDEX idx_participants_challenge_id ON public.challenge_participants(challenge_id);
CREATE INDEX idx_participants_user_id ON public.challenge_participants(user_id);

-- =============================================
-- Functions for Business Logic
-- =============================================

-- Function to get challenge progress summary
CREATE OR REPLACE FUNCTION get_challenge_progress(challenge_uuid UUID)
RETURNS TABLE (
    total_days INTEGER,
    completed_days INTEGER,
    completion_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.duration as total_days,
        COALESCE(COUNT(pe.id) FILTER (WHERE pe.completed = true), 0)::INTEGER as completed_days,
        CASE 
            WHEN c.duration = 0 THEN 0
            ELSE ROUND((COALESCE(COUNT(pe.id) FILTER (WHERE pe.completed = true), 0) * 100.0) / c.duration, 2)
        END as completion_percentage
    FROM public.challenges c
    LEFT JOIN public.progress_entries pe ON c.id = pe.challenge_id
    WHERE c.id = challenge_uuid
    GROUP BY c.id, c.duration;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Sample Data (Optional - for testing)
-- =============================================

INSERT INTO public.challenges (id, name, duration, type, emoji, participants, is_public) VALUES
('abc123e4-5678-9012-3456-789012345678', 'Leer 15 minutos diarios', 21, 'grupal', '📚', 24, true),
('def456e4-5678-9012-3456-789012345678', 'Meditar 10 minutos', 14, 'individual', '🧘‍♀️', 1, true),
('ghi789e4-5678-9012-3456-789012345678', 'Beber 2L de agua', 30, 'grupal', '💧', 12, true),
('jkl012e4-5678-9012-3456-789012345678', 'Ejercicio matutino', 7, 'individual', '🏃‍♂️', 1, true);

-- Sample progress data
INSERT INTO public.progress_entries (challenge_id, session_id, day_number, completed) VALUES
('abc123e4-5678-9012-3456-789012345678', 'anonymous_session_1', 1, true),
('abc123e4-5678-9012-3456-789012345678', 'anonymous_session_1', 2, true),
('abc123e4-5678-9012-3456-789012345678', 'anonymous_session_1', 3, false),
('abc123e4-5678-9012-3456-789012345678', 'anonymous_session_1', 4, true);
