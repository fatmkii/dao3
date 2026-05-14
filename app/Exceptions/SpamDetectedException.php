<?php

namespace App\Exceptions;

use Exception;

class SpamDetectedException extends Exception
{
    private int $responseCode;

    public function __construct(int $responseCode, string $responseMessage)
    {
        parent::__construct($responseMessage);
        $this->responseCode = $responseCode;
    }

    public function render($request)
    {
        return response()->json([
            'code' => $this->responseCode,
            'message' => $this->message,
        ]);
    }

    public function report()
    {
        //什么都不做，不用写入log
    }
}
