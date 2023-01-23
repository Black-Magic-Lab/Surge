<?php

require_once 'connect.php';

function error_out($message)
{
    //Makes dpkg know it's not a package
    header("Content-Type: text/plain");
    //Generates HTTP error 500
    header($_SERVER["HTTP_PROTOCOL"] . " 500 Internal Server Error");
    //Then print out the error.
    //Because the content type is plain text, escaping is not necessary.
    die($message);
}

if (!$link) {
    error_out("Couldn't connect to the database. Please try your download later.");
}

// Only allow POST requests
if (strtoupper($_SERVER['REQUEST_METHOD']) != 'POST') {
    throw new Exception('Only POST requests are allowed');
}

// Make sure Content-Type is application/json 
$content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
if (stripos($content_type, 'application/json') === false) {
    throw new Exception('Content-Type must be application/json');
}

// Read the input stream
$body = file_get_contents("php://input");

// Decode the JSON object
$object = json_decode($body, true);

// Throw an exception if decoding failed
if (!is_array($object)) {
    throw new Exception('Failed to decode JSON object');
}

if (!isset($object['user_id']) || !isset($object['crop_id']) || !isset($object['user_name'])) {
    error_out('Missing required data!');
}

$user_id = $object['user_id'];
$crop_id = $object['crop_id'];
$user_name = $object['user_name'];
$max_user = 80;

header("Content-Type: application/json");

$query = "SELECT * FROM shopee_crop WHERE user_id = '$user_id'";
$result = mysqli_query($link, $query);

// 先檢查使用者是否存在
if (mysqli_num_rows($result) > 0) {
    $row = $result->fetch_assoc();
    $old_crop_id = $row['crop_id'];
    if (intval($old_crop_id) === intval($crop_id)) {
        $data = array("result" => 2);
        echo json_encode($data);
        return;
    }
    $query = "UPDATE shopee_crop SET crop_id = '$crop_id', timestamp = now() WHERE user_id = '$user_id'";
    mysqli_query($link, $query);

    $data = array("result" => 0);
    echo json_encode($data);
    return;
} else {
    // 檢查是否超過開放人數
    $query = "SELECT count(*) FROM shopee_crop";
    $result = mysqli_query($link, $query);

    $row = mysqli_fetch_row($result);
    if ($row[0] >= $max_user) {
        $data = array("result" => 1);
        echo json_encode($data);
        return;
    }

    // 新增使用者
    $query = "INSERT INTO shopee_crop (user_id, crop_id, user_name, timestamp) VALUES ('$user_id', '$crop_id', '$user_name', now())";
    mysqli_query($link, $query);

    $data = array("result" => 0);
    echo json_encode($data);
    return;
}
