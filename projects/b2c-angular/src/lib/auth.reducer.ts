import { createFeature, createReducer, on } from '@ngrx/store';
import { signInFailed, signedIn, signedOut } from './auth.actions';

export interface Profile {
  [key: string]: any;
  sub: string;
  name?: string;
  nickname?: string;
  picture?: string;
  email?: string;
}

export interface State {
  authenticating: boolean;
  authenticated: boolean;
  user: Profile | undefined;
}

export const noAuthentication: State = {
  authenticating: false,
  authenticated: false,
  user: undefined,
};

export const startAuthentication: State = {
  authenticating: true,
  authenticated: false,
  user: undefined,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    startAuthentication,
    on(signedIn, (state, { user }) => ({
      ...state,
      authenticating: false,
      authenticated: true,
      user,
    })),
    on(signedOut, _ => noAuthentication),
    on(signInFailed, _ => noAuthentication),
  ),
});

export const { selectAuthState, reducer } = authFeature;
