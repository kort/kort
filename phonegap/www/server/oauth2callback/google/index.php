<?php
/**
 * kort - The OAuth callback for Google
 */

/** Load the Google API Client */
require_once "../../../lib/google-api-php-client/src/Google_Client.php";
/** Load the Google OAuth 2.0 service */
require_once '../../../lib/google-api-php-client/src/contrib/Google_Oauth2Service.php';
/** Load the ClassLoader */
require_once('../../php/ClassLoader.php');

Kort\ClassLoader::registerAutoLoader();
$googleOAuth = new \OAuth\GoogleOAuth();

if (isset($_GET['code'])) {
    $googleOAuth->authenticate($_GET['code']);
    $dbUser = $googleOAuth->saveApplicationUser();
    session_start();
    $_SESSION['secret'] = $dbUser['secret'];
    $_SESSION['user_id'] = $dbUser['user_id'];
}

header('Location: ' . $googleOAuth->getApplicationUrl());
