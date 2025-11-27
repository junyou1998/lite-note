export function useCrypto() {
    // Helper: ArrayBuffer to Hex
    function bufferToHex(buffer: ArrayBuffer): string {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Helper: Hex to ArrayBuffer
    function hexToBuffer(hex: string): Uint8Array {
        const match = hex.match(/.{1,2}/g);
        if (!match) return new Uint8Array();
        return new Uint8Array(match.map(byte => parseInt(byte, 16)));
    }

    async function hashPassword(password: string): Promise<string> {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        return bufferToHex(hashBuffer);
    }

    async function deriveKey(password: string, saltHex: string): Promise<CryptoKey> {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );

        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: hexToBuffer(saltHex) as any,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    }

    async function encryptData(text: string, key: CryptoKey): Promise<string> {
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(text);

        const ciphertext = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            encoded
        );

        const ivHex = bufferToHex(iv.buffer);
        const cipherHex = bufferToHex(ciphertext);
        return `${ivHex}:${cipherHex}`;
    }

    async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
        const [ivHex, cipherHex] = encryptedData.split(':');
        if (!ivHex || !cipherHex) throw new Error('Invalid encrypted format');

        const iv = hexToBuffer(ivHex);
        const ciphertext = hexToBuffer(cipherHex);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv as any
            },
            key,
            ciphertext as any
        );

        return new TextDecoder().decode(decrypted);
    }

    function generateSalt(): string {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        return bufferToHex(salt.buffer);
    }

    return {
        hashPassword,
        deriveKey,
        encryptData,
        decryptData,
        generateSalt
    };
}
