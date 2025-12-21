import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import {
  Auth as AuthModel,
  AuthResponse as AuthResponseModel
} from '../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(
    private http: HttpClient
  ) { }

  private apiUrl = 'http://localhost:3000/api/auth';

  // LOGIN
  async login(data: AuthModel): Promise<AuthResponseModel> {
    console.log('🔥 Auth service login called with:', data);
    console.log('🔥 Endpoint URL:', `${this.apiUrl}/login`);

    const endpoint = `${this.apiUrl}/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      console.log('🔥 About to make HTTP POST request (login)...');
      const result = await firstValueFrom(
        this.http.post<AuthResponseModel>(endpoint, data, { headers })
      );
      console.log('🔥 Backend response (login):', result);
      return result;
    } catch (error) {
      console.error('🔥 Auth service login error:', error);
      throw error;
    }
  }

  // REGISTER
  async register(data: {
    username: string;
    password: string;
    email: string;
    name: string;
    role?: string;
  }): Promise<any> {
    console.log('🟢 Auth service register called with:', data);
    console.log('🟢 Endpoint URL:', `${this.apiUrl}/register`);

    const endpoint = `${this.apiUrl}/register`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      console.log('🟢 About to make HTTP POST request (register)...');
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
}
