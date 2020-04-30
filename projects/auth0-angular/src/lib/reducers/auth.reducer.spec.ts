import { signedIn, signedOut } from '../actions/auth.actions';
import { noAuthentication, reducer } from './auth.reducer';

describe('auth reducer', () => {
  describe('undefined action', () => {
    it('should return not authenticated', () => {
      const action = {};
      const state = reducer(undefined, action as any);

      expect(state).toBe(noAuthentication);
    });
  });

  describe(signedIn.type, () => {
    const sub = 'id';
    const name = 'name';
    const email = 'a.b@mail.com';

    it('should add authenticated user to store', () => {
      const state = reducer(noAuthentication, signedIn({ sub, name, email }));

      expect(state.authenticated).toBe(true);
      expect(state.user).toEqual({ sub, name, email });
    });
  });

  describe(signedOut.type, () => {
    const sub = 'id';
    const name = 'name';
    const email = 'a.b@mail.com';

    it('should add authenticated user to store', () => {
      let state = reducer(noAuthentication, signedIn({ sub, name, email }));

      expect(state.authenticated).toBe(true);

      state = reducer(state, signedOut());

      expect(state).toBe(noAuthentication);
    });
  });
});
