<?php
/**
 * kort - Helper\LocaleHelper class
 */

namespace Helper;

/**
 * The LocaleHelper class helps to translate text in the application.
 *
 * All text must be provided in a *.props file containing the key and the translation.
 */
class LocaleHelper
{
    /**
     * Defines the default language.
     *
     * @var array(string)
     */
    protected $defaultLanguge = "en";

    /**
     * Defines all currently supported languages.
     *
     * @var array(string)
     */
    protected $supportedLanguages = array(
        "de",
        "en",
        "it",
        "fr",
        "sl",
        "hr",
        "cs",
        "nl",
        "gl",
        "pt",
        "ro",
        "ja",
        "ca",
        "es"
    );

    /**
     * The properties array are the core of this class, it contains all available translation.
     *
     * @var array
     */
    protected $properties = array();

    /**
     * The detected or requested lanugage.
     *
     * @var string
     */
    protected $language;

    /**
     * Creates a new instance of LocaleHelper.
     *
     * @param string $lang       The requested language.
     * @param string $localeFile Defines a specific *.props file to use.
     */
    public function __construct($lang = null, $localeFile = null)
    {
        if (empty($lang)) {
            $this->language = $this->guessLang();
        } else {
            $this->language = $lang;
        }
        if ($localeFile == null) {
            $localeFile = (empty($this->language)) ? "KortDb.props" : "KortDb_" . $this->language . ".props";
            $localeFile = \dirname(__FILE__) . "/../../../resources/i18n/" . $localeFile;
        }
        $this->parseFile($localeFile);
    }

    /**
     * Returns the traslated value if available.
     *
     * @param string $key An entry in the props file.
     *
     * @return string the translated string if available, $key otherwise
     */
    public function getValue($key)
    {
        if (array_key_exists($key, $this->properties)) {
            return $this->properties[$key];
        }
        return $key;
    }

    /**
     * This function tries to guess the best translation for the user.
     *
     * This is based on the users browser settings and the available languages.
     *
     * @return string the guessed language or empty string if it can not be detected.
     */
    protected function guessLang()
    {
        $userLangs = $this->getUserLanguages();

        foreach ($userLangs as $lang) {
            if (in_array($lang, $this->supportedLanguages)) {
                return $lang;
            }
        }
        return $this->defaultLanguge;
    }

    /**
     * Returns the accepted languages of the users with priority.
     *
     * @return array all supported languages of the user sorted by priority
     */
    protected function getUserLanguages()
    {
        $langs = array();
        if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
            $http_lang_match = '/([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/i';
            preg_match_all($http_lang_match, $_SERVER['HTTP_ACCEPT_LANGUAGE'], $lang_parse);

            if (count($lang_parse[1])) {
                $langs = array_combine($lang_parse[1], $lang_parse[4]);

                // set default to 1 for any without q factor
                foreach ($langs as $lang => $val) {
                    if ($val === '') {
                        $langs[$lang] = 1;
                    }
                }
                arsort($langs, SORT_NUMERIC);
            }
        }
        return $langs;
    }

    /**
     * Reads a *.props file and saves the content in $properties.
     *
     * @param string $file The filename of the *.props file.
     *
     * @return void
     */
    protected function parseFile($file)
    {
        $result = array();
        $content = file_get_contents($file);
        $lines = preg_split("/\n/", $content);
        foreach ($lines as $i => $line) {
            if (empty($line) || strpos($line, "#") === 0) {
                continue;
            }
            $entryPattern = '/^(.*[^\\\\])=(.*)$/';
            preg_match($entryPattern, $line, $matches);
            if (count($matches) > 1) {
                $result[trim($matches[1])] = str_replace("\\=", "=", $matches[2]);
            }

            unset($lines[$i]);
        }
        $this->properties = $result;
    }
}
