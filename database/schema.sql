-- RutiGo - MySQL 8.0+
-- Ejecutar con un usuario que pueda crear tablas en la base seleccionada.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS municipalities (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL DEFAULT 'Atlántico',
    latitude DECIMAL(9,6) NULL,
    longitude DECIMAL(9,6) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uq_municipalities_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NULL,
    auth_provider ENUM('local', 'google', 'apple') NOT NULL DEFAULT 'local',
    provider_subject VARCHAR(255) NULL,
    role ENUM('tourist', 'admin') NOT NULL DEFAULT 'tourist',
    status ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
    home_city VARCHAR(100) NULL,
    avatar_url VARCHAR(1000) NULL,
    blocked_at DATETIME(3) NULL,
    blocked_by BIGINT UNSIGNED NULL,
    block_reason VARCHAR(500) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    last_login_at DATETIME(3) NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    UNIQUE KEY uq_users_provider_subject (auth_provider, provider_subject),
    KEY idx_users_status_role (status, role),
    CONSTRAINT fk_users_home_city FOREIGN KEY (home_city) REFERENCES municipalities (name) ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_users_blocked_by FOREIGN KEY (blocked_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS places (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    municipality_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(180) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('cultura', 'gastronomia', 'naturaleza', 'historia') NOT NULL,
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    address VARCHAR(255) NULL,
    schedule VARCHAR(255) NULL,
    estimated_time VARCHAR(80) NULL,
    tag VARCHAR(100) NULL,
    price_note VARCHAR(255) NULL,
    average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    review_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    deleted_at DATETIME(3) NULL,
    PRIMARY KEY (id),
    KEY idx_places_browse (category, municipality_id, deleted_at),
    KEY idx_places_location (latitude, longitude),
    CONSTRAINT fk_places_municipality FOREIGN KEY (municipality_id) REFERENCES municipalities (id),
    CONSTRAINT fk_places_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT chk_places_rating CHECK (average_rating >= 0 AND average_rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS place_images (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    place_id BIGINT UNSIGNED NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    alt_text VARCHAR(255) NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_place_images_order (place_id, sort_order),
    CONSTRAINT fk_place_images_place FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS routes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(180) NOT NULL,
    subtitle VARCHAR(255) NULL,
    description TEXT NOT NULL,
    category ENUM('cultura', 'gastronomia', 'naturaleza', 'historia') NOT NULL,
    duration_estimate VARCHAR(80) NULL,
    distance_km DECIMAL(8,2) NULL,
    difficulty ENUM('facil', 'moderado', 'avanzado') NOT NULL DEFAULT 'facil',
    cover_image_url VARCHAR(1000) NULL,
    price_suggested VARCHAR(255) NULL,
    tips TEXT NULL,
    average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    review_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_by BIGINT UNSIGNED NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    deleted_at DATETIME(3) NULL,
    PRIMARY KEY (id),
    KEY idx_routes_browse (category, deleted_at),
    CONSTRAINT fk_routes_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT chk_routes_rating CHECK (average_rating >= 0 AND average_rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS route_places (
    route_id BIGINT UNSIGNED NOT NULL,
    place_id BIGINT UNSIGNED NOT NULL,
    stop_order SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (route_id, place_id),
    UNIQUE KEY uq_route_stop_order (route_id, stop_order),
    CONSTRAINT fk_route_places_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE,
    CONSTRAINT fk_route_places_place FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS route_municipalities (
    route_id BIGINT UNSIGNED NOT NULL,
    municipality_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (route_id, municipality_id),
    CONSTRAINT fk_route_municipalities_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE,
    CONSTRAINT fk_route_municipalities_municipality FOREIGN KEY (municipality_id) REFERENCES municipalities (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS route_highlights (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    route_id BIGINT UNSIGNED NOT NULL,
    highlight VARCHAR(255) NOT NULL,
    sort_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY idx_route_highlights_order (route_id, sort_order),
    CONSTRAINT fk_route_highlights_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_favorites (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    place_id BIGINT UNSIGNED NULL,
    route_id BIGINT UNSIGNED NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    UNIQUE KEY uq_favorites_user_place (user_id, place_id),
    UNIQUE KEY uq_favorites_user_route (user_id, route_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_place FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE CASCADE,
    CONSTRAINT chk_favorite_target CHECK ((place_id IS NOT NULL AND route_id IS NULL) OR (place_id IS NULL AND route_id IS NOT NULL))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    place_id BIGINT UNSIGNED NULL,
    route_id BIGINT UNSIGNED NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT NOT NULL,
    photo_url VARCHAR(1000) NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    deleted_at DATETIME(3) NULL,
    PRIMARY KEY (id),
    KEY idx_reviews_place (place_id, deleted_at, created_at),
    KEY idx_reviews_route (route_id, deleted_at, created_at),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_place FOREIGN KEY (place_id) REFERENCES places (id) ON DELETE RESTRICT,
    CONSTRAINT fk_reviews_route FOREIGN KEY (route_id) REFERENCES routes (id) ON DELETE RESTRICT,
    CONSTRAINT chk_reviews_target CHECK ((place_id IS NOT NULL AND route_id IS NULL) OR (place_id IS NULL AND route_id IS NOT NULL)),
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('new_route', 'review_reply', 'recommendation') NOT NULL,
    title VARCHAR(180) NOT NULL,
    body VARCHAR(500) NOT NULL,
    related_type ENUM('place', 'route', 'review') NULL,
    related_id BIGINT UNSIGNED NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_notifications_user_read (user_id, is_read, created_at),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    admin_user_id BIGINT UNSIGNED NOT NULL,
    action VARCHAR(80) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id BIGINT UNSIGNED NULL,
    details JSON NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (id),
    KEY idx_audit_entity (entity_type, entity_id, created_at),
    KEY idx_audit_admin (admin_user_id, created_at),
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_user_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO municipalities (name, latitude, longitude) VALUES
    ('Puerto Colombia', 10.988200, -74.955400),
    ('Barranquilla', 10.968500, -74.781300),
    ('Usiacurí', 10.743100, -74.954200),
    ('Baranoa', 10.795100, -74.912400),
    ('Tubará', 10.876500, -74.975400),
    ('Piojó', 10.748500, -75.109800),
    ('Galapa', 10.898700, -74.887600),
    ('Luruaco', 10.612100, -75.143200),
    ('Polonuevo', 10.778900, -74.856200),
    ('Soledad', 10.918500, -74.764500)
ON DUPLICATE KEY UPDATE latitude = VALUES(latitude), longitude = VALUES(longitude);

-- No se inserta una contraseña de administrador aquí. Créala desde el backend
-- usando Argon2id o bcrypt y registra la acción en admin_audit_log.