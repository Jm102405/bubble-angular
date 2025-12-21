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

  async login(data: AuthModel): Promise<AuthResponseModel> {
    console.log('🔥 Auth service login called with:', data);
    console.log('🔥 Endpoint URL:', `${this.apiUrl}/login`);
    
    const endpoint = `${this.apiUrl}/login`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    try {
      console.log('🔥 About to make HTTP POST request...');
      const result = await firstValueFrom(
        this.http.post<AuthResponseModel>(endpoint, data, { headers })
      );
      console.log('🔥 Backend response:', result);
      return result;
    } catch (error) {
      console.error('🔥 Auth service error:', error);
      throw error;
    }
  }
}
