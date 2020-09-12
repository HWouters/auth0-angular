import { Injectable } from '@angular/core';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { EMPTY, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthConfig } from './auth-config';

const RECOVERABLE_ERRORS = [
  'login_required',
  'consent_required',
  'interaction_required',
  'account_selection_required',
  'access_denied',
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth0: Auth0Client;

  constructor(private readonly config: AuthConfig) {
    this.auth0 = new Auth0Client({
      audience: config.audience,
      client_id: config.clientId,
      domain: config.authority,
      redirect_uri: config.redirectUri ?? location.origin,
      scope: config.scope,
      useRefreshTokens: config.useRefreshTokens ?? false,
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
    return from(this.auth0.getUser());
  }

  public getAccessToken(): Observable<unknown> {
    return from(this.auth0.getTokenSilently());
  }

  public logout() {
    this.auth0.logout({ returnTo: this.config.logoutUri ?? location.origin });
  }

  private async checkSession() {
    try {
      await this.auth0.getTokenSilently();

      return true;
    } catch (error) {
      if (!RECOVERABLE_ERRORS.includes(error.error)) {
        throw error;
      }
    }

    return false;
  }
}
