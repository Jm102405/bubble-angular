// src/app/application/sidebar/sidebar.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem as PMenuItem } from 'primeng/api';
import { MenuModule as PMenuModule } from 'primeng/menu';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { ImageModule as PImageModule } from 'primeng/image';

import { Auth as AuthService } from '../../../../services/auth/auth';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule,
    PMenuModule,
    PButtonModule,
    PImageModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  @Output() onClickGenerate = new EventEmitter<void>();

  menuItems: PMenuItem[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // ✅ Build menu items based on user role
    this.buildMenu();
  }

  buildMenu() {
    // Home - visible to everyone
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/application/home'],
      }
    ];

    // Register - visible to admin only
    if (this.authService.isAdmin()) {
      this.menuItems.push({
        label: 'Register',
        icon: 'pi pi-user-plus',
        routerLink: ['/application/register'],
      });
    }
  }

  generate() {
    this.onClickGenerate.emit();
  }
}
