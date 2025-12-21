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

import { Auth as AuthService } from '../../../services/auth/auth';
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
    ToastModule
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
    private readonly authService: AuthService,
    private messageService: MessageService
  ) { }

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
      console.log('🚀 About to call ahuthService.login...');
      console.log('🚀 authService object:', this.authService);
      
      const res = await this.authService.login(this.credentials);
      
      console.log('🚀 Got response from authService:', res);
      const token = res.access_token;
      
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('currentUser', this.credentials.username);

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful!' 
        });

        setTimeout(() => {
          this.router.navigate(['/application/home']);
        }, 1200);
      }

    } catch (error) {
      console.error('🚀 Login error caught:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid username or password'
      });
    } 
    finally {
      this.isProcessing = false;
      console.log('🚀 Login process finished');
    }
  }
}
