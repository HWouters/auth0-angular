import { inject, Injectable } from '@angular/core';
import { Auth0Client, User } from '@auth0/auth0-spa-js';
import { EMPTY, from, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AuthConfig } from './auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly config = inject(AuthConfig);

  private readonly auth0: Auth0Client;

  public constructor() {
    this.auth0 = new Auth0Client({
      clientId: this.config.clientId,
      authorizationParams: {
        audience: this.config.audience,
        redirect_uri: this.config.redirectUri ?? location.origin,
        scope: this.config.scope,
      },
      domain: this.config.domain,
      useRefreshTokens: this.config.useRefreshTokens,
      sessionCheckExpiryDays: this.config.sessionCheckExpiryDays,
    });
  }

  public isAuthenticated() {
    return from(this.checkSession());
  }

  public loginWithRedirect(appState: { target: string }) {
    return from(this.auth0.loginWithRedirect({ appState })).pipe(switchMap(() => EMPTY));
  }

  public handleRedirectCallback() {
    return from(this.auth0.handleRedirectCallback()).pipe(map(result => result.appState as { target: string }));
  }

  public getUser() {
    return from(this.auth0.getUser()).pipe(filter((u): u is User => u !== undefined));
  }

  public getAccessToken(): Observable<unknown> {
    return from(this.auth0.getTokenSilently());
  }

  public logout() {
    this.auth0.logout({
      logoutParams: { returnTo: this.config.logoutUri ?? location.origin },
    });
  }

  private async checkSession() {
    await this.auth0.checkSession();

    return await this.auth0.isAuthenticated();
  }
}
