import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css',
})
export class QuienSoyComponent {
  httpService = inject(HttpService);
  nombre = '';
  foto = '';
  user = '';

  ngOnInit() {
    const observable = this.httpService.traerDatosGitHub();

    const subscripcion = observable.subscribe((datos) => {
      this.nombre = datos['name'];
      this.foto = datos['avatar_url'];
      this.user = datos['login'];
      subscripcion.unsubscribe();
    })
  }
}
