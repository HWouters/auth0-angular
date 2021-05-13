export interface Profile {
  [key: string]: any;
  sub: string;
  name?: string;
  nickname?: string;
  picture?: string;
  email?: string;
}

export interface State {
  authenticating: boolean;
  authenticated: boolean;
  user?: Profile;
}
