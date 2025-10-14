<?php
session_start();
require_once 'includes/config.php';
require_once 'includes/functions.php';

$username = $_SESSION['admin_username'] ?? 'unknown';
$ip = $_SERVER['REMOTE_ADDR'];

// LOG: Logout do administrador
logActivity('INFO', 'ADMIN_LOGOUT', "Usuário: $username, IP: $ip", $username);

session_destroy();
header('Location: admin_login.php');
exit;
?>