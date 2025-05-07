import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PALABRAS } from './palabras';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css'],
})
export class AhorcadoComponent {
  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  palabra: string = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
  palabraDisplay: string[] = [];
  letrasUsadas: string[] = [];
  errores = 0;
  juegoTerminado: boolean = false;
  juegoGanado: boolean = false;


  constructor() {
    this.palabraDisplay = this.palabra.split('').map(() => '_');
  }

  ingresarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasUsadas.includes(letra)) {
      return;
    }
  
    this.letrasUsadas.push(letra);
  
    let isCorrect = false;
    for (let i = 0; i < this.palabra.length; i++) {
      if (this.palabra[i] === letra) {
        this.palabraDisplay[i] = letra;
        isCorrect = true;
      }
    }
  
    if (!isCorrect) {
      this.errores++;
    }
  
    if (this.errores >= 6) {
      this.juegoTerminado = true;
      Swal.fire({
        title: "NOO!",
        text: "No lo pudiste salvar!",
        icon: "error",
        confirmButtonText: "Ok"
      });
    } else if (this.palabraDisplay.join('') === this.palabra) {
      this.juegoTerminado = true;
      this.juegoGanado = true;
      Swal.fire({
        title: "BIEN!",
        text: "Lo salvaste!",
        icon: "success",
        confirmButtonText: "Ok"
      });
    }
  }

  resetGame(): void {
    this.letrasUsadas = [];
    this.errores = 0;
    this.juegoTerminado = false;
    this.juegoGanado = false;
    this.palabra = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
    this.palabraDisplay = this.palabra.split('').map(() => '_');
  }
}
