CREATE DATABASE IF NOT EXISTS undersoul_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE undersoul_db;

CREATE TABLE IF NOT EXISTS personajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    raza ENUM('Humano', 'Monstruo') NOT NULL,
    ataque INT NOT NULL DEFAULT 10,
    defensa INT NOT NULL DEFAULT 10,
    vida INT NOT NULL DEFAULT 20,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
