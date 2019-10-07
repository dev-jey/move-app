import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginRedirectComponent } from './auth/login-redirect/login-redirect.component';
import { HomeRouteActivatorGuard } from './home/home-route-activator.guard';
import { UniversalRouteActivatorGuard } from './shared/universal-route-activator.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [HomeRouteActivatorGuard]
  },
  { path: 'login/:redirect', component: LoginRedirectComponent },
  { path: 'admin', pathMatch: 'full', redirectTo: '/admin/dashboard' },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [UniversalRouteActivatorGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
