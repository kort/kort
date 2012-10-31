<?php
require_once "../../lib/google-api-php-client/src/Google_Client.php";

$client = new Google_Client();

if (isset($_GET['code'])) {
  $client->authenticate($_GET['code']);
  $_SESSION['token'] = $client->getAccessToken();
  header('Location: http://' . $_SERVER['HTTP_HOST']);
}
