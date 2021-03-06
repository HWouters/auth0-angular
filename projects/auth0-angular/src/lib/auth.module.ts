import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthConfig } from './auth-config';
import { AuthEffects } from './effects/auth.effects';
import { JwtInterceptor } from './jwt.interceptor';
import { reducer } from './reducers/auth.reducer';
import { featureKey } from './store';

@NgModule({
  declarations: [],
  imports: [StoreModule.forFeature(featureKey, reducer), EffectsModule.forFeature([AuthEffects])],
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
