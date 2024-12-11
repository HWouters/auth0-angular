import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { EchoApiService } from '../echo-api.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-protected',
  imports: [AsyncPipe],
  template: `
    <h3>Authorization header echo from <a href="http://postman-echo.com">postman-echo</a></h3>
    <div>
      <pre>{{ token$ | async }}</pre>
    </div>
  `,
})
export class ProtectedComponent {
  public readonly token$ = this.data.get().pipe(
    map(headers => headers.authorization),
    map(token => token.split('.')[1]),
    map(payload => JSON.stringify(JSON.parse(atob(payload)), undefined, 2)),
  );

  public constructor(private readonly data: EchoApiService) {}
}
