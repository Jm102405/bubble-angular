// src/services/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  sub: string;
  username: string;
  role: 'admin' | 'user' | string;
  exp?: number;
  iat?: number;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'access_token';

  setToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.storageKey);
  }

  getPayload(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    return this.getPayload()?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isLoggedIn(): boolean {
    const p = this.getPayload();
    if (!p) return false;
    if (!p.exp) return true;
    return Date.now() / 1000 < p.exp;
  }
}
