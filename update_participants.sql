-- Script para actualizar el número real de participantes en los retos existentes
-- Este script cuenta los participantes reales desde la tabla challenge_participants
-- y actualiza el campo participants en la tabla challenges

-- Update challenges with real participant count
UPDATE challenges 
SET participants = (
    SELECT COUNT(*)
    FROM challenge_participants 
    WHERE challenge_participants.challenge_id = challenges.id
)
WHERE id IN (
    SELECT DISTINCT challenge_id 
    FROM challenge_participants
);

-- For challenges without any participants in challenge_participants table,
-- ensure they have at least 1 participant (the creator)
UPDATE challenges 
SET participants = 1
WHERE participants = 0 OR participants IS NULL;

-- Create a function to automatically update participant count when someone joins/leaves
CREATE OR REPLACE FUNCTION update_challenge_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the participant count for the affected challenge
    UPDATE challenges 
    SET participants = (
        SELECT COUNT(*)
        FROM challenge_participants 
        WHERE challenge_id = COALESCE(NEW.challenge_id, OLD.challenge_id)
    )
    WHERE id = COALESCE(NEW.challenge_id, OLD.challenge_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update participant count
DROP TRIGGER IF EXISTS trigger_update_participant_count_on_insert ON challenge_participants;
DROP TRIGGER IF EXISTS trigger_update_participant_count_on_delete ON challenge_participants;

CREATE TRIGGER trigger_update_participant_count_on_insert
    AFTER INSERT ON challenge_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_challenge_participant_count();

CREATE TRIGGER trigger_update_participant_count_on_delete
    AFTER DELETE ON challenge_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_challenge_participant_count();
