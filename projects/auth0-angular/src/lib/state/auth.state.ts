export interface Profile {
  sub: string;
  name?: string;
  nickname?: string;
  picture?: string;
  email?: string;
  [key: string]: any;
}

export interface State {
  authenticated: boolean;
  user?: Profile;
}
