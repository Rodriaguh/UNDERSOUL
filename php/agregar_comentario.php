<?php
header('Content-Type: application/json');
require_once 'conexion.php';

$id_personaje = intval($_POST['id_personaje'] ?? 0);
$nombre_autor = trim($_POST['nombre_autor'] ?? '');
$contenido    = trim($_POST['contenido'] ?? '');

if ($id_personaje <= 0 || $nombre_autor === '' || $contenido === '') {
    echo json_encode(["success" => false, "message" => "Faltan datos para publicar el comentario."]);
    exit;
}

if (mb_strlen($nombre_autor) > 50) {
    $nombre_autor = mb_substr($nombre_autor, 0, 50);
}
if (mb_strlen($contenido) > 500) {
    $contenido = mb_substr($contenido, 0, 500);
}

// Verifica que el personaje exista antes de insertar el comentario
$check = $conexion->prepare("SELECT id FROM personajes WHERE id = ?");
$check->bind_param("i", $id_personaje);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "El personaje no existe."]);
    $check->close();
    $conexion->close();
    exit;
}
$check->close();

$stmt = $conexion->prepare(
    "INSERT INTO comentarios (id_personaje, nombre_autor, contenido) VALUES (?, ?, ?)"
);
$stmt->bind_param("iss", $id_personaje, $nombre_autor, $contenido);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Comentario publicado.",
        "id_comentario" => $stmt->insert_id
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Error al publicar el comentario: " . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
