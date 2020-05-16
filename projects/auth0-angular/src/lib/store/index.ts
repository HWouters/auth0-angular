import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from '../state/auth.state';

export const featureKey = 'auth';

const selectState = createFeatureSelector<State>(featureKey);

export const getAuthenticated = createSelector(selectState, state => state.authenticated);

export const getUser = createSelector(selectState, state => {
  return state.user;
});
