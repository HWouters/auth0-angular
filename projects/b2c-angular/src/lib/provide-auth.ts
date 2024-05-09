import { makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthConfig } from './auth-config';
import { AuthEffects } from './auth.effects';
import { authFeature } from './auth.reducer';

export function provideAuth(config: AuthConfig) {
  const effects = provideEffects(AuthEffects);
  const state = provideState(authFeature);

  return makeEnvironmentProviders([
    effects,
    state,
    {
      provide: AuthConfig,
      useValue: config,
    },
  ]);
}
