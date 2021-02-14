import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@thecla/auth-angular';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';

const appRoutes: Routes = [
  { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
})
export class AppRoutingModule {}
