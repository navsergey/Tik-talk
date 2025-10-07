import { Routes } from '@angular/router';
import {SearchPage} from './pages/search-page/search-page';
import {LoginPage} from './pages/login-page/login-page';
import {ProfilePage} from './pages/profile-page/profile-page';
import {Layout} from './common-ui/layout/layout';
import {canActivateAuth} from './auth/acces.guard';
import {SettingsPage} from './pages/settings-page/settings-page';

export const routes: Routes = [
  {path: '', component: Layout, children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {path: 'profile/:id', component: ProfilePage}, //:id - это переменная
      {path: 'settings', component: SettingsPage}, //:id - это переменная
      {path: 'search', component:SearchPage},
    ],
    canActivate: [canActivateAuth]
  },
   //Рендеринг в зависимости от URL
  {path: 'login', component: LoginPage},

];
