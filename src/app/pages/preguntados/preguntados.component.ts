import { Component, inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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
  preguntas: any[] = [];
  indicePreguntaActual: number = 0;
  respuestaElegida = '';
  vidasRestantes: number = 3;
  puntuacion: number = 0;

  ngOnInit() {
    this.httpService.traerPreguntas().subscribe((datos) => {
      this.preguntas = datos['results'];
      this.mostrarPreguntaActual();
    });
  }

  mostrarPreguntaActual() {
    const pregunta = this.preguntas[this.indicePreguntaActual];
    this.preguntaActual = this.decodeHtml(pregunta['question']);
    this.respuestaCorrecta = this.decodeHtml(pregunta['correct_answer']);
    this.respuestasIncorrectas = pregunta['incorrect_answers'].map(
      (r: string) => this.decodeHtml(r)
    );
    this.respuestasMezcladas = this.mezclarPreguntas([
      ...this.respuestasIncorrectas,
      this.respuestaCorrecta,
    ]);
  }
  siguientePregunta() {
    this.respuestaElegida = '';
    this.indicePreguntaActual++;

    if (this.indicePreguntaActual < this.preguntas.length) {
      this.mostrarPreguntaActual();
    } else {
      Swal.fire({
        title: '¡Fin del juego!',
        text: 'No hay más preguntas.',
        icon: 'info',
        confirmButtonText: 'Reiniciar',
      });
      this.reiniciarJuego();
    }
  }

  mezclarPreguntas(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  seleccionarRespuesta(opcion: string) {
    this.respuestaElegida = opcion;
    if (this.respuestaElegida == this.respuestaCorrecta) {
      this.puntuacion += 1;
    } else {
      this.vidasRestantes -= 1;
    }
    if (this.vidasRestantes == 0) {
      Swal.fire({
        title: 'Perdiste!',
        text: 'Volve a jugar!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }

  reiniciarJuego() {
    this.vidasRestantes = 3;
    this.puntuacion = 0;
    this.respuestaElegida = '';
    this.indicePreguntaActual = 0;
    this.httpService.traerPreguntas().subscribe((datos) => {
      this.preguntas = datos['results'];
      this.mostrarPreguntaActual();
    });
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
