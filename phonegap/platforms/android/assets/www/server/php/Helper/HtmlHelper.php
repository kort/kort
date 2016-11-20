<?php
/**
 * kort - Helper\HtmlHelper class
 */
namespace Helper;

/**
 * The HtmlHelper class is a helper class for common HTML formattings.
 */
class HtmlHelper
{
    /**
     * Prints an array with keys as header and values as body.
     *
     * @param array $data    The key-value array to print.
     * @param array $headers Key-value array with the header for each column.
     *
     * @return void
     */
    public static function printTable(array $data, array $headers = null)
    {
        if (empty($headers)) {
            $headers = array_combine(array_keys($data[0]), array_keys($data[0]));
        }
        echo "<table class=\"table table-striped\">\n";
        echo "<tr>\n";
        foreach (array_keys($data[0]) as $key) {
            echo "<th>" . $headers[$key] . "</th>\n";
        }
        echo "</tr>\n";
        foreach ($data as $row) {
            echo "<tr>\n";
            foreach ($row as $column) {
                echo "<td>" . $column . "</td>\n";
            }
            echo "</tr>\n";
        }
        echo "</table>\n";
    }
}
