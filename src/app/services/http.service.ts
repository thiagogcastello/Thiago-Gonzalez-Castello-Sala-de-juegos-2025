import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  httpClient = inject(HttpClient);

  constructor() {}

  traerDatosGitHub() {
    const observable = this.httpClient.get<any>(
      'https://api.github.com/users/thiagogcastello'
    );
    return observable;
  }
}
