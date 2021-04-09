<?php
require_once('./lib/db.php');

$data = file_get_contents("php://input");
$data = json_decode($data, true);
create($data);
?>