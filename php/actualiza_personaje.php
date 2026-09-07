<?php
require_once 'conexion.php';

header('Content-Type: application/json');

$id       = $_POST['id'] ?? $_POST['edit-id'] ?? null;
$nombre   = $_POST['nombre'] ?? $_POST['edit-nombre'] ?? null;
$apellido = $_POST['apellido'] ?? $_POST['edit-apellido'] ?? null;
$raza     = $_POST['raza'] ?? $_POST['edit-raza'] ?? null;
$ataque   = $_POST['ataque'] ?? $_POST['edit-ataque'] ?? null;
$defensa  = $_POST['defensa'] ?? $_POST['edit-defensa'] ?? null;
$vida     = $_POST['vida'] ?? $_POST['edit-vida'] ?? null;

// Sprites (opcionales)
$sprite_head  = $_POST['sprite_head']  ?? $_POST['head']  ?? null;
$sprite_torso = $_POST['sprite_torso'] ?? $_POST['torso'] ?? null;
$sprite_legs  = $_POST['sprite_legs']  ?? $_POST['legs']  ?? null;

if ($id && $nombre !== null) {
    $id = intval($id);
    $nombre = trim($nombre);
    $apellido = trim($apellido);
    $raza = trim($raza);
    $ataque = intval($ataque);
    $defensa = intval($defensa);
    $vida = intval($vida);

    // Si no llegan sprites nuevos, mantenemos los actuales (no los borramos)
    $stmt = $conexion->prepare(
        "UPDATE personaje SET 
            nombre = ?, apellido = ?, raza = ?, 
            ataque = ?, defensa = ?, vida = ?,
            sprite_head = COALESCE(?, sprite_head),
            sprite_torso = COALESCE(?, sprite_torso),
            sprite_legs = COALESCE(?, sprite_legs)
         WHERE id = ?"
    );
    
    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "status" => "error",
            "message" => "Error de preparación SQL: " . $conexion->error
        ]);
        exit;
    }

    $stmt->bind_param(
        "sssiiiissi",
        $nombre, $apellido, $raza, $ataque, $defensa, $vida,
        $sprite_head, $sprite_torso, $sprite_legs, $id
    );

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