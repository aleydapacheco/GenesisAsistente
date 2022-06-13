<?php 

$contrasena_log = $_POST['contrasena'];
#$contrasena_log = 1234;

//////////////////////// CONEXION CON LA BBDD /////////////////////////////////

include 'conexion.php';

//////////////////////// CONSULTA A LA BBDD ///////////////////////////////////

$usuarios = "SELECT * FROM users ORDER by users_id DESC";
$loginUsuario = $conexion->prepare($usuarios);
$loginUsuario ->setFetchMode(PDO::FETCH_ASSOC);
$loginUsuario ->execute();
$autentificacion = false;
$resultado_erroneo = array();

while ($registro_usuarios = $loginUsuario -> fetch()){

	if(password_verify($contrasena_log, $registro_usuarios['u_password'])){

		$name = $registro_usuarios['u_usuario'];
		$autentificacion = true;
		$resultado_exitoso = array(
			"nombre" => $name,
			"estado" => $autentificacion,
		);
		$ResExitoso = json_encode($resultado_exitoso);
		print($ResExitoso);
		break;

	}
	else
	{
		$name = $registro_usuarios['u_usuario'];
		$resultado_erroneo = array(
			"nombre" => $name,
			"estado" => false,
		);
		$ResFail = json_encode($resultado_erroneo);
		#print($ResFail)
	}
}

if($autentificacion == false){

	$resultado_erroneo = array(
		"nombre" => 'none',
		"estado" => false,
	);
	$ResFail = json_encode($resultado_erroneo);
	print($ResFail);

}
#http://localhost/asistente_vesta/comparando_contrasenas.php

?>
