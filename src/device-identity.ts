export interface DeviceIdentityRecord {
  /** Hex-encoded SHA-256 of the raw 32-byte public key */
  id: string;
  /** Base64url-encoded (no padding) raw 32-byte public key */
  publicKey: string;
  /** JWK of the Ed25519 private key (for re-import) */
  privateKeyJwk: JsonWebKey;
}

export interface DeviceIdentityStore {
  load(): Promise<DeviceIdentityRecord | null>;
  save(record: DeviceIdentityRecord): Promise<void>;
}

export interface DeviceTokenStore {
  load(): Promise<string | null>;
  save(token: string): Promise<void>;
}

export interface BuildConnectDeviceOptions {
  clientId: string;
  clientMode: string;
  role: string;
  scopes: string[];
  token: string;
  nonce: string;
}

function base64urlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function hexEncode(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function generateEd25519Keypair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey('Ed25519', true, [
    'sign',
    'verify',
  ]) as Promise<CryptoKeyPair>;
}

async function deriveDeviceId(rawPublicKey: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', rawPublicKey);
  return hexEncode(new Uint8Array(hash));
}

async function signV2Payload(
  privateKeyJwk: JsonWebKey,
  payload: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'jwk',
    privateKeyJwk,
    'Ed25519',
    false,
    ['sign'],
  );
  const data = new TextEncoder().encode(payload);
  const signature = await crypto.subtle.sign('Ed25519', key, data);
  return base64urlEncode(new Uint8Array(signature));
}

export class DeviceIdentityManager {
  private identityStore: DeviceIdentityStore;
  private tokenStore: DeviceTokenStore | null;

  constructor(
    identityStore: DeviceIdentityStore,
    tokenStore?: DeviceTokenStore,
  ) {
    this.identityStore = identityStore;
    this.tokenStore = tokenStore ?? null;
  }

  async getOrCreateIdentity(): Promise<DeviceIdentityRecord> {
    const existing = await this.identityStore.load();
    if (existing) return existing;

    const keypair = await generateEd25519Keypair();
    const rawPublicKey = await crypto.subtle.exportKey('raw', keypair.publicKey);
    const privateKeyJwk = await crypto.subtle.exportKey('jwk', keypair.privateKey);
    const id = await deriveDeviceId(rawPublicKey);
    const publicKey = base64urlEncode(new Uint8Array(rawPublicKey));

    const record: DeviceIdentityRecord = { id, publicKey, privateKeyJwk };
    await this.identityStore.save(record);
    return record;
  }

  async buildConnectDevice(
    opts: BuildConnectDeviceOptions,
  ): Promise<{
    id: string;
    publicKey: string;
    signature: string;
    signedAt: number;
    nonce: string;
  }> {
    const identity = await this.getOrCreateIdentity();
    const signedAt = Date.now();
    const scopeStr = opts.scopes.join(',');
    const payload = `v2|${identity.id}|${opts.clientId}|${opts.clientMode}|${opts.role}|${scopeStr}|${signedAt}|${opts.token}|${opts.nonce}`;
    const signature = await signV2Payload(identity.privateKeyJwk, payload);

    return {
      id: identity.id,
      publicKey: identity.publicKey,
      signature,
      signedAt,
      nonce: opts.nonce,
    };
  }

  async getDeviceToken(): Promise<string | null> {
    if (!this.tokenStore) return null;
    return this.tokenStore.load();
  }

  async saveDeviceToken(token: string): Promise<void> {
    if (!this.tokenStore) return;
    await this.tokenStore.save(token);
  }
}
