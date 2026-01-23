// src/services/auth/auth.service.ts - UPDATED FULL CODE
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

type JwtPayload = {
  sub: string;
  username: string;
  role: 'admin' | 'user' | string;
  exp?: number;
  iat?: number;
};

// ✅ NEW: User data interface
export interface UserData {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'access_token';
  private userDataKey = 'user_data'; // ✅ NEW

  // ✅ NEW: User data observable
  private currentUserSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<UserData | null>;

  constructor() {
    // ✅ NEW: Initialize user data from localStorage
    const storedUser = localStorage.getItem(this.userDataKey);
    this.currentUserSubject = new BehaviorSubject<UserData | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

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

  // ✅ NEW: User data management methods
  public get currentUserValue(): UserData | null {
    return this.currentUserSubject.value;
  }

  setUserData(userData: UserData): void {
    localStorage.setItem(this.userDataKey, JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }

  getUserData(): UserData | null {
    const storedUser = localStorage.getItem(this.userDataKey);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  clearUserData(): void {
    localStorage.removeItem(this.userDataKey);
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }
}
