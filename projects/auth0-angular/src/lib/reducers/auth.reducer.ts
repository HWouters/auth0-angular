import { Action, createReducer, on } from '@ngrx/store';
import { signedIn, signedOut } from '../actions/auth.actions';
import { State } from '../state/auth.state';

export const noAuthentication: State = {
  authenticated: false,
};

const authReducer = createReducer(
  noAuthentication,
  on(signedIn, (state, { type, ...payload }) => {
    return { ...state, authenticated: true, user: payload };
  }),
  on(signedOut, () => noAuthentication)
);

export function reducer(state: State | undefined, action: Action) {
  return authReducer(state, action);
}
