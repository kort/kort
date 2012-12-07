<?php

namespace Helper;

class LocaleHelper
{
    protected $supported_langs = array("de", "en-US");
    protected $properties = array();
    protected $language;

    public function __construct($lang = null, $localeFile = null)
    {
        if (empty($lang)) {
            $this->language = $this->getLang();
        } else {
            $this->language = $lang;
        }
        if ($localeFile == null) {
            $localeFile = (empty($this->language)) ? "KortDb.props" : "KortDb_" . $this->language . ".props";
            $localeFile = \dirname(__FILE__) . "/../../../resources/i18n/" . $localeFile;
        }
        $this->parseFile($localeFile);
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
            $result[trim($matches[1])] = str_replace("\\=", "=", $matches[2]);

            unset($lines[$i]);
        }
        $this->properties = $result;
    }
}
