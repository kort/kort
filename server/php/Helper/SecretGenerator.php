<?php

namespace Helper;

class SecretGenerator {
    public function getSecret()
    {
        $salt = $this->generateSalt();
        $value = time();
        //double salted hash
        return sha1($salt . sha1($salt . sha1($value)));
    }

    private function generateSalt() {
        $dummy = array_merge(range('0', '9'));
        mt_srand((double)microtime()*1000000);
        for ($i = 1; $i <= (count($dummy)*2); $i++) {
            $swap = mt_rand(0,count($dummy)-1);
            $tmp = $dummy[$swap];
            $dummy[$swap] = $dummy[0];
            $dummy[0] = $tmp;
        }
        return sha1(substr(implode('',$dummy),0,9));
    }
}
