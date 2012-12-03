<?php

namespace Helper;

class LocaleHelper
{
    protected $supported_langs = array("de", "en-US");
    protected $properties = array();
    protected $language;

    public function __construct($lang = null)
    {
        if (empty($lang)) {
            $this->language = $this->getLang();
        } else {
            $this->language = $lang;
        }

        $localeFile = (empty($this->language)) ? "KortDb.ini" : "KortDb_" . $this->language . ".ini";
        $this->properties = parse_ini_file(dirname(__FILE__) . "/../../../resources/i18n/" . $localeFile);
    }

    public function getValue($key)
    {
        if (array_key_exists($key, $this->properties)) {
            return $this->properties[$key];
        }
        return $key;
    }

    protected function getLang()
    {
        $userLangs = $this->getUserLanguages();

        foreach ($userLangs as $lang) {
            if (in_array($lang, $this->supported_langs)) {
                return $lang;
            }
        }
        return "";
    }

    protected function getUserLanguages()
    {
        $langs = array();
        if (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
            // break up string into pieces (languages and q factors)
            $http_lang_match = '/([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/i';
            preg_match_all($http_lang_match, $_SERVER['HTTP_ACCEPT_LANGUAGE'], $lang_parse);

            if (count($lang_parse[1])) {
                // create a list like "en" => 0.8
                $langs = array_combine($lang_parse[1], $lang_parse[4]);

                // set default to 1 for any without q factor
                foreach ($langs as $lang => $val) {
                    if ($val === '') {
                        $langs[$lang] = 1;
                    }
                }

                // sort list based on value
                arsort($langs, SORT_NUMERIC);
            }
        }
        return $langs;
    }
}
