export abstract class AuthConfig {
  public abstract audience: string;
  public abstract clientId: string;
  public abstract authority: string;
  public abstract redirectUri: string;
  public abstract scope: string;
  public abstract logoutUri: string;
}
