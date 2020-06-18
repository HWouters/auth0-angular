import { createAction, props } from '@ngrx/store';

export const signIn = createAction('@thecla/auth0-angular/sign-in', props<{ returnUrl: string }>());

export const completeSignIn = createAction('@thecla/auth0-angular/complete-sign-in');

export const signInCompleted = createAction('@thecla/auth0-angular/sign-in-completed', props<{ state: any }>());

export const signedIn = createAction(
  '@thecla/auth0-angular/signed-in',
  props<{
    sub: string;
    name?: string;
    nickname?: string;
    picture?: string;
    email?: string;
    [key: string]: any;
  }>()
);

export const signInFailed = createAction('@thecla/auth0-angular/sign-in-failed', props<{ error: Error }>());

export const signOut = createAction('@thecla/auth0-angular/sign-out');
export const signedOut = createAction('@thecla/auth0-angular/signed-out');
