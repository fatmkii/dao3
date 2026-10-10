<?php

namespace App\Services;

use Aws\Signature\S3SignatureV4;

class RecordingUploadSignature extends S3SignatureV4
{
    // The generic SDK omits these headers. Native uploads reproduce them exactly;
    // signing them is required to enforce the size, format declaration and no-overwrite condition.
    protected function getHeaderBlacklist()
    {
        $headers = parent::getHeaderBlacklist();
        unset($headers['content-length'], $headers['if-none-match']);

        return $headers;
    }

    protected function getPresignHeaderDenyList()
    {
        $headers = parent::getPresignHeaderDenyList();
        unset($headers['content-type']);

        return $headers;
    }
}
