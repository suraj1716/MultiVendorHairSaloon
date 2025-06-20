<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Throwable;
use Inertia\Inertia;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    { dd('Exception caught', $request->url(), $exception->getMessage());

        $status = 500;
        if ($this->isHttpException($exception)) {
            /** @var HttpExceptionInterface $httpException */
            $httpException = $exception;
            $status = $httpException->getStatusCode();

        }

        $messages = [
            404 => 'Page not found.',
            403 => 'Access denied.',
            500 => 'Internal server error.',
        ];

        $message = $messages[$status] ?? 'An unexpected error occurred.';

        if ($request->wantsJson() || $request->isJson()) {
            return response()->json(['message' => $message], $status);
        }

        return Inertia::render('ErrorPage', [
            'statusCode' => $status,
            'message' => $message,
        ])->toResponse($request)->setStatusCode($status);
    }
}
