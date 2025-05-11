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

  traerPreguntas() {
    const observable = this.httpClient.get<any>(
      'https://opentdb.com/api.php?amount=50&type=multiple'
    );
    return observable;
  }
}
