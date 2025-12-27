// src/app/application/sidebar/sidebar.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem as PMenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { ImageModule as PImageModule } from 'primeng/image';

import { Auth as AuthService } from '../../../../services/auth/auth';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule,
    PanelMenuModule,
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
    this.buildMenu();
  }

  buildMenu() {
    // Dashboard with submenus - visible to everyone
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        items: [
          {
            label: 'Customer',
            icon: 'pi pi-users',
            routerLink: ['/application/customer'],
          },
          {
            label: 'Products',
            icon: 'pi pi-box',
            routerLink: ['/application/products'],
          },
          {
            label: 'Sales',
            icon: 'pi pi-chart-line',
            routerLink: ['/application/sales'],
          }
        ]
      }
    ];

    // Admin with submenus - visible to admin only
   if (this.authService.isAdmin()) {
  this.menuItems.push({
    label: 'Admin',
    icon: 'pi pi-cog',
    items: [
      {
        label: 'Register',
        icon: 'pi pi-user-plus',
        routerLink: ['/application/register'],
      },
      {
        label: 'Users',
        icon: 'pi pi-user-edit',
        routerLink: ['/application/users'],
      },
      {
        label: 'Settings',
        icon: 'pi pi-sliders-h',
        routerLink: ['/application/settings'],
      }
    ]
  });
}

  }

  generate() {
    this.onClickGenerate.emit();
  }
}
