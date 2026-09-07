<?php
require_once 'conexion.php';

header('Content-Type: application/json');

// Obtener datos enviados en formato JSON desde el frontend
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id'])) {
    $id = intval($input['id']);

    // Nombre de la tabla corregido a 'personaje' según el script SQL
    $stmt = $conexion->prepare("DELETE FROM personaje WHERE id = ?");
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
                "message" => "No se encontró ningún personaje con ese ID."
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