import axios from "axios";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeBase64urlNoPadding } from "@oslojs/encoding";
import { generateRandomString } from "@oslojs/crypto/random";
import type { RandomReader } from "@oslojs/crypto/random";

const TOKEN_STORAGE_KEY = "haruki_oauth_tokens";
const STATE_STORAGE_KEY = "haruki_oauth_state";
const VERIFIER_STORAGE_KEY = "haruki_oauth_verifier";
const RANDOM_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

const HARUKI_OAUTH_BASE_URL = process.env.NEXT_PUBLIC_HARUKI_OAUTH_BASE_URL || "";
const HARUKI_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_HARUKI_OAUTH_CLIENT_ID || "";
const HARUKI_OAUTH_REDIRECT_URI = process.env.NEXT_PUBLIC_HARUKI_OAUTH_REDIRECT_URI || "";

const random: RandomReader = {
	read(bytes: Uint8Array): void {
		crypto.getRandomValues(bytes);
	}
};

export interface HarukiOAuthTokens {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in?: number;
  refresh_token?: string;
}

export interface HarukiOAuthStoredTokens {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  scope: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  avatarPath: string;
}

export interface UserBinding {
  server: string;
  userId: string;
  verified: boolean;
}

export interface GameData {
  [key: string]: any;
}

function generateRandomStringCommon(length: number): string {
  return generateRandomString(random, RANDOM_CHARS, length);
}

export class HarukiOAuth {
  private clientId: string;
  private redirectUri: string;
  private baseUrl: string;

  constructor(
    clientId?: string,
    redirectUri?: string,
    baseUrl?: string
  ) {
    this.clientId = clientId || HARUKI_OAUTH_CLIENT_ID;
    this.redirectUri = redirectUri || HARUKI_OAUTH_REDIRECT_URI;
    this.baseUrl = baseUrl || HARUKI_OAUTH_BASE_URL;
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = sha256(data);
    return encodeBase64urlNoPadding(hash);
  }

  private generateState(): string {
    return generateRandomStringCommon(32);
  }

  private generateCodeVerifier(): string {
    return generateRandomStringCommon(64);
  }

  private saveTokens(tokens: HarukiOAuthTokens): void {
    const storedTokens: HarukiOAuthStoredTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
    };

    if (tokens.expires_in) {
      storedTokens.expires_at = Date.now() + tokens.expires_in * 1000;
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(storedTokens));
  }

  getTokens(): HarukiOAuthStoredTokens | null {
    if (typeof localStorage === 'undefined') return null;
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  }

  clearTokens(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;
    if (tokens.expires_at && Date.now() >= tokens.expires_at) {
      return false;
    }
    return true;
  }

  isTokenExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens || !tokens.expires_at) return false;
    return Date.now() >= tokens.expires_at;
  }

  async getAuthorizationUrl(scopes: string[]): Promise<string> {
    const state = this.generateState();
    const verifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(verifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes.join(" "),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const url = `${this.baseUrl}/api/oauth2/authorize?${params.toString()}`;

    sessionStorage.setItem(STATE_STORAGE_KEY, state);
    sessionStorage.setItem(VERIFIER_STORAGE_KEY, verifier);

    return url;
  }

  async handleCallback(code: string, state: string): Promise<void> {
    const savedState = sessionStorage.getItem(STATE_STORAGE_KEY);
    if (state !== savedState) {
      throw new Error("State validation failed");
    }

    const verifier = sessionStorage.getItem(VERIFIER_STORAGE_KEY);
    if (!verifier) {
      throw new Error("Code verifier not found");
    }
    console.log(verifier)

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: this.clientId,
      code: code,
      redirect_uri: this.redirectUri,
      code_verifier: verifier,
    });

    const response = await axios.post<HarukiOAuthTokens>(
      `${this.baseUrl}/api/oauth2/token`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    this.saveTokens(response.data);

    sessionStorage.removeItem(STATE_STORAGE_KEY);
    sessionStorage.removeItem(VERIFIER_STORAGE_KEY);
  }

  async refreshToken(): Promise<HarukiOAuthTokens> {
    const tokens = this.getTokens();
    if (!tokens || !tokens.refresh_token) {
      throw new Error("No refresh token available");
    }

    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: this.clientId,
      refresh_token: tokens.refresh_token,
    });

    const response = await axios.post<HarukiOAuthTokens>(
      `${this.baseUrl}/api/oauth2/token`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    this.saveTokens(response.data);
    return response.data;
  }

  async revokeToken(token: string): Promise<void> {
    const params = new URLSearchParams({
      token: token,
      client_id: this.clientId,
    });

    await axios.post(
      `${this.baseUrl}/api/oauth2/revoke`,
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  }

  async getValidAccessToken(): Promise<string | null> {
    const tokens = this.getTokens();
    if (!tokens) return null;

    if (tokens.expires_at && Date.now() >= tokens.expires_at) {
      if (tokens.refresh_token) {
        try {
          const newTokens = await this.refreshToken();
          return newTokens.access_token;
        } catch {
          this.clearTokens();
          return null;
        }
      }
      this.clearTokens();
      return null;
    }

    return tokens.access_token;
  }

  async getUserProfile(): Promise<UserProfile> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await axios.get<{
      status: number;
      message: string;
      updatedData: UserProfile;
    }>(`${this.baseUrl}/api/oauth2/user/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.updatedData;
  }

  async getUserBindings(): Promise<UserBinding[]> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await axios.get<{
      status: number;
      message: string;
      updatedData: UserBinding[];
    }>(`${this.baseUrl}/api/oauth2/user/bindings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data.updatedData;
  }

  async getGameData(
    server: string,
    dataType: string,
    userId: string,
    key?: string
  ): Promise<GameData> {
    const accessToken = await this.getValidAccessToken();
    if (!accessToken) {
      throw new Error("Not authenticated");
    }

    const params = new URLSearchParams();
    if (key) {
      params.append("key", key);
    }

    const response = await axios.get<GameData>(
      `${this.baseUrl}/api/oauth2/game-data/${server}/${dataType}/${userId}`,
      {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  }
}

export const harukiOAuth = new HarukiOAuth();
