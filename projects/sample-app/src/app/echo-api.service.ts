import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EchoApiService {
  private readonly http = inject(HttpClient);

  public get() {
    return this.http.get<any>('api/headers').pipe(map(x => x.headers));
  }
}
