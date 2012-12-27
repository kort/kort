<?php
/**
 * kort - List of all proposed solutions with their specific information
 */

/** Load the ClassLoader */
require_once('../server/php/ClassLoader.php');
Kort\ClassLoader::registerAutoLoader();

echo "<html>\n";
echo "<head>\n";
echo "<title>kort - Proposals</title>\n";
echo "<link href=\"bootstrap/css/bootstrap.min.css\" rel=\"stylesheet\" media=\"screen\">";
echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n";
echo "<script src=\"bootstrap/js/bootstrap.min.js\"></script>";
echo "</head>\n";
echo "<body>\n";

$completedFixHandler = new Webservice\Fix\FixGetHandler();
$completed = json_decode($completedFixHandler->getCompletedValidFixes(), true);
echo "<h1>Validierte L&ouml;sungsvorschl&auml;ge</h1>\n";
Helper\HtmlHelper::printTable($completed, $completedFixHandler->getHeaders());

$pendingFixHandler = new Webservice\Fix\FixGetHandler();
$pending = json_decode($pendingFixHandler->getPendingFixes(), true);
echo "<h1>Laufende L&ouml;sungsvorschl&auml;ge</h1>\n";
Helper\HtmlHelper::printTable($pending, $pendingFixHandler->getHeaders());

echo "</body>\n";
echo "</html>\n";