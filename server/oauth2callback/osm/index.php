<?php
/**
 * kort - The OAuth callback for OpenStreetMap
 */

/** Load the ClassLoader */
require_once('../../php/ClassLoader.php');

Kort\ClassLoader::registerAutoLoader();
$osmOAuth = new \OAuth\OsmOAuth();

/*
if (isset($_GET['code'])) {
    $osmOAuth->authenticate($_GET['code']);
    $dbUser = $googleOAuth->saveApplicationUser();

    session_start();
    $_SESSION['secret'] = $dbUser['secret'];
    $_SESSION['user_id'] = $dbUser['user_id'];
}

header('Location: ' . $osmOAuth->getApplicationUrl());
*/


if (isset($_GET['redirectToOsm'])) {
    echo $osmOAuth->getAuthorizeUrl();

    //header('Location: ' . $osmOAuth->getAuthorizeUrl());
}