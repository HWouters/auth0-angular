import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { State } from '../state/auth.state';

export const featureKey = 'auth';

export const selectState = createFeatureSelector<State>(featureKey);

export const isAuthenticated = pipe(
  select(selectState),
  filter(auth => !auth.authenticating),
  map(auth => auth.authenticated)
);

export const getUser = createSelector(selectState, state => {
  return state.user;
});
