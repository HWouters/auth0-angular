import { makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthConfig } from './auth-config';
import { AuthEffects } from './effects/auth.effects';
import { reducer } from './reducers/auth.reducer';
import { featureKey } from './store';

export function provideAuth(config: AuthConfig) {
  const effects = provideEffects(AuthEffects);
  const state = provideState(featureKey, reducer);

  return makeEnvironmentProviders([
    effects,
    state,
    {
      provide: AuthConfig,
      useValue: config,
    },
  ]);
}
