<?php
/**
 * kort - Helper\SecretGenerator class
 */

namespace Helper;

/**
 * The SecretGenerator class is responsible to generate unique user secrets.
 *
 * This secret is used to initially identify a user in the application.
 *
 * The used algorithm is a double-salted SHA-1 hash based on the time.
 */
class SecretGenerator
{
    /**
     * Returns a unique secret to identify a user.
     * 
     * @return string a double-salted SHA1 hash
     */
    public function getSecret()
    {
        $salt = $this->generateSalt();
        $value = time();
        return sha1($salt . sha1($salt . sha1($value)));
    }

    /**
     * Randomly generates a salt value for the secret to use.
     *
     * @return string a random salt for the user secret
     */
    private function generateSalt()
    {
        $dummy = array_merge(range('0', '9'));
        mt_srand((double)microtime()*1000000);
        for ($i = 1; $i <= (count($dummy)*2); $i++) {
            $swap = mt_rand(0, count($dummy)-1);
            $tmp = $dummy[$swap];
            $dummy[$swap] = $dummy[0];
            $dummy[0] = $tmp;
        }
        return sha1(substr(implode('', $dummy), 0, 9));
    }
}
