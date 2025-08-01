import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthError, BrowserAuthErrorCodes } from '@azure/msal-browser';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import {
  init,
  resetPassword,
  signIn,
  signInCompleted,
  signInFailed,
  signInRedirected,
  signOut,
  signedIn,
  signedOut,
} from './auth.actions';
import { AuthService } from './auth.service';

@Injectable()
export class AuthEffects implements OnInitEffects {
  private readonly actions$ = inject(Actions);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  public readonly signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signIn),
      switchMap(action =>
        this.auth.loginWithRedirect({ target: action.returnUrl }).pipe(
          map(() => signInRedirected()),
          catchError(error => of(signInFailed({ error }))),
        ),
      ),
    ),
  );

  public readonly passwordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      switchMap(action =>
        this.auth.resetPasswordWithRedirect({ target: action.returnUrl }).pipe(
          map(() => signInRedirected()),
          catchError(error => of(signInFailed({ error }))),
        ),
      ),
    ),
  );

  public readonly signInCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInCompleted),
      map(({ state, user }) => (state.passwordReset ? signOut() : signedIn({ user }))),
    ),
  );

  public readonly redirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInCompleted),
        switchMap(action => this.router.navigateByUrl(action.state.target, { replaceUrl: true })),
      ),
    { dispatch: false },
  );

  public readonly signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signOut),
      switchMap(_ =>
        this.auth.logout().pipe(
          map(() => signedOut()),
          catchError(() => of(signedOut())),
        ),
      ),
    ),
  );

  public readonly init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(init),
      switchMap(() => {
        const params = window.location.hash;

        if (
          (params.includes('code=') && params.includes('state=')) ||
          (params.includes('error=') && params.includes('error_description='))
        ) {
          return this.completeSignIn();
        } else {
          return this.auth.checkSession().pipe(
            map(user => this.getAuthResult(user)),
            catchError(error => of(signInFailed({ error }))),
          );
        }
      }),
    ),
  );

  public readonly resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInFailed),
      filter(action => action.error instanceof AuthError),
      map(action => action.error as AuthError),
      filter(AuthEffects.isForgotPasswordError),
      map(() => resetPassword({ returnUrl: '/' })),
    ),
  );

  public readonly failed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInFailed),
      filter(action => action.error instanceof AuthError),
      map(action => action.error as AuthError),
      filter(AuthEffects.isInteractionInProgress),
      map(() => signOut()),
    ),
  );

  public ngrxOnInitEffects() {
    return init();
  }

  private static isForgotPasswordError(error: AuthError) {
    return error.errorCode === 'access_denied' && error.errorMessage.indexOf('AADB2C90118') !== -1;
  }

  private static isInteractionInProgress(error: AuthError) {
    return error.errorCode === BrowserAuthErrorCodes.interactionInProgress;
  }

  private getAuthResult(user: { sub: string } | undefined) {
    if (user) {
      return signedIn({ user });
    } else {
      return signedOut();
    }
  }

  private completeSignIn() {
    return this.auth.handleRedirectCallback().pipe(
      map(result => signInCompleted({ state: result.state, user: result.user })),
      catchError(error => of(signInFailed({ error }))),
    );
  }
}
