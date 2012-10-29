<?php
require_once "../../lib/google-api-php-client/src/Google_Client.php";

$client_id = '653755350671.apps.googleusercontent.com';
$client_secret = '7o67nw_e1diHMK72Q_GJlBsg';

$client = new Google_Client();
$client->setApplicationName("kort");
$client->setClientId($client_id);
$client->setClientSecret($client_secret);

if (isset($_GET['code'])) {
  $client->authenticate($_GET['code']);
  $_SESSION['token'] = $client->getAccessToken();
  header('Location: http://' . $_SERVER['HTTP_HOST']);
}
