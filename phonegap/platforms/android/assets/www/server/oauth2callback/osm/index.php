<?php
/**
 * kort - The OAuth callback for OpenStreetMap
 */

/** Load the PHP OAuth store*/
require_once('../../../lib/oauth-php/library/OAuthStore.php');

/** Load the PHP OAuth requester */
require_once('../../../lib/oauth-php/library/OAuthRequester.php');

/** Load the ClassLoader */
require_once('../../php/ClassLoader.php');
Kort\ClassLoader::registerAutoLoader();

/** Load the secrets */
require_once(\OAuth\OsmOAuth::getSecretFile());

$osmOAuth = new \OAuth\OsmOAuth($consumerKey, $consumersecret);

if (isset($_GET['oauth_token'])) {

    $osmOAuth->authenticate($_GET['oauth_token']);
    $dbUser = $osmOAuth->saveApplicationUser();

    $_SESSION['secret'] = $dbUser['secret'];
    $_SESSION['user_id'] = $dbUser['user_id'];
}

header('Location: ' . $osmOAuth->getApplicationUrl());
