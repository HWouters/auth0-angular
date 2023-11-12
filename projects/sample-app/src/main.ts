import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { jwtInterceptor, provideAuth } from '@thecla/auth-angular';
import { appRoutes } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { authConfig, environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ connectInZone: true }),
    provideAuth(authConfig),
  ],
}).catch(err => console.error(err));
