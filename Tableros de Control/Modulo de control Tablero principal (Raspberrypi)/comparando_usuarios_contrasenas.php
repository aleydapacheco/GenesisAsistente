<?php 

$usuario_log = $_POST['usuario'];
$contrasena_log = $_POST['contrasena'];

//////////////////////// CONEXION CON LA BBDD /////////////////////////////////

include 'conexion.php';

//////////////////////// CONSULTA A LA BBDD ///////////////////////////////////

$loginUsuario=$conexion->prepare("SELECT * FROM users WHERE u_usuario = :usuario_log");
$loginUsuario->execute(array(":usuario_log" => $usuario_log));

while ($pass_registro = $loginUsuario -> fetch(PDO::FETCH_ASSOC)){
	if(password_verify($contrasena_log, $pass_registro['u_password'])){
				
		#date_default_timezone_set('America/La_Paz');
		#$ultimaCon=date('Y-M-D G:i:s');
		#$actualizarUs=$conexion->prepare("UPDATE users SET estado='conectado', time_login=:ultimaCon WHERE u_usuario=:usuario_log");
		#$actualizarUs->bindParam(':ultimaCon', $ultimaCon, PDO::PARAM_STR);
		#$actualizarUs->bindParam(':usuario_log', $usuario_log, PDO::PARAM_STR);
		#$actualizarUs->execute();
		$resultado = array(
			"estado" => true,
		);
		$Res = json_encode($resultado);
		return print($Res);
	}	
}
$resultado = array(
	"estado" => false,
);
$Res = json_encode($resultado);
print($Res);

?>