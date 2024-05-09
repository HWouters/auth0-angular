# @thecla/auth0-angular

Auth0 provides a high quality [Javscript SDK](https://auth0.com/docs/libraries/auth0-spa-js) for authentication in single page applications. However, it's still not a trival task to integrate authentication properly in your own application. This library helps with integrating Auth0 into an Angular application, it:

- Signs the user in on application startup;
- Uses the Angular router to return to the original page after authentication, preventing unnecessary page reloads;
- Attaches access tokens to api requests;
- Provides a guard to protect routes.

This library is inspired by the NG-Conf 2020 talk from Sam Julien: [The Role of Effects in NgRx Authentication](https://www.ng-conf.org/2020/sessions/rxwut/). It uses [Ngrx Store](https://ngrx.io/guide/store) for managing authentication state and [Ngrx Effects](https://ngrx.io/guide/effects) for authentication orchestration.

This repo now contains also a library that helps integrating Azure AD B2C authentication in your Angular/Ngrx application.

## Getting Started

Start with an Angular application and the necessary imports for Ngrx:

```js
// app.module.ts
StoreModule.forRoot([]),
EffectsModule.forRoot([]),
```

### Installation

Install `@thecla/auth0-angular` and its peer dependency `@auth0/auth0-spa-js`

```sh
npm install @auth0/auth0-spa-js
npm install @thecla/auth0-angular
```

For B2C install install `@thecla/b2c-angular` and its peer dependency `@azure/msal-browser`

```sh
npm install @azure/msal-browser
npm install @thecla/b2c-angular
```

### Import and configure module

Import `AuthModule` from `@thecla/auth0-angular` in the app module:

```js
const config = {
  audience: '',
  domain: '',
  clientId: '',
  scope: 'openid profile',
};

AuthModule.forRoot(config);
```

or 

```js
const config = {
  clientId: '',
  authority: 'https://{name}.b2clogin.com/{tenantid}',
  signInPolicy: 'B2C_1A_XXXXXXX',
  resetPasswordPolicy: 'B2C_1A_XXXXXXX',
  knownAuthorities: ['{name}.b2clogin.com'],
  scopes: [],
};

AuthModule.forRoot(config);
```

### Sign in

One way to sign the user in, is to dispatch an `signIn` action:

```js
public login() {
  this.store.dispatch(signIn({ returnUrl: '/' }));
}
```

The return url, is the url where the application will return after authentication.

### Protect route

Another way is to protect a route with the `AuthGuard`.

```js
const routes: Routes = [{ path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] }];
```

### Display user info

To display user information, use `getUser`.

```js
public user$ = this.store.pipe(getUser);
```

The user object contains the claims from the IdToken.

### Api access

You don't need to do anything for api access. The library adds automatically a bearer token to each same domain (relative url) requests.

### Sign out

Force a user sign out by dispatching `signOut`:

```js
public logout() {
  this.store.dispatch(signOut());
}
```

## Sample application

This repository contains an example application. After configuring your own Auth0 tenant, it should be ready to go.
