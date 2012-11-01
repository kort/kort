<?php
require_once "../../lib/google-api-php-client/src/Google_Client.php";

$client = new Google_Client();

print_r($_GET);

if (isset($_GET['code'])) {
    $client->authenticate($_GET['code']);
    session_start();
    $_SESSION['token'] = $client->getAccessToken();

    //save refresh token in DB

    $appUrl = 'http://' . $_SERVER['HTTP_HOST'];
    if ($_SERVER['HTTP_HOST'] === "localhost") {
        $appUrl .= "/kort";
    }

    header('Location: ' . $appUrl);
}
