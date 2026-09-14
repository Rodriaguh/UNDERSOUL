<?php
header('Content-Type: application/json');
require_once 'conexion.php';

$id_personaje = intval($_GET['id_personaje'] ?? 0);

if ($id_personaje <= 0) {
    echo json_encode(["success" => false, "message" => "ID de personaje no válido.", "comentarios" => []]);
    exit;
}

$stmt = $conexion->prepare(
    "SELECT id_comentario, nombre_autor, contenido, fecha_publicacion
     FROM comentarios WHERE id_personaje = ? ORDER BY fecha_publicacion DESC"
);
$stmt->bind_param("i", $id_personaje);
$stmt->execute();
$result = $stmt->get_result();

$comentarios = [];
while ($row = $result->fetch_assoc()) {
    $comentarios[] = $row;
}

echo json_encode(["success" => true, "comentarios" => $comentarios]);

$stmt->close();
$conexion->close();
?>
