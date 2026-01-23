import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  @Output() onMenuItemClick = new EventEmitter<void>();

  menuItems: PMenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildMenu();
    
    // Auto-close sidebar on route change (mobile)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile()) {
          this.onMenuItemClick.emit();
        }
      });
  }

  buildMenu() {
    // Organized menu structure
    this.menuItems = [
      // 1. Dashboard
      {
        label: 'Dashboard',
        icon: 'pi pi-th-large',
        routerLink: ['/application/home'],
        command: () => this.handleMenuClick()
      },
      // 2. Sales
      {
        label: 'Sales',
        icon: 'pi pi-dollar',
        routerLink: ['/application/sales'],
        command: () => this.handleMenuClick()
      },
      // 3. Product
      {
        label: 'Product',
        icon: 'pi pi-box',
        routerLink: ['/application/products'],
        command: () => this.handleMenuClick()
      },
      // 4. Customer
      {
        label: 'Customer',
        icon: 'pi pi-users',
        routerLink: ['/application/customer'],
        command: () => this.handleMenuClick()
      }
    ];

    // 5. Register (Admin only)
    if (this.authService.isAdmin()) {
      this.menuItems.push({
        label: 'Register',
        icon: 'pi pi-user-plus',
        routerLink: ['/application/register'],
        command: () => this.handleMenuClick()
      });
    }

    // 6. Users (Admin only)
    if (this.authService.isAdmin()) {
      this.menuItems.push({
        label: 'Users',
        icon: 'pi pi-user-edit',
        routerLink: ['/application/users'],
        command: () => this.handleMenuClick()
      });
    }

    // 7. Settings (Always visible)
    this.menuItems.push({
      label: 'Settings',
      icon: 'pi pi-cog',
      routerLink: ['/application/settings'],
      command: () => this.handleMenuClick()
    });
  }

  handleMenuClick() {
    // Only close sidebar on mobile
    if (this.isMobile()) {
      this.onMenuItemClick.emit();
    }
  }

  isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  generate() {
    this.onClickGenerate.emit();
  }
}
