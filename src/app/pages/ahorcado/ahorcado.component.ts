import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PALABRAS } from './palabras';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { User } from '@supabase/supabase-js';

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
  puntuacion: number = 0;
  supabaseService = inject(SupabaseService);
  authService = inject(AuthService);
  miUsuario: User | null = null;

  async ngOnInit() {
    this.palabraDisplay = this.palabra.split('').map(() => '_');
    const email = await this.authService.obtenerUsuarioActual();
    if (email) {
      const usuario = await this.supabaseService.traerUsuarioPorEmail(email);
      this.miUsuario = usuario;
      console.log(this.miUsuario);
    }
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
        this.puntuacion += 5;
      }
    }

    if (!isCorrect) {
      this.errores++;
      this.puntuacion -= 3;
    }

    if (this.errores >= 6) {
      this.juegoTerminado = true;
      Swal.fire({
        title: 'NOO!',
        text: 'No lo pudiste salvar!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } else if (this.palabraDisplay.join('') == this.palabra) {
      this.juegoTerminado = true;
      this.juegoGanado = true;
      const aciertos = this.palabra.length;
      const puntuacionBase = this.palabra.length * 10;
      const puntuacionPorAciertos = aciertos * 5;
      const penalizacionErrores = this.errores * 3;
      this.puntuacion = puntuacionBase + puntuacionPorAciertos - penalizacionErrores;

      this.supabaseService.guardarPuntuacion(Number(this.miUsuario?.id), this.puntuacion, 'Ahorcado');

      Swal.fire({
        title: 'BIEN!',
        text: 'Lo salvaste!',
        icon: 'success',
        confirmButtonText: 'Ok',
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
