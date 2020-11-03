import { createFeatureSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { State } from '../state/auth.state';

export const featureKey = 'auth';

export const selectState = createFeatureSelector<State>(featureKey);

export const isAuthenticated = pipe(
  select(selectState),
  filter(state => !state.authenticating),
  map(state => state.authenticated)
);

export const getUser = pipe(
  select(selectState),
  filter(state => !state.authenticating),
  map(state => state.user)
);
