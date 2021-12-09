import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUser, signIn, signOut } from '@thecla/auth-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
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
