/*
 * Public API Surface of auth0-angular
 */

export * from './lib/auth0-angular.module';
export { signIn, signOut } from './lib/actions/auth.actions';
export { getAuthenticated, getUser } from './lib/store';
