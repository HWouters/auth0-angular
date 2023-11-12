import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUser, signIn, signOut } from '@thecla/auth-angular';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <div>
        <p>Welcome {{ user?.name }}</p>
        <button (click)="logout()">Logout</button>
      </div>
    } @else {
      <button (click)="login()">Login</button>
    }
  `,
})
export class HomeComponent {
  public user$ = this.store.pipe(getUser);

  public constructor(private readonly store: Store) {}

  public login() {
    this.store.dispatch(signIn({ returnUrl: '/' }));
  }

  public logout() {
    this.store.dispatch(signOut());
  }
}
