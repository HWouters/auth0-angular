import { createAction, props } from '@ngrx/store';
import { Profile } from '../state/auth.state';

export const signIn = createAction('@thecla/auth0-angular/sign-in', props<{ returnUrl: string }>());

export const signInCompleted = createAction(
  '@thecla/auth0-angular/sign-in-completed',
  props<{ state: { target: string } }>()
);

export const signedIn = createAction('@thecla/auth0-angular/signed-in', props<Profile>());

export const signInFailed = createAction('@thecla/auth0-angular/sign-in-failed', props<{ error: Error }>());

export const signOut = createAction('@thecla/auth0-angular/sign-out');

export const signedOut = createAction('@thecla/auth0-angular/signed-out');
