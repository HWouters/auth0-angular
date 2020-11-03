import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUser, signIn, signOut } from '@thecla/auth0-angular';
// import { getUser, signIn, signOut } from '@thecla/b2c-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent {
  public user$ = this.store.pipe(getUser);

  constructor(private readonly store: Store<any>) {}

  public login() {
    this.store.dispatch(signIn({ returnUrl: '/' }));
  }

  public logout() {
    this.store.dispatch(signOut());
  }
}
