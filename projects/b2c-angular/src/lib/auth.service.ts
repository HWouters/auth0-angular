import { Injectable } from '@angular/core';
import {
  AuthenticationResult,
  Configuration,
  InteractionRequiredAuthError,
  PublicClientApplication,
} from '@azure/msal-browser';
import { from, of, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { AuthConfig } from './auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly clientApplication: PublicClientApplication;

  public constructor(private readonly config: AuthConfig) {
    const msalConfig: Configuration = {
      auth: {
        clientId: config.clientId,
        authority: `${config.authority}/${config.signInPolicy}`,
        knownAuthorities: config.knownAuthorities,
        redirectUri: config.redirectUri ?? location.origin,
      },
    };

    this.clientApplication = new PublicClientApplication(msalConfig);
  }

  public loginWithRedirect(state: { target: string }) {
    return from(
      this.clientApplication.loginRedirect({
        scopes: this.config.scopes,
        state: JSON.stringify({ ...state, passwordReset: false }),
      })
    );
  }

  public resetPasswordWithRedirect(state: { target: string }) {
    return from(
      this.clientApplication.loginRedirect({
        authority: `${this.config.authority}/${this.config.resetPasswordPolicy}`,
        scopes: this.config.scopes,
        state: JSON.stringify({ ...state, passwordReset: true }),
        prompt: 'login',
      })
    );
  }

  public handleRedirectCallback() {
    return from(this.clientApplication.handleRedirectPromise()).pipe(
      filter((result): result is AuthenticationResult => result !== null),
      map(result => ({
        state: result.state ? JSON.parse(result.state) : undefined,
        user: { sub: result.uniqueId, ...result.idTokenClaims },
      }))
    );
  }

  public getAccessToken() {
    const account = this.clientApplication.getAllAccounts()[0];
    const scopes = this.config.scopes;

    return from(this.clientApplication.acquireTokenSilent({ account, scopes })).pipe(map(result => result.accessToken));
  }

  public logout() {
    return from(this.clientApplication.logoutRedirect({ postLogoutRedirectUri: location.origin }));
  }

  public checkSession() {
    const accounts = this.clientApplication.getAllAccounts();
    const scopes = this.config.scopes;

    if (accounts.length === 1) {
      return from(this.clientApplication.acquireTokenSilent({ account: accounts[0], scopes })).pipe(
        map(result => ({ sub: result.uniqueId, ...result.idTokenClaims })),
        catchError(error => (error instanceof InteractionRequiredAuthError ? of(undefined) : throwError(error)))
      );
    } else {
      return of(undefined);
    }
  }
}
