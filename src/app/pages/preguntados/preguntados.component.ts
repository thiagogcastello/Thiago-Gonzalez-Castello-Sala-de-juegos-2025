import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css',
})
export class PreguntadosComponent {
  httpService = inject(HttpService);
  preguntaActual = '';
  respuestaCorrecta = '';
  respuestasIncorrectas: string[] = [];
  respuestasMezcladas: string[] = [];
  respuestaElegida = '';
  vidasRestantes: number = 3;
  puntuacion: number = 0;

  ngOnInit() {
    this.obtenerPregunta();
  }

  obtenerPregunta() {
    const observable = this.httpService.traerPreguntas();

    const subscripcion = observable.subscribe((datos) => {
      const pregunta = datos['results'][0];
      this.preguntaActual = this.decodeHtml(pregunta['question']);
      this.respuestaCorrecta = this.decodeHtml(pregunta['correct_answer']);
      this.respuestasIncorrectas = pregunta['incorrect_answers'].map(
        (r: string) => this.decodeHtml(r)
      );

      const opciones = [...this.respuestasIncorrectas, this.respuestaCorrecta];
      this.respuestasMezcladas = this.mezclarPreguntas(opciones);
      subscripcion.unsubscribe();
    });
  }

  mezclarPreguntas(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  seleccionarRespuesta(opcion: string) {
    this.respuestaElegida = opcion;
    if(this.respuestaElegida == this.respuestaCorrecta){
      this.puntuacion += 1;
    }else{
      this.vidasRestantes -=1;
    }
  }

  siguientePregunta() {
    this.respuestaElegida = '';
    this.obtenerPregunta();
  }

  reiniciarJuego(){
    this.vidasRestantes = 3;
    this.puntuacion = 0;
    this.respuestaElegida = '';
    this.siguientePregunta()
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
