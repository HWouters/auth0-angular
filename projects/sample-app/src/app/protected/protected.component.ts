import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { EchoApiService } from '../echo-api.service';

@Component({
  standalone: true,
  selector: 'app-protected',
  template: `
    <h3>Authorization header echo from <a href="http://postman-echo.com">postman-echo</a></h3>
    <div>
      <pre>{{ token }}</pre>
    </div>
  `,
})
export class ProtectedComponent {
  public token = '';

  public constructor(data: EchoApiService) {
    data
      .get()
      .pipe(
        map(headers => headers.authorization),
        map(token => token.split('.')[1]),
      )
      .subscribe(payload => (this.token = JSON.stringify(JSON.parse(atob(payload)), undefined, 2)));
  }
}
