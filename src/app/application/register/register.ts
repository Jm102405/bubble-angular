import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';

import { Auth as AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    FileUploadModule,
    AvatarModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  providers: [MessageService]
})
export class Register {
  registrationForm!: FormGroup;
  isProcessing = false;
  profileImagePreview: string | null = null;
  profileImageBase64: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private auth: AuthService,
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onFileSelected(event: any) {
    const file: File = event.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a valid image file'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Image size must be less than 5MB'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.profileImageBase64 = e.target.result;
      this.profileImagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeProfileImage() {
    this.profileImagePreview = null;
    this.profileImageBase64 = null;
  }

  async onSubmit() {
    if (this.registrationForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly'
      });
      return;
    }

    this.isProcessing = true;

    try {
      const formValue = this.registrationForm.value;

      const payload = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        name: formValue.username,
        role: 'user',
        // profileImage: this.profileImageBase64,
      };

      console.log('🟢 Sending register payload to backend:', payload);

      const result = await this.auth.register(payload);
      console.log('🟢 Register response from backend:', result);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: result?.message || 'Account registered successfully!'
      });

      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500);

    } catch (error: any) {
      console.error('Registration failed:', error);

      const msg = error?.error?.message || 'Registration failed. Please try again.';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: msg
      });

    } finally {
      this.isProcessing = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
