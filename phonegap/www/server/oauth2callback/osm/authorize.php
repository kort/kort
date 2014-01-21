<?php
/**
 * kort - This script redirects to the authorize URL of OpenStreetMap
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
header('Location: ' . $osmOAuth->getAuthorizeUrl());
