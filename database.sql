SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `undersoul_db`;
CREATE DATABASE `undersoul_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `undersoul_db`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------
-- Tabla `categoria`
-- --------------------------------------------------------
CREATE TABLE `categoria` (
  `id_categoria` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_categoria` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `nombre_categoria` (`nombre_categoria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categoria` (`id_categoria`, `nombre_categoria`) VALUES
(1, 'Amigables'),
(2, 'Neutral'),
(3, 'Comunidad'),
(4, 'Originales');

-- --------------------------------------------------------
-- Tabla `usuario`
-- --------------------------------------------------------
CREATE TABLE `usuario` (
  `id_usuario` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre_usuario` VARCHAR(50) NOT NULL,
  `rol` VARCHAR(50) NOT NULL DEFAULT 'Usuario',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuario` (`id_usuario`, `nombre_usuario`, `rol`) VALUES
(1, 'TobyFox_Admin', 'Admin'),
(2, 'PlayerOne', 'Creador');

-- --------------------------------------------------------
-- Tabla `contraseñas`
-- --------------------------------------------------------
CREATE TABLE `contraseñas` (
  `id_contraseñas` INT(11) NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(255) NOT NULL,
  `id_usuario` INT(11) NOT NULL,
  PRIMARY KEY (`id_contraseñas`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `fk_contraseñas_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `contraseñas` (`id_contraseñas`, `codigo`, `id_usuario`) VALUES
(1, 'admin123pass', 1),
(2, 'player456pass', 2);

-- --------------------------------------------------------
-- Tabla `personajes`
-- --------------------------------------------------------
CREATE TABLE `personajes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `apellido` VARCHAR(50) DEFAULT NULL,
  `raza` ENUM('Humano','Monstruo') NOT NULL DEFAULT 'Monstruo',
  `vida` INT(11) NOT NULL DEFAULT 20,
  `ataque` INT(11) NOT NULL DEFAULT 10,
  `defensa` INT(11) NOT NULL DEFAULT 10,
  `sprite_head` VARCHAR(255) DEFAULT NULL,
  `sprite_torso` VARCHAR(255) DEFAULT NULL,
  `sprite_legs` VARCHAR(255) DEFAULT NULL,
  `imagen_url` VARCHAR(255) DEFAULT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `es_comunidad` TINYINT(1) NOT NULL DEFAULT 1,
  `id_usuario` INT(11) DEFAULT NULL,
  `id_categoria` INT(11) DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `fk_personajes_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL,
  CONSTRAINT `fk_personajes_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `personajes` (`id`, `nombre`, `apellido`, `raza`, `vida`, `ataque`, `defensa`, `imagen_url`, `descripcion`, `es_comunidad`, `id_usuario`, `id_categoria`) VALUES
(1, 'Sans', NULL, 'Monstruo', 1, 1, 1, NULL, 'Esqueleto perezoso que ama los chistes malos.', 0, 1, 1),
(2, 'Frisk', NULL, 'Humano', 20, 0, 0, NULL, 'Humano determinado que cayó al Subsuelo.', 0, 1, 1),
(3, 'Asgore', NULL, 'Monstruo', 3500, 80, 80, NULL, 'Rey de todos los monstruos del Subsuelo.', 0, 1, 2),
(4, 'Undyne', NULL, 'Monstruo', 1500, 50, 20, NULL, 'Líder de la Guardia Real.', 0, 1, 2),
(5, 'Flowey', NULL, 'Monstruo', 6000, 19, 0, NULL, 'Una flor parlante manipuladora.', 0, 1, 2),
(6, 'Toriel', NULL, 'Monstruo', 440, 80, 80, NULL, 'Guardiana de las Ruinas.', 0, 1, 1),
(7, 'Alphys', NULL, 'Monstruo', 100, 0, 0, NULL, 'Científica Real del Subsuelo.', 0, 1, 1),
(8, 'Froggit', NULL, 'Monstruo', 30, 4, 4, NULL, 'Monstruo rana básico de las Ruinas.', 0, 1, 2),
(9, 'Mettaton', NULL, 'Monstruo', 9999, 30, 255, NULL, 'Robot estrella de televisión.', 0, 1, 2),
(10, 'Papyrus', NULL, 'Monstruo', 680, 20, 20, NULL, 'Hermano de Sans, busca entrar a la Guardia Real.', 0, 1, 1);

-- --------------------------------------------------------
-- Tabla `detalles_personajes`
-- --------------------------------------------------------
CREATE TABLE `detalles_personajes` (
  `id_personaje` INT(11) NOT NULL,
  `historia_completa` TEXT DEFAULT NULL,
  `musica_tema` VARCHAR(255) DEFAULT NULL,
  `dialogo_clave` TEXT DEFAULT NULL,
  `sprite_combate_url` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id_personaje`),
  CONSTRAINT `fk_detalles_personajes` FOREIGN KEY (`id_personaje`) REFERENCES `personajes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `detalles_personajes` (`id_personaje`, `historia_completa`, `musica_tema`, `dialogo_clave`, `sprite_combate_url`) VALUES
(1, 'Guardián del último corredor. Evalúa tus acciones al final de la ruta.', 'Megalovania', 'vas a pasar un mal rato.', 'https://undersoul.com/sprites/battle/sans.gif'),
(2, 'El primer humano en caer al Subsuelo después de mucho tiempo.', 'Reunited', 'Te mantienes determinado.', 'https://undersoul.com/sprites/battle/frisk.gif'),
(3, 'Rey de los monstruos que busca las 7 almas humanas para romper la barrera.', 'ASGORE', 'Fue un placer conocerte. Adiós.', 'https://undersoul.com/sprites/battle/asgore.gif'),
(4, 'Líder apasionada de la Guardia Real que protege el Subsuelo.', 'Spear of Justice', '¡NGAHHHH!', 'https://undersoul.com/sprites/battle/undyne.gif'),
(5, 'Ser sin alma creado en experimentos con determinación.', 'Your Best Nightmare', 'En este mundo es MATAR o MORIR.', 'https://undersoul.com/sprites/battle/flowey.gif'),
(6, 'Antigua reina y protectora de los humanos que caen a las Ruinas.', 'Fallen Down', 'Sé buena persona, ¿de acuerdo?', 'https://undersoul.com/sprites/battle/toriel.gif'),
(7, 'Científica Real apasionada por el anime y creadora de Mettaton.', 'Alphys', 'I-increíble...', 'https://undersoul.com/sprites/battle/alphys.gif'),
(8, 'Monstruo habitual que habita en las Ruinas.', 'Anticipation', 'Ribbit, ribbit.', 'https://undersoul.com/sprites/battle/froggit.gif'),
(9, 'Robot de entretenimiento fabricado para impresionar al Subsuelo.', 'Metal Crusher', '¡OH YES!', 'https://undersoul.com/sprites/battle/mettaton.gif'),
(10, 'Monstruo entusiasta del espagueti que busca atrapar a un humano.', 'Bonetrousle', 'NYEH HEH HEH!', 'https://undersoul.com/sprites/battle/papyrus.gif');

-- --------------------------------------------------------
-- Tabla `comentarios`
-- --------------------------------------------------------
CREATE TABLE `comentarios` (
  `id_comentario` INT(11) NOT NULL AUTO_INCREMENT,
  `contenido` TEXT NOT NULL,
  `fecha_publicacion` DATETIME DEFAULT CURRENT_TIMESTAMP(),
  `nombre_autor` VARCHAR(50) NOT NULL,
  `id_personaje` INT(11) NOT NULL,
  PRIMARY KEY (`id_comentario`),
  KEY `id_personaje` (`id_personaje`),
  CONSTRAINT `fk_comentarios_personaje` FOREIGN KEY (`id_personaje`) REFERENCES `personajes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `comentarios` (`id_comentario`, `contenido`, `fecha_publicacion`, `nombre_autor`, `id_personaje`) VALUES
(1, '¡El combate contra Sans en la ruta genocida es increíble!', '2026-09-02 10:00:00', 'PlayerOne', 1),
(2, 'La música de Megalovania es la mejor de todo el juego.', '2026-09-02 11:30:00', 'PlayerOne', 1),
(3, 'Frisk es el protagonista ideal para la historia.', '2026-09-02 12:00:00', 'PlayerOne', 2),
(4, 'Asgore es un personaje incomprendido pero muy trágico.', '2026-09-02 13:15:00', 'PlayerOne', 3),
(5, 'Undyne tiene la mejor batalla de la ruta neutral.', '2026-09-02 14:00:00', 'PlayerOne', 4),
(6, 'Flowey da bastante miedo al principio.', '2026-09-02 15:20:00', 'PlayerOne', 5),
(7, 'Toriel te hace sentir como en casa en las Ruinas.', '2026-09-02 16:10:00', 'PlayerOne', 6),
(8, 'Alphys y sus referencias al anime son muy graciosas.', '2026-09-02 17:00:00', 'PlayerOne', 7),
(9, 'Mettaton EX tiene el mejor diseño de combate.', '2026-09-02 18:05:00', 'PlayerOne', 9),
(10, 'Papyrus es el personaje más divertido de todo el juego.', '2026-09-02 19:30:00', 'PlayerOne', 10);

-- --------------------------------------------------------
-- Tabla `ropa_items`
-- --------------------------------------------------------
CREATE TABLE `ropa_items` (
  `id_item` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  `tipo_slot` VARCHAR(20) NOT NULL,
  `sprite_item_url` VARCHAR(255) DEFAULT NULL,
  `id_personaje` INT(11) NOT NULL,
  PRIMARY KEY (`id_item`),
  KEY `id_personaje` (`id_personaje`),
  CONSTRAINT `fk_ropa_items_personaje` FOREIGN KEY (`id_personaje`) REFERENCES `personajes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ropa_items` (`id_item`, `nombre`, `tipo_slot`, `sprite_item_url`, `id_personaje`) VALUES
(1, 'Chaqueta Azul', 'Torso', 'https://undersoul.com/sprites/items/chaqueta.png', 1),
(2, 'Pantuflas Rosadas', 'Calzado', 'https://undersoul.com/sprites/items/pantuflas.png', 1),
(3, 'Lazo Desgastado', 'Cabeza', 'https://undersoul.com/sprites/items/lazo.png', 2),
(4, 'Túnica Real', 'Torso', 'https://undersoul.com/sprites/items/tunica_asgore.png', 3),
(5, 'Armadura de Placas', 'Torso', 'https://undersoul.com/sprites/items/armadura_undyne.png', 4),
(6, 'Pétalo Dorado', 'Accesorio', 'https://undersoul.com/sprites/items/petalo.png', 5),
(7, 'Vestido Morado', 'Torso', 'https://undersoul.com/sprites/items/vestido_toriel.png', 6),
(8, 'Bata de Laboratorio', 'Torso', 'https://undersoul.com/sprites/items/bata_alphys.png', 7),
(9, 'Botas Rosadas', 'Calzado', 'https://undersoul.com/sprites/items/botas_mettaton.png', 9),
(10, 'Traje de Gala', 'Torso', 'https://undersoul.com/sprites/items/traje_papyrus.png', 10);

ALTER TABLE `personajes` AUTO_INCREMENT = 11;

-- --------------------------------------------------------
-- Actualización de URLs de las imágenes de los personajes
-- --------------------------------------------------------
USE undersoul_db;

UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/7/73/Sans_overworld.png' WHERE id = 1;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/a/ab/Frisk_overworld.png' WHERE id = 2;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/9/91/Asgore_overworld.png' WHERE id = 3;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/0/01/Undyne_overworld.png' WHERE id = 4;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/3/36/Flowey_overworld.png' WHERE id = 5;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/3/30/Toriel_overworld.png' WHERE id = 6;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/8/87/Alphys_overworld.png' WHERE id = 7;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/8/86/Froggit_overworld.png' WHERE id = 8;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/a/a2/Mettaton_EX_overworld.png' WHERE id = 9;
UPDATE personajes SET imagen_url = 'https://static.wikia.nocookie.net/undertale/images/2/23/Papyrus_overworld.png' WHERE id = 10;