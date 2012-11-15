<?php
require_once "../../lib/google-api-php-client/src/Google_Client.php";
require_once '../../lib/google-api-php-client/src/contrib/Google_Oauth2Service.php';

$client = new Google_Client();
$oauth2 = new Google_Oauth2Service($client);

if (isset($_GET['code'])) {
    $client->authenticate($_GET['code']);
    session_start();
    $_SESSION['token'] = $client->getAccessToken();
    $user = $oauth2->userinfo->get();
    $_SESSION['email'] = filter_var($user['email'], FILTER_SANITIZE_EMAIL);
    $_SESSION['name'] = $user['name'];
}

$appUrl = 'http://' . $_SERVER['HTTP_HOST'];
if ($_SERVER['HTTP_HOST'] === "localhost") {
    $appUrl .= "/kort";
}

header('Location: ' . $appUrl);
