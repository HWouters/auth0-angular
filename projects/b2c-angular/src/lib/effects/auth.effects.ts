import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthError, BrowserAuthErrorMessage } from '@azure/msal-browser';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { asyncScheduler, of, SchedulerLike } from 'rxjs';
import { catchError, filter, map, observeOn, switchMap, tap } from 'rxjs/operators';
import {
  resetPassword,
  signedIn,
  signedOut,
  signIn,
  signInCompleted,
  signInFailed,
  signInRedirected,
  signOut,
} from '../actions/auth.actions';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}
  public readonly signIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signIn),
      switchMap(action =>
        this.auth.loginWithRedirect({ target: action.returnUrl }).pipe(
          map(() => signInRedirected()),
          catchError(error => of(signInFailed({ error })))
        )
      )
    )
  );

  public readonly passwordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      switchMap(action =>
        this.auth.resetPasswordWithRedirect({ target: action.returnUrl }).pipe(
          map(() => signInRedirected()),
          catchError(error => of(signInFailed({ error })))
        )
      )
    )
  );

  public readonly signInCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInCompleted),
      map(action => (action.state.passwordReset ? signOut() : signedIn(action.user)))
    )
  );

  public readonly redirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInCompleted),
        switchMap(action => this.router.navigateByUrl(action.state.target, { replaceUrl: true }))
      ),
    { dispatch: false }
  );

  public readonly signOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signOut),
      switchMap(_ =>
        this.auth.logout().pipe(
          map(() => signedOut()),
          catchError(() => of(signedOut()))
        )
      )
    )
  );

  public readonly init$ = createEffect(() => ({ scheduler = asyncScheduler } = {}) => {
    const params = window.location.hash;

    if (
      (params.includes('code=') && params.includes('state=')) ||
      (params.includes('error=') && params.includes('error_description='))
    ) {
      return this.completeSignIn(scheduler);
    } else {
      return this.auth.checkSession().pipe(
        map(user => this.getAuthResult(user)),
        catchError(error => of(signInFailed({ error }))),
        observeOn(scheduler)
      );
    }
  });

  public readonly resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInFailed),
      filter(action => action.error instanceof AuthError),
      map(action => action.error as AuthError),
      filter(AuthEffects.isForgotPasswordError),
      map(() => resetPassword({ returnUrl: '/' }))
    )
  );

  public readonly failed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInFailed),
      filter(action => action.error instanceof AuthError),
      map(action => action.error as AuthError),
      filter(AuthEffects.isInteractionInProgress),
      map(() => signOut())
    )
  );

  private static isForgotPasswordError(error: AuthError) {
    return error.errorCode === 'access_denied' && error.errorMessage.indexOf('AADB2C90118') !== -1;
  }

  private static isInteractionInProgress(error: AuthError) {
    return error.errorCode === BrowserAuthErrorMessage.interactionInProgress.code;
  }

  private getAuthResult(user: { sub: string } | undefined) {
    if (user) {
      return signedIn(user);
    } else {
      return signedOut();
    }
  }

  private completeSignIn(scheduler: SchedulerLike) {
    return this.auth.handleRedirectCallback().pipe(
      map(result => signInCompleted({ state: result.state, user: result.user })),
      catchError(error => of(signInFailed({ error }))),
      observeOn(scheduler)
    );
  }
}
