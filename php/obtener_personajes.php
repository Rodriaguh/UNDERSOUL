<?php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    // Se unen categoría (para los filtros del menú) y detalles/lore
    // (para el elenco oficial importado de la wiki).
    $sql = "SELECT p.id, p.nombre, p.apellido, p.raza, p.ataque, p.defensa, p.vida,
                   p.sprite_head, p.sprite_torso, p.sprite_legs,
                   p.imagen_url, p.descripcion, p.es_comunidad,
                   p.id_categoria, c.nombre_categoria,
                   d.historia_completa, d.musica_tema, d.dialogo_clave, d.sprite_combate_url
            FROM personajes p
            LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN detalles_personajes d ON d.id_personaje = p.id
            ORDER BY p.es_comunidad ASC, p.nombre ASC";
    $result = $conexion->query($sql);

    $personajes = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
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
