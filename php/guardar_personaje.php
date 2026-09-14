<?php
header('Content-Type: application/json');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre   = trim($_POST['nombre'] ?? '');
    $apellido = trim($_POST['apellido'] ?? '');
    $raza     = trim($_POST['raza'] ?? '');
    $ataque   = intval($_POST['ataque'] ?? 0);
    $defensa  = intval($_POST['defensa'] ?? 0);
    $vida     = intval($_POST['vida'] ?? 0);

    // Sprites (pueden ser data:image/... o rutas)
    $sprite_head  = $_POST['head']  ?? null;
    $sprite_torso = $_POST['torso'] ?? null;
    $sprite_legs  = $_POST['legs']  ?? null;

    if (empty($nombre) || empty($apellido) || empty($raza)) {
        echo json_encode(["success" => false, "message" => "Por favor, completa los campos requeridos."]);
        exit;
    }

    if (!in_array($raza, ['Humano', 'Monstruo'])) {
        echo json_encode(["success" => false, "message" => "Raza inválida seleccionada."]);
        exit;
    }

    // Todo personaje creado desde este formulario queda marcado como
    // "Comunidad" (id_categoria = 3, es_comunidad = 1), separado del
    // elenco oficial importado de la wiki.
    $es_comunidad = 1;
    $id_categoria = 3;

    $stmt = $conexion->prepare(
        "INSERT INTO personajes (nombre, apellido, raza, ataque, defensa, vida, sprite_head, sprite_torso, sprite_legs, es_comunidad, id_categoria) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );

    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Error de preparación SQL: " . $conexion->error]);
        exit;
    }

    $stmt->bind_param(
        "sssiiisssii",
        $nombre, $apellido, $raza, $ataque, $defensa, $vida,
        $sprite_head, $sprite_torso, $sprite_legs, $es_comunidad, $id_categoria
    );

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "¡Personaje registrado exitosamente!",
            "id" => $stmt->insert_id
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al guardar el personaje: " . $stmt->error]);
    }

    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>
