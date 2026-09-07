<?php
error_reporting(0);
ini_set('display_errors', 0);

$host = "localhost";
$user = "root";
$password = "";
$database = "undersoul_db";

$conexion = new mysqli($host, $user, $password, $database);

if ($conexion->connect_error) {
    header('Content-Type: application/json');
    die(json_encode([
        "success" => false, 
        "message" => "Error de conexión a la base de datos: " . $conexion->connect_error
    ]));
}

$conexion->set_charset("utf8mb4");
?>