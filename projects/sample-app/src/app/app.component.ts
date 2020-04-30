import { Component } from '@angular/core';
import { getAuthenticated, getUser, signIn, signOut } from '@auth0/angular';
import { select, Store } from '@ngrx/store';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public token = '';

  public authenticated$ = this.store.pipe(select(getAuthenticated));
  public user$ = this.store.pipe(select(getUser));

  constructor(private readonly store: Store<any>, private readonly data: ApiService) {}

  public login() {
    this.store.dispatch(signIn({ returnUrl: '/' }));
  }

  public logout() {
    this.store.dispatch(signOut());
  }

  public get() {
    this.data.get().subscribe(headers => (this.token = headers.authorization));
  }
}
