import { Routes } from '@angular/router';
import { Auth } from "./auth"

export const routes: Routes = [{
  path: "",
  component: Auth,
  children: [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
      path: "login",
      loadComponent: () => import('./login/login').then(m => m.Login)
    },
  ]
}];
