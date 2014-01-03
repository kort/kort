<?php
/**
 * kort - The OAuth callback for Facebook
 */

/** Load the ClassLoader */
require_once('../../php/ClassLoader.php');
Kort\ClassLoader::registerAutoLoader();

//if user denies the request or something else went wrong, inform user and redirect to login page.
if (isset($_REQUEST['error_reason'])) {
    alert("Kort needs access to your email-address");
    header('Location: http://' . $_SERVER['HTTP_HOST']);
}


$facebookOAuth = new \OAuth\FacebookOAuth();

if (isset($_REQUEST['code'])) {
    $facebookOAuth->authenticate($_REQUEST['code']);
    $dbUser = $facebookOAuth->saveApplicationUser();

    session_start();
    $_SESSION['secret'] = $dbUser['secret'];
    $_SESSION['user_id'] = $dbUser['user_id'];
}

header('Location: http://' . $_SERVER['HTTP_HOST']);
