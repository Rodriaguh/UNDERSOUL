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

    $stmt = $conexion->prepare("UPDATE personaje SET nombre = ?, apellido = ?, raza = ?, ataque = ?, defensa = ?, vida = ? WHERE id = ?");
    
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
        echo json_encode([
            "success" => true,
            "status" => "success",
            "message" => "Personaje actualizado correctamente."
        ]);
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