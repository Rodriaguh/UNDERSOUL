<?php
require_once 'conexion.php';

header('Content-Type: application/json');

// Obtener datos enviados en formato JSON desde el frontend
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id'])) {
    $id = intval($input['id']);

    // Solo se permite eliminar personajes creados por la comunidad;
    // el elenco oficial (es_comunidad = 0) queda protegido.
    $stmt = $conexion->prepare("DELETE FROM personajes WHERE id = ? AND es_comunidad = 1");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                "status" => "success",
                "success" => true,
                "message" => "Personaje eliminado correctamente de la base de datos."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "success" => false,
                "message" => "No se encontró el personaje, o pertenece al elenco oficial y no puede eliminarse."
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "success" => false,
            "message" => "Error al ejecutar la consulta: " . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    echo json_encode([
        "status" => "error",
        "success" => false,
        "message" => "ID de personaje no proporcionado."
    ]);
}

$conexion->close();
?>
