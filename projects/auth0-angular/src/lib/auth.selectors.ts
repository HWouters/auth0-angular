import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { selectAuthState } from './auth.reducer';

export const isAuthenticated = pipe(
  select(selectAuthState),
  filter(state => !state.authenticating),
  map(state => state.authenticated),
);

export const getUser = pipe(
  select(selectAuthState),
  filter(state => !state.authenticating),
  map(state => state.user),
);

export function getUserSignal() {
  return toSignal(inject(Store).pipe(getUser));
}

export function getIsAuthenticatedSignal() {
  return toSignal(inject(Store).pipe(isAuthenticated));
}
