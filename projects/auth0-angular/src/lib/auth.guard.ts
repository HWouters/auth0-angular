import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, tap } from 'rxjs/operators';
import { signIn } from './auth.actions';
import { isAuthenticated } from './auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly store = inject(Store);

  private readonly authenticated$ = this.store.pipe(isAuthenticated);

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticated$.pipe(
      tap(auth => {
        if (!auth) {
          this.store.dispatch(signIn({ returnUrl: state.url }));
        }
      }),
      first(),
    );
  }
}
