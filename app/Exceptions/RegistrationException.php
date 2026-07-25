<?php

namespace App\Exceptions;

use RuntimeException;

class RegistrationException extends RuntimeException
{
    public function __construct(
        public readonly int $responseCode,
        string $message,
    ) {
        parent::__construct($message);
    }
}
