import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthConfig } from './auth-config';
import { AuthEffects } from './auth.effects';
import { authFeature } from './auth.reducer';
import { JwtInterceptor } from './jwt.interceptor';

@NgModule({
  declarations: [],
  imports: [StoreModule.forFeature(authFeature), EffectsModule.forFeature([AuthEffects])],
  exports: [],
})
export class AuthModule {
  public static forRoot(config: AuthConfig): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: AuthConfig,
          useValue: config,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
      ],
    };
  }
}
