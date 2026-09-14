<?php
require_once 'conexion.php';

header('Content-Type: application/json');

// Obtener parámetros vía POST
$id = $_POST['id'] ?? $_POST['edit-id'] ?? null;
$nombre = $_POST['nombre'] ?? $_POST['edit-nombre'] ?? null;
$apellido = $_POST['apellido'] ?? $_POST['edit-apellido'] ?? null;
$raza = $_POST['raza'] ?? $_POST['edit-raza'] ?? null;
$ataque = $_POST['ataque'] ?? $_POST['edit-ataque'] ?? null;
$defensa = $_POST['defensa'] ?? $_POST['edit-defensa'] ?? null;
$vida = $_POST['vida'] ?? $_POST['edit-vida'] ?? null;

if ($id && $nombre !== null) {
    $id = intval($id);
    $nombre = trim($nombre);
    $apellido = trim($apellido);
    $raza = trim($raza);
    $ataque = intval($ataque);
    $defensa = intval($defensa);
    $vida = intval($vida);

    if (!in_array($raza, ['Humano', 'Monstruo'])) {
        echo json_encode([
            "success" => false,
            "status" => "error",
            "message" => "Raza inválida seleccionada."
        ]);
        exit;
    }

    // Solo se permite editar personajes creados por la comunidad;
    // el elenco oficial (es_comunidad = 0) queda protegido.
    $stmt = $conexion->prepare(
        "UPDATE personajes SET nombre = ?, apellido = ?, raza = ?, ataque = ?, defensa = ?, vida = ? 
         WHERE id = ? AND es_comunidad = 1"
    );
    
    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "status" => "error",
            "message" => "Error de preparación SQL: " . $conexion->error
        ]);
        exit;
    }

    $stmt->bind_param("sssiiii", $nombre, $apellido, $raza, $ataque, $defensa, $vida, $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                "success" => true,
                "status" => "success",
                "message" => "Personaje actualizado correctamente."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "status" => "error",
                "message" => "No se pudo actualizar: el personaje no existe o pertenece al elenco oficial (no editable)."
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "status" => "error",
            "message" => "Error al ejecutar la actualización: " . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    echo json_encode([
        "success" => false,
        "status" => "error",
        "message" => "Faltan datos requeridos para actualizar el personaje."
    ]);
}

$conexion->close();
?>
