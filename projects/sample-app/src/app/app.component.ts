import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1>Auth0 authentication sample app</h1>
    <nav>
      <ul>
        <li><a routerLink="/">Home</a></li>
        <li><a routerLink="/protected">Protected</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
