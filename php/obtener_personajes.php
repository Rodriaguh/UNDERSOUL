<?php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    $sql = "SELECT id, nombre, apellido, raza, ataque, defensa, vida, 
                   sprite_head, sprite_torso, sprite_legs 
            FROM personaje";
    $result = $conexion->query($sql);

    $personajes = [];

    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $personajes[] = $row;
        }
    }

    echo json_encode(["success" => true, "personajes" => $personajes]);

} catch (mysqli_sql_exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Error de MySQL: " . $e->getMessage(),
        "personajes" => []
    ]);
}

$conexion->close();
?>