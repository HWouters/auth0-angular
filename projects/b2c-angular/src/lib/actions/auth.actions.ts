import { createAction, props } from '@ngrx/store';
import { Profile } from '../state/auth.state';

export const signIn = createAction('@thecla/b2c-angular/sign-in', props<{ returnUrl: string }>());

export const signInRedirected = createAction('@thecla/b2c-angular/sign-in-redirected');

export const signInCompleted = createAction(
  '@thecla/b2c-angular/sign-in-completed',
  props<{ state: { target: string; passwordReset: boolean }; user: Profile }>()
);

export const signedIn = createAction('@thecla/b2c-angular/signed-in', props<Profile>());

export const signInFailed = createAction('@thecla/b2c-angular/sign-in-failed', props<{ error: Error }>());

export const signOut = createAction('@thecla/b2c-angular/sign-out');

export const signedOut = createAction('@thecla/b2c-angular/signed-out');

export const resetPassword = createAction('@thecla/b2c-angular/reset-password', props<{ returnUrl: string }>());
