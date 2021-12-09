import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, tap } from 'rxjs/operators';
import { signIn } from './actions/auth.actions';
import { isAuthenticated } from './store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly authenticated$ = this.store.pipe(isAuthenticated);

  public constructor(private readonly store: Store) {}

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticated$.pipe(
      tap(auth => {
        if (!auth) {
          this.store.dispatch(signIn({ returnUrl: state.url }));
        }
      }),
      first()
    );
  }
}
