<?php
require_once('./lib/db.php');

$data = select();
echo json_encode($data);
?>