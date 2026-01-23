// login.component.ts - FULL CODE WITH BOTH SERVICES
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { TooltipModule } from 'primeng/tooltip';

import { Auth as AuthHttpService } from '../../../services/auth/auth'; // ✅ For HTTP calls
import { AuthService } from '../../../services/auth/auth.service'; // ✅ NEW: For user data management
import { Auth as AuthModel } from '../../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    InputTextModule,
    IconFieldModule,
    ButtonModule,
    ToastModule,
    PasswordModule,
    TooltipModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [MessageService]
})
export class Login {
  credentials: AuthModel = new AuthModel();
  isProcessing: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly authHttpService: AuthHttpService, // ✅ Renamed
    private readonly authService: AuthService, // ✅ NEW: For user data
    private messageService: MessageService
  ) {}

  goToLanding() {
    this.router.navigate(['/landing']);
  }

  async login() {
    console.log('login() called, credentials:', this.credentials);

    if (!this.credentials.username || !this.credentials.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter username and password'
      });
      return;
    }

    this.isProcessing = true;

    try {
      console.log('🚀 About to call authHttpService.login...');
      
      const res = await this.authHttpService.login(this.credentials); // ✅ Use authHttpService
      
      console.log('📦 Got response from authHttpService:', res);
      
      if (res.access_token) {
        // ✅ Save user data using AuthService
        if (res.user) {
          this.authService.setUserData({ // ✅ Use authService
            id: res.user.id,
            username: res.user.username,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
            photoUrl: res.user.photoUrl || null
          });
          console.log('✅ User data saved:', res.user);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!' 
        });

        setTimeout(() => {
          this.router.navigate(['./application/home']);
        }, 1200);
      }

    } catch (error) {
      console.error('❌ Login error caught:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid username or password'
      });
    } 
    finally {
      this.isProcessing = false;
      console.log('✅ Login process finished');
    }
  }
}
