<?php
require_once "../../lib/google-api-php-client/src/Google_Client.php";
require_once '../../lib/google-api-php-client/src/contrib/Google_Oauth2Service.php';
require_once('../php/ClassLoader.php');

Kort\ClassLoader::registerAutoLoader();
$client = new Google_Client();
$oauth2 = new Google_Oauth2Service($client);

//refresh user info
if (isset($_GET['code'])) {
    $client->authenticate($_GET['code']);
    session_start();
    $token = $client->getAccessToken();
    $user = $oauth2->userinfo->get();
    $user['oauth_provider'] = "Google";
    $user['oauth_user_id'] = $user['email'];

    $userGetHandler = new Webservice\User\UserGetHandler();
    $userData = json_decode($userGetHandler->getUserByOAuthUserId($user['email']), true);

    $userHandler = new Webservice\User\UserHandler();
    if (empty($userData)) {
        //generate user secret
        $generator = new Helper\SecretGenerator();
        $user['secret'] = $generator->getSecret();
        $authObj = json_decode($token);
        if (isset($authObj->refresh_token)) {
            $user['token'] = $authObj->refresh_token;
            $fields[] = "token";
        }
        $dbUser = $userHandler->insertUser($user);
    } else {
        $dbUser = $userHandler->updateUser($userData['id'], $user);
    }
    $dbUser = json_decode($dbUser, true);
    $_SESSION['secret'] = $dbUser['secret'];
    $_SESSION['user_id'] = $dbUser['user_id'];
}

$appUrl = 'http://' . $_SERVER['HTTP_HOST'];
if ($_SERVER['HTTP_HOST'] === "localhost") {
    $appUrl .= "/kort";

    if (isset($_GET['state']) && !empty($_GET['state'])) {
        $appUrl .= "/build/Kort/" . $_GET['state'] . "/";
    }
}

header('Location: ' . $appUrl);
