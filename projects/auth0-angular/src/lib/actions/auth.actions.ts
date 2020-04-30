import { createAction, props } from '@ngrx/store';

export const signIn = createAction('@auth0-angular/sign-in', props<{ returnUrl: string }>());

export const completeSignIn = createAction('@auth0-angular/complete-sign-in');

export const signInCompleted = createAction('@auth0-angular/sign-in-completed', props<{ state: any }>());

export const signedIn = createAction(
  '@auth0-angular/signed-in',
  props<{
    sub: string;
    name?: string;
    nickname?: string;
    picture?: string;
    email?: string;
    [key: string]: any;
  }>()
);

export const signInFailed = createAction('@auth0-angular/sign-in-failed', props<{ error: Error }>());

export const signOut = createAction('@auth0-angular/sign-out');
export const signedOut = createAction('@auth0-angular/signed-out');
