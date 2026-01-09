import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ConfirmationService, MessageService } from 'primeng/api';
import { MenubarModule as PMenubarModule } from 'primeng/menubar';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { BadgeModule as PBadgeModule } from 'primeng/badge';
import { AvatarModule as PAvatarModule } from 'primeng/avatar';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ToastModule as PToastModule } from 'primeng/toast';
import { ConfirmDialog as PConfirmDialog } from 'primeng/confirmdialog';

import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    PMenubarModule,
    PButtonModule,
    PBadgeModule,
    PAvatarModule,
    PInputTextModule,
    PToastModule,
    PConfirmDialog,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  providers: [MessageService, ConfirmationService],
})
export class Header {

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  @Output() onToggleSidebar = new EventEmitter<void>();

  userName: string = 'Jane Doe';
  email: string = 'user@example.com';
  photoUrl: SafeUrl = 'https://i.pravatar.cc/150?img=47'; // Random avatar

  toggleSidebar() {
    this.onToggleSidebar.emit();
  }

  toggleTheme(isDarkMode: boolean) {
    const element = document.querySelector('html') as HTMLElement;
    element.classList.toggle('my-app-dark');
  }

  onLogoutClick() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Logout Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Logout',
      acceptButtonStyleClass: 'p-button-danger',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-text p-button-secondary',
      accept: () => {
        localStorage.removeItem('auth_token');

        this.messageService.add({
          severity: 'success',
          summary: 'Logged Out',
          detail: 'You have been successfully logged out.',
          life: 2000,
        });

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
    });
  }

  ngOnInit() {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
       this.router.navigate(['/auth/login']);
    }
    
    // You can fetch user data from API here
    // Example:
    // this.userName = authService.getUserName();
    // this.email = authService.getUserEmail();
    // this.photoUrl = authService.getUserPhoto();
  }
}
