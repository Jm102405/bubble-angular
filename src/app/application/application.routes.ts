import { Routes } from '@angular/router';
import { Application } from "./application";
import { AuthGuard } from '../../services/auth/auth.guard';

export const routes: Routes = [{
  path: "",
  component: Application,
  canActivate: [AuthGuard],
  children: [
    { path: '', redirectTo: '/application/home', pathMatch: 'full' },
    {
      path: "home",
      loadComponent: () => import('./home/home').then(m => m.Home)
    },
    {
      path: "customer",
      loadComponent: () => import('./customer/customer').then(m => m.Customer)
    },
    {
      path: "products",
      loadComponent: () => import('./products/products').then(m => m.Products)
    },
    {
      path: 'register',
      loadComponent: () => import('./register/register').then(m => m.Register)
    },
    {
      path: "sales",
      loadComponent: () => import('./sales/sales').then(m => m.Sales)
    },
    {
      path: "users",
      loadComponent: () => import('./users/users').then(m => m.Users)
    },
    {
      path: "settings",
      loadComponent: () => import('./settings/settings').then(m => m.Settings)
    },
  ]
}];
