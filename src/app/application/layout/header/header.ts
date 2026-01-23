// header.ts - FULL CODE WITH IMAGE FIX
import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { MenubarModule as PMenubarModule } from 'primeng/menubar';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { BadgeModule as PBadgeModule } from 'primeng/badge';
import { AvatarModule as PAvatarModule } from 'primeng/avatar';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ToastModule as PToastModule } from 'primeng/toast';
import { ConfirmDialog as PConfirmDialog } from 'primeng/confirmdialog';

import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

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
export class Header implements OnInit, OnDestroy {

  @Output() onToggleSidebar = new EventEmitter<void>();

  userName: string = 'Jane Doe';
  email: string = 'user@example.com';
  photoUrl: SafeUrl = 'https://i.pravatar.cc/150?img=47';
  
  private userSubscription?: Subscription;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const authToken = localStorage.getItem('auth_token');
    if (!authToken) {
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // ✅ Subscribe to user data changes
    this.userSubscription = this.authService.currentUser.subscribe(userData => {
      if (userData) {
        this.userName = userData.name || userData.username;
        this.email = userData.email;
        
        // ✅ FIXED: Handle both base64 and URL images
        if (userData.photoUrl) {
          if (userData.photoUrl.startsWith('data:image')) {
            // Base64 image - sanitize it
            this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(userData.photoUrl);
          } else {
            // Regular URL
            this.photoUrl = userData.photoUrl;
          }
        } else {
          // Default avatar
          this.photoUrl = 'https://i.pravatar.cc/150?img=47';
        }
        
        console.log('✅ Header - User data loaded:', userData);
      }
    });

    // ✅ Fallback - Get user data from localStorage
    const userData = this.authService.getUserData();
    if (userData) {
      this.userName = userData.name || userData.username;
      this.email = userData.email;
      
      // ✅ FIXED: Handle both base64 and URL images
      if (userData.photoUrl) {
        if (userData.photoUrl.startsWith('data:image')) {
          // Base64 image - sanitize it
          this.photoUrl = this.sanitizer.bypassSecurityTrustUrl(userData.photoUrl);
        } else {
          // Regular URL
          this.photoUrl = userData.photoUrl;
        }
      } else {
        // Default avatar
        this.photoUrl = 'https://i.pravatar.cc/150?img=47';
      }
      
      console.log('✅ Header - User data from localStorage:', userData);
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

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
        this.authService.clearUserData();

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
}
