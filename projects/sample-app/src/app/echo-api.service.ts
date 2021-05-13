import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EchoApiService {
  public constructor(private readonly http: HttpClient) {}

  public get() {
    return this.http.get<any>('api/headers').pipe(map(x => x.headers));
  }
}
