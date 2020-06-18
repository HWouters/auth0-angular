import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { asyncScheduler, of } from 'rxjs';
import { catchError, filter, map, observeOn, switchMap, tap } from 'rxjs/operators';
import {
  completeSignIn,
  signedIn,
  signedOut,
  signIn,
  signInCompleted,
  signInFailed,
  signOut,
} from '../actions/auth.actions';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects {
  public readonly signInFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInFailed),
      tap(action => console.error(action.error)),
      map(() => signOut())
    )
  );

  public readonly signIn$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signIn),
        switchMap(action => this.auth.loginWithRedirect({ target: action.returnUrl }))
      ),
    { dispatch: false }
  );

  public readonly completeSignIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(completeSignIn),
      switchMap(() =>
        this.auth.handleRedirectCallback().pipe(
          map(state => signInCompleted({ state })),
          catchError(error => of(signInFailed({ error })))
        )
      )
    )
  );

  public readonly signInCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInCompleted),
      switchMap(() =>
        this.auth.getUser().pipe(
          map(user => signedIn(user)),
          catchError(error => of(signInFailed({ error })))
        )
      )
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
      tap(() => {
        try {
          this.auth.logout();
        } catch {}
      }),
      map(() => signedOut())
    )
  );

  public readonly init$ = createEffect(() => ({ scheduler = asyncScheduler } = {}) => {
    const params = window.location.search;

    if (params.includes('code=') && params.includes('state=')) {
      return of(completeSignIn()).pipe(observeOn(scheduler));
    } else {
      return this.auth.isAuthenticated().pipe(
        switchMap(auth => this.getAuthResult(auth)),
        catchError(error => of(signInFailed({ error }))),
        observeOn(scheduler)
      );
    }
  });

  constructor(
    private readonly actions$: Actions,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  private getAuthResult(auth: boolean) {
    if (auth) {
      return this.auth.getUser().pipe(map(user => signedIn(user)));
    } else {
      return of(signedOut());
    }
  }
}
