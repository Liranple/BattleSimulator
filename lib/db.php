<?php
function createConnect() {
    return mysqli_connect(
        'localhost',
        'todo',
        'flfksvmf',
        'charsheetdata'
    );
}
function select() {
    $sql = "SELECT * FROM `chardata` order by id";
    $result = mysqli_query(createConnect(), $sql);
    $data = [];
    for ($i=0; $i < $result->num_rows; $i++) { 
        $data[] = mysqli_fetch_object($result);
    }
    return $data;
}
function create($subject) {
    $conn = createConnect();
    deleteAll();
    for ($i=0; $i < count($subject); $i++) { 
        $sql = $conn->prepare("INSERT INTO `chardata` (`name`, `death`, `atk2`, `atk3`, `weapon`, `armor`, `hp`, `charkey`, `chartxt`, `party`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $sql->bind_param('siiiiiisss',
        $subject[$i]['name'],
        $subject[$i]['death'],
        $subject[$i]['atk2'],
        $subject[$i]['atk3'],
        $subject[$i]['weapon'],
        $subject[$i]['armor'],
        $subject[$i]['hp'],
        $subject[$i]['charkey'],
        $subject[$i]['chartxt'],
        $subject[$i]['party']);
        $sql->execute();
    }
}
function deleteAll() {
    $conn = createConnect();
    $sql = $conn->prepare("DELETE FROM `chardata`");
    $sql->execute();
}