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
    <link rel="stylesheet" type="text/css" href="styles.css">
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="bootstrap/js/bootstrap.min.js"></script>
</head>
<body>
    <div class="container-fluid">
        <h1>Validierte Lösungsvorschläge</h1>
        <?php
        $completedFixHandler = new Webservice\Fix\FixGetHandler();
        $completed = json_decode($completedFixHandler->getCompletedValidFixes(), true);
        Helper\HtmlHelper::printTable($completed, $completedFixHandler->getHeaders());
        ?>
        <h1>Laufende Lösungsvorschläge</h1>
        <?php
        $pendingFixHandler = new Webservice\Fix\FixGetHandler();
        $pending = json_decode($pendingFixHandler->getPendingFixes(), true);
        Helper\HtmlHelper::printTable($pending, $pendingFixHandler->getHeaders());
        ?>
    </div>
</body>
</html>