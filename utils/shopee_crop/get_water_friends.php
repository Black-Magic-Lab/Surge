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

// Read the input stream
$body = file_get_contents("php://input");

// Decode the JSON object
$object = json_decode($body, true);

// Throw an exception if decoding failed
if (!is_array($object)) {
    throw new Exception('Failed to decode JSON object');
}

if (!isset($object['user_id']) || !isset($object['scope'])) {
    error_out('Missing required data!');
}

$user_id = $object['user_id'];
$scope = $object['scope'];
$group_size = 40;


if ($scope === 'regular') {
    $query = "SELECT user_id, crop_id, user_name FROM shopee_crop WHERE timestamp > DATE_SUB(NOW(), INTERVAL 10 DAY) AND user_id != '$user_id' ORDER BY priority DESC, RAND() LIMIT 20";
} elseif ($scope === 'all') {
    $query = "SELECT user_id, user_name FROM shopee_crop";
} elseif ($scope === 'group' || $scope === 'group_all') {
    $query = "SELECT id FROM shopee_crop WHERE user_id='$user_id'";
    $result = mysqli_query($link, $query);
    $row = mysqli_fetch_assoc($result);
    if (!$row) {
        echo json_encode(json_decode("[]"));
    }
    $num = $row['id'];
    $min = floor($num/$group_size) * $group_size + 1;
    $max = ceil($num/$group_size) * $group_size;
    if ($min >= $max) {
        $min -= $group_size;
    }
    // echo $min.' '.$max;
    $query = "SELECT user_id, crop_id, user_name FROM shopee_crop WHERE timestamp > DATE_SUB(NOW(), INTERVAL 10 DAY) AND user_id != '$user_id' AND id >= '$min' AND id <= '$max' ORDER BY priority DESC, RAND() LIMIT 20";
    if ($scope === 'group_all') {
        $query = "SELECT user_id, crop_id, user_name FROM shopee_crop WHERE user_id != '$user_id' AND id >= '$min' AND id <= '$max'";
    }
} else {
    echo json_encode(json_decode("[]"));
    return;
}

$result = mysqli_query($link, $query);
if (mysqli_num_rows($result) > 0) {
    $response = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = $row;
    }
    shuffle($response);
    echo json_encode($response);
} else {
    echo json_encode(json_decode("[]"));
}
