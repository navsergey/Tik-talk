import { Routes } from '@angular/router';
import {SearchPage} from './pages/search-page/search-page';
import {LoginPage} from './pages/login-page/login-page';
import {ProfilePage} from './pages/profile-page/profile-page';
import {Layout} from './common-ui/layout/layout';

export const routes: Routes = [
  {path: '', component: Layout, children: [
      {path: '', component:SearchPage},
      {path: 'profile', component: ProfilePage},
    ]},
   //Рендеринг в зависимости от URL
  {path: 'login', component: LoginPage},

];
