import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUserSignal, signIn, signOut } from '@thecla/auth-angular';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  template: `
    @if (user(); as user) {
      <div>
        <p>Welcome {{ user.name }}</p>
        <button (click)="logout()">Logout</button>
      </div>
    } @else {
      <button (click)="login()">Login</button>
    }
  `,
})
export class HomeComponent {
  private readonly store = inject(Store);

  public user = getUserSignal();

  public login() {
    this.store.dispatch(signIn({ returnUrl: '/' }));
  }

  public logout() {
    this.store.dispatch(signOut());
  }
}
