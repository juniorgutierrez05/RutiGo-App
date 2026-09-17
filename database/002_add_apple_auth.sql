-- Ejecutar una sola vez sobre una base RutiGo ya creada.
ALTER TABLE users
    MODIFY COLUMN auth_provider ENUM('local', 'google', 'apple') NOT NULL DEFAULT 'local';