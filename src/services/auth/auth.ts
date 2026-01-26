// src/services/auth/auth.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import {
  Auth as AuthModel,
  AuthResponse as AuthResponseModel
} from '../../models/auth.model';

type JwtPayload = {
  sub: string;
  username: string;
  role: 'admin' | 'user' | string;
  exp?: number;
  iat?: number;
};

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000/api/auth';
  private storageKey = 'auth_token';

  constructor(private http: HttpClient) {}

  // ========== HTTP REQUESTS ==========
  
  async login(data: AuthModel): Promise<AuthResponseModel> {
    console.log('🔥 Auth service login called with:', data);
    const endpoint = `${this.apiUrl}/login`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    try {
      const result = await firstValueFrom(
        this.http.post<AuthResponseModel>(endpoint, data, { headers })
      );
      console.log('🔥 Backend response (login):', result);
      
      // ✅ Auto-save token after successful login
      if (result.access_token) {
        this.setToken(result.access_token);
      }
      
      return result;
    } catch (error) {
      console.error('🔥 Auth service login error:', error);
      throw error;
    }
  }

  async register(data: {
    username: string;
    password: string;
    email: string;
    name: string;
    role?: string;
  }): Promise<any> {
    console.log('🟢 Auth service register called with:', data);
    const endpoint = `${this.apiUrl}/register`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    try {
      const result = await firstValueFrom(
        this.http.post<any>(endpoint, data, { headers })
      );
      console.log('🟢 Backend response (register):', result);
      return result;
    } catch (error) {
      console.error('🟢 Auth service register error:', error);
      throw error;
    }
  }

  // ========== JWT TOKEN MANAGEMENT ==========

  setToken(token: string): void {
    localStorage.setItem(this.storageKey, token);
    localStorage.setItem('currentUser', this.getPayload()?.username || '');
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('currentUser');
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
