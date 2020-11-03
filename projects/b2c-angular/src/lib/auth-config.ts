export abstract class AuthConfig {
  public abstract clientId: string;
  public abstract authority: string;
  public abstract signInPolicy: string;
  public abstract resetPasswordPolicy: string;
  public abstract knownAuthorities: string[];
  public abstract scopes: string[];
  public abstract redirectUri?: string;
}
