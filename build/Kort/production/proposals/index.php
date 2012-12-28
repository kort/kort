<?php
/**
 * kort - List of all proposed solutions with their specific information
 */

/** Load the ClassLoader */
require_once('../server/php/ClassLoader.php');
Kort\ClassLoader::registerAutoLoader();
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <title>Kort - L&ouml;sungsvorschl&auml;ge</title>
    <meta charset="utf-8">
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link rel="stylesheet" type="text/css" href="resources/styles/styles.css">
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
</head>
<body>
    <div class="container-fluid">
        <div class="page-header">
            <h1>L&ouml;sungsvorschl&auml;ge <small>Von Benutzern von Kort erfasst und validiert.</small></h1>
        </div>
        <?php
        $completedFixHandler = new Webservice\Fix\FixGetHandler();
        $completed = json_decode($completedFixHandler->getCompletedValidFixes(), true);
        Helper\HtmlHelper::printTable($completed, $completedFixHandler->getHeaders());
        ?>
    </div>
</body>
</html>