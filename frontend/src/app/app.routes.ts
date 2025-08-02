import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AboutUsComponent } from './pages/aboutUs/aboutUs.component';
import { WorkspacesComponent } from './pages/workspaces/workspaces.component';
import { SolutionsComponent } from './pages/solutions/solutions.component';
import { NotFoundComponent } from './pages/notFound/notFound.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'workspaces', component: WorkspacesComponent },
  { path: 'solutions', component: SolutionsComponent },
  { path: '**', component: NotFoundComponent }
];
