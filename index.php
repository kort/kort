<?php
/*
 * This file is used to tell the heroku app to initialize a php-webserver.
 * It just redirects to the "correct" index-file.
 */
header('Location: ./index.html');
?>