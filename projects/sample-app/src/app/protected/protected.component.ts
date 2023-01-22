import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { EchoApiService } from '../echo-api.service';

@Component({
  standalone: true,
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styles: [],
})
export class ProtectedComponent implements OnInit {
  public token = '';

  public constructor(private readonly data: EchoApiService) {}

  public ngOnInit() {
    this.data
      .get()
      .pipe(
        map(headers => headers.authorization),
        map(token => token.split('.')[1])
      )
      .subscribe(payload => (this.token = JSON.stringify(JSON.parse(atob(payload)), undefined, 2)));
  }
}
