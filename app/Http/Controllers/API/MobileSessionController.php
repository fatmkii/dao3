<?php

namespace App\Http\Controllers\API;

use App\Common\ResponseCode;
use App\Exceptions\CustomAccountExistsException;
use App\Exceptions\MobileSessionException;
use App\Exceptions\RegistrationException;
use App\Http\Controllers\Controller;
use App\Jobs\ProcessUserActive;
use App\Models\User;
use App\Services\AndroidRegistrationService;
use App\Services\CustomAccountService;
use App\Services\MobileSessionService;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MobileSessionController extends Controller
{
    public function __construct(
        private readonly MobileSessionService $sessions,
        private readonly AndroidRegistrationService $registration,
        private readonly CustomAccountService $customAccounts,
    ) {
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $this->validate($request, [
            'binggan' => 'required|string',
            'password' => 'nullable|string|alpha_dash',
            'installation_id' => 'required|string|max:128',
            'device_name' => 'required|string|max:100',
            'app_version' => 'required|string|max:50',
        ]);
        $user = User::findByBinggan($validated['binggan']);
        if (! $user) {
            return $this->error(ResponseCode::USER_NOT_FOUND);
        }
        if (! $user->passwordMatches($validated['password'] ?? null)) {
            return $this->error(ResponseCode::USER_PASSWORD_ERROR);
        }
        if ($user->is_banned) {
            return $this->error(ResponseCode::USER_BANNED);
        }

        $session = $this->sessions->create(
            $user,
            $validated['installation_id'],
            $validated['device_name'],
            $validated['app_version'],
        );
        ProcessUserActive::dispatch([
            'binggan' => $user->binggan,
            'user_id' => $user->id,
            'active' => '用户导入了饼干',
            'content' => $request->ip(),
        ]);

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '登录成功',
            'data' => $session,
        ]);
    }

    public function refresh(Request $request): JsonResponse
    {
        $validated = $this->validate($request, ['refresh_token' => 'required|string']);

        try {
            $data = $this->sessions->refresh($validated['refresh_token']);
        } catch (MobileSessionException $exception) {
            return $this->sessionError($exception);
        }

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '移动会话已刷新',
            'data' => $data,
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $this->validate($request, [
            'registration_device_digest' => ['required', 'string', 'regex:/^[a-f0-9]{64}$/'],
            'installation_id' => 'required|string|max:128',
            'device_name' => 'required|string|max:100',
            'app_version' => 'required|string|max:50',
        ]);

        try {
            $data = $this->registration->register(
                $validated['registration_device_digest'],
                $request->ip(),
                $validated['installation_id'],
                $validated['device_name'],
                $validated['app_version'],
            );
        } catch (RegistrationException $exception) {
            return response()->json([
                'code' => $exception->responseCode,
                'message' => $exception->getMessage(),
                'data' => null,
            ]);
        }

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '领取饼干成功！新饼干24小时内暂时不能发帖。',
            'data' => $data,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $validated = $this->validate($request, ['refresh_token' => 'required|string']);

        try {
            $this->sessions->logout($validated['refresh_token']);
        } catch (MobileSessionException) {
            // Logout intentionally does not reveal whether a refresh token existed.
        }

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '已登出此移动会话',
            'data' => null,
        ]);
    }

    public function version(): JsonResponse
    {
        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => 'Android 版本信息',
            'data' => $this->releaseMetadata(),
        ]);
    }

    private function releaseMetadata(): array
    {
        $release = config('mobile.release');
        $manifestPath = config('mobile.release_manifest_path');
        if (! is_string($manifestPath) || ! is_readable($manifestPath)) {
            return $release;
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        if (! is_array($manifest)) {
            return $release;
        }

        foreach (array_keys($release) as $key) {
            if (array_key_exists($key, $manifest)) {
                $release[$key] = $key === 'version_code'
                    ? (int) $manifest[$key]
                    : (string) $manifest[$key];
            }
        }

        return $release;
    }

    public function customAccount(Request $request): JsonResponse
    {
        $validated = $this->validate($request, [
            'binggan' => 'required|string',
            'binggan_apply' => 'required|string|alpha_dash|max:16|min:7',
            'password' => 'required|string|alpha_dash|max:20|min:7',
            'transfer_binggan' => 'required|boolean',
            'installation_id' => 'required|string|max:128',
            'device_name' => 'required|string|max:100',
            'app_version' => 'required|string|max:50',
        ]);
        $origin = $request->user();
        if (($origin->currentAccessToken()?->client_type ?? null) !== 'android') {
            return $this->sessionError(new MobileSessionException('仅 Android 移动会话可使用此接口'));
        }

        try {
            $created = $this->customAccounts->create(
                $origin,
                $validated['binggan_apply'],
                $validated['password'],
                $validated['transfer_binggan'],
                $request->ip(),
            );
        } catch (CustomAccountExistsException) {
            return $this->error(ResponseCode::USER_REGISTER_FAIL);
        }

        return response()->json([
            'code' => ResponseCode::SUCCESS,
            'message' => '定制饼干成功！',
            'data' => $this->sessions->create(
                $created,
                $validated['installation_id'],
                $validated['device_name'],
                $validated['app_version'],
            ),
        ]);
    }

    private function error(int $code): JsonResponse
    {
        return response()->json([
            'code' => $code,
            'message' => ResponseCode::$codeMap[$code],
            'data' => null,
        ]);
    }

    private function validate(Request $request, array $rules): array
    {
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            throw new HttpResponseException(response()->json([
                'code' => 422,
                'message' => $validator->errors()->first(),
                'data' => null,
            ], 422));
        }

        return $validator->validated();
    }

    private function sessionError(MobileSessionException $exception): JsonResponse
    {
        return response()->json([
            'code' => ResponseCode::USER_UNAUTHORIZED,
            'message' => $exception->getMessage(),
            'data' => null,
        ], 401);
    }
}
