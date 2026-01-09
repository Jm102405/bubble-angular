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
    // Simple flat menu structure to match the design
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-th-large',
        routerLink: ['/application/home'],
      },
      {
        label: 'Customer',
        icon: 'pi pi-users',
        routerLink: ['/application/customer'],
      },
      {
        label: 'Product',
        icon: 'pi pi-box',
        routerLink: ['/application/products'],
      },
      {
        label: 'Sales',
        icon: 'pi pi-dollar',
        routerLink: ['/application/sales'],
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: ['/application/settings'],
      }
    ];

    // Admin-only menu items
    if (this.authService.isAdmin()) {
      this.menuItems.push({
        label: 'Register',
        icon: 'pi pi-user-plus',
        routerLink: ['/application/register'],
      });
      this.menuItems.push({
        label: 'Users',
        icon: 'pi pi-user-edit',
        routerLink: ['/application/users'],
      });
    }
  }

  generate() {
    this.onClickGenerate.emit();
  }
}
