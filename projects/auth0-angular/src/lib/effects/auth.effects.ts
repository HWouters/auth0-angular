import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { init, signedIn, signedOut, signIn, signInCompleted, signInFailed, signOut } from '../actions/auth.actions';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthEffects implements OnInitEffects {
  public readonly signIn$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signIn),
        switchMap(action => this.auth.loginWithRedirect({ target: action.returnUrl })),
      ),
    { dispatch: false },
  );

  public readonly signInCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signInCompleted),
      switchMap(() =>
        this.auth.getUser().pipe(
          map(user => signedIn({ user })),
          catchError(error => of(signInFailed({ error }))),
        ),
      ),
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
      tap(() => {
        try {
          this.auth.logout();
        } catch {}
      }),
      map(() => signedOut()),
    ),
  );

  public readonly init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(init),
      switchMap(() => {
        const params = window.location.search;

        if (params.includes('code=') && params.includes('state=')) {
          return this.completeSignIn();
        } else {
          return this.auth.isAuthenticated().pipe(
            switchMap(auth => this.getAuthResult(auth)),
            catchError(error => of(signInFailed({ error }))),
          );
        }
      }),
    ),
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  public ngrxOnInitEffects() {
    return init();
  }

  private getAuthResult(auth: boolean) {
    if (auth) {
      return this.auth.getUser().pipe(map(user => signedIn({ user })));
    } else {
      return of(signedOut());
    }
  }

  private completeSignIn() {
    return this.auth.handleRedirectCallback().pipe(
      map(state => signInCompleted({ state })),
      catchError(error => of(signInFailed({ error }))),
    );
  }
}
