-- Script para probar el progreso grupal
-- Este script inserta datos de progreso de ejemplo para otros usuarios
-- Nota: Reemplaza los UUIDs con los valores reales de tu base de datos
-- Para obtener los IDs reales, ejecuta primero:
-- SELECT id, name FROM challenges WHERE type = 'grupal';
-- SELECT id, email FROM auth.users;
-- Ejemplo de inserción de progreso para otros usuarios
-- REEMPLAZA estos UUIDs con los valores reales de tu base de datos
/*
-- Insertamos progreso para el creador del reto (usuario 1)
INSERT INTO progress_entries (challenge_id, user_id, day_number, completed) VALUES 
('CHALLENGE_UUID_AQUI', 'USER_1_UUID_AQUI', 1, true),
('CHALLENGE_UUID_AQUI', 'USER_1_UUID_AQUI', 2, false),
('CHALLENGE_UUID_AQUI', 'USER_1_UUID_AQUI', 3, true);

-- Insertamos progreso para el segundo participante (usuario 2)
INSERT INTO progress_entries (challenge_id, user_id, day_number, completed) VALUES 
('CHALLENGE_UUID_AQUI', 'USER_2_UUID_AQUI', 1, true),
('CHALLENGE_UUID_AQUI', 'USER_2_UUID_AQUI', 2, true),
('CHALLENGE_UUID_AQUI', 'USER_2_UUID_AQUI', 3, false);

-- Insertamos progreso para el tercer participante (usuario 3)
INSERT INTO progress_entries (challenge_id, user_id, day_number, completed) VALUES 
('CHALLENGE_UUID_AQUI', 'USER_3_UUID_AQUI', 1, false),
('CHALLENGE_UUID_AQUI', 'USER_3_UUID_AQUI', 2, true),
('CHALLENGE_UUID_AQUI', 'USER_3_UUID_AQUI', 3, true);
 */
-- Query para verificar los datos existentes:
SELECT
    c.name as challenge_name,
    c.id as challenge_id,
    u.email as user_email,
    pe.day_number,
    pe.completed,
    pe.completed_at
FROM
    challenges c
    JOIN challenge_participants cp ON c.id = cp.challenge_id
    LEFT JOIN progress_entries pe ON c.id = pe.challenge_id
    AND cp.user_id = pe.user_id
    LEFT JOIN auth.users u ON cp.user_id = u.id
WHERE
    c.type = 'grupal'
ORDER BY
    c.name,
    u.email,
    pe.day_number;

-- Query para verificar el número de participantes por reto:
SELECT
    c.name as challenge_name,
    c.participants as stored_count,
    COUNT(cp.user_id) as actual_count
FROM
    challenges c
    LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
WHERE
    c.type = 'grupal'
GROUP BY
    c.id,
    c.name,
    c.participants;