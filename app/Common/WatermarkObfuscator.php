<?php

namespace App\Common;

class WatermarkObfuscator
{
    /**
     * 混淆配置
     */
    const ROUNDS = 3; // 混淆轮数，3-4轮足够
    const MOD_USER = 1000000; // UserID (6位) 模数
    const MOD_THREAD = 1000000; // ThreadID (6位) 模数，实际上ThreadID可能更多，但为了对齐先假设它也是6位左右。
    // 如果 ThreadID 可能超过 999999，需要相应调大，比如 10000000 (7位)。
    // 假设 ThreadID 目前在 10000-999999 之间。

    /**
     * Feistel 轮函数 F(x, k)
     * 利用简单的线性同余或哈希思想，让输入x和轮密钥k产生一个"伪随机"数
     */
    private static function feistelFunction($input, $roundKey) {
        // 使用简单的乘法和位移，保证速度极快
        // 1366, 1235 是随意选的质数或杂乱数
        $tmp = ($input * 1366 + $roundKey * 1235 + 99999);
        return ($tmp >> 3) ^ ($tmp << 5); 
    }

    /**
     * 获取轮密钥数组
     * 简单的将主密钥切分扩展一下
     */
    private static function getRoundKeys() {
        $masterKey = (int)env('WATERMARK_XOR_KEY', '123456789012');
        $keys = [];
        for ($i = 0; $i < self::ROUNDS; $i++) {
            $keys[] = ($masterKey >> ($i * 5)) & 0xFFFFFF; // 每一轮取主密钥的不同部分
        }
        return $keys;
    }

    public static function encode($userId, $threadId)
    {
        // 确保转为整数
        $L = (int)$userId;      // Left part
        $R = (int)$threadId;    // Right part
        
        $keys = self::getRoundKeys();

        // 3轮 Feistel 加密
        for ($i = 0; $i < self::ROUNDS; $i++) {
            $prevL = $L;
            $L = $R;
            // New R = Old L ^ F(Old R, K)
            // 这里为了保证结果是纯数字且位数可控，我们使用模加代替 XOR
            // New R = (Old L + F(Old R, K)) % MOD
            $f_val = self::feistelFunction($R, $keys[$i]);
            $R = ($prevL + $f_val) % self::MOD_USER; 
            
            // 注意：标准的 Feistel 交换 L 和 R。
            // 这里：
            // Round 1: L1=R0, R1=(L0 + F(R0)) % MOD
            // Round 2: L2=R1, R2=(L1 + F(R1)) % MOD
            // ...
        }

        // 拼接成字符串
        // 为了解密方便，我们需要固定长度。
        // UserID 模 1000000 -> 0 to 999999 (6 digits). Pad with 0.
        // ThreadID 模 1000000 (假设) -> 6 digits.
        
        // 最后一次循环结束后，通常会再交换一次 L 和 R (根据算法变种可选，这里我们不交换，直接拼)
        // Cipher = L . R
        
        return sprintf('%06d%06d', $L, $R);
    }

    public static function decode($obfuscatedString)
    {
        // 拆分
        // 假设都是6位。如果生成的字符串是12位
        if (strlen($obfuscatedString) < 12) {
             // 简单的fallback，如果长度不对可能是旧数据
             return $obfuscatedString; // 或者抛错
        }
        
        $L = (int)substr($obfuscatedString, 0, 6);
        $R = (int)substr($obfuscatedString, 6, 6);

        $keys = self::getRoundKeys();

        // 逆向解密
        for ($i = self::ROUNDS - 1; $i >= 0; $i--) {
            // 在加密中：
            // New L = Old R
            // New R = (Old L + F(Old R, K)) % MOD
            
            // 逆向时：
            // Current L is Next Loop's R (from encryption perspective) / Prev Loop's Old R
            // Current R is ...
            
            // Let's trace back:
            // End state: L_final, R_final
            // Before last swap (if we did one): L_last = R_final, R_last = L_final
            // But we didn't swap at the very end.
            // So L_final = L_{rounds}, R_final = R_{rounds}
            
            // In loop (encryption):
            // L_{i+1} = R_i;
            // R_{i+1} = (L_i + F(R_i, K)) % MOD
            
            // In loop (decryption):
            // We know L_{i+1} and R_{i+1}
            // We want L_i and R_i
            
            // From L_{i+1} = R_i  =>  R_i = L_{i+1}
            // From R_{i+1} = (L_i + F(R_i, K)) % MOD 
            // => L_i = (R_{i+1} - F(R_i, K)) % MOD
            // Since it's modulo arithmetic, subtraction need to handle negatives:
            // L_i = (R_{i+1} - F(R_i, K)) % MOD
            // Wait, R_i is known as L_{i+1}
            
            $prevR = $L; // This is R_i
            $prevL = ($R - self::feistelFunction($prevR, $keys[$i])) % self::MOD_USER;
            
            if ($prevL < 0) {
                $prevL += self::MOD_USER;
            }
            
            $L = $prevL;
            $R = $prevR;
        }

        return (string)$L . (string)$R;
    }
}
