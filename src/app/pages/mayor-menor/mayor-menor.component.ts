import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';

interface Carta {
  nombre: string;
  palo: string;
  ranking: number;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css',
})
export class MayorMenorComponent {
  baraja: Carta[] = [
    { nombre: '4', palo: 'copa', ranking: 0 },
    { nombre: '4', palo: 'oro', ranking: 1 },
    { nombre: '4', palo: 'basto', ranking: 2 },
    { nombre: '4', palo: 'espada', ranking: 3 },
    { nombre: '5', palo: 'copa', ranking: 4 },
    { nombre: '5', palo: 'oro', ranking: 5 },
    { nombre: '5', palo: 'basto', ranking: 6 },
    { nombre: '5', palo: 'espada', ranking: 7 },
    { nombre: '6', palo: 'copa', ranking: 8 },
    { nombre: '6', palo: 'oro', ranking: 9 },
    { nombre: '6', palo: 'basto', ranking: 10 },
    { nombre: '6', palo: 'espada', ranking: 11 },
    { nombre: '7', palo: 'copa', ranking: 12 },
    { nombre: '7', palo: 'basto', ranking: 13 },
    { nombre: '10', palo: 'copa', ranking: 14 },
    { nombre: '10', palo: 'oro', ranking: 15 },
    { nombre: '10', palo: 'basto', ranking: 16 },
    { nombre: '10', palo: 'espada', ranking: 17 },
    { nombre: '11', palo: 'copa', ranking: 18 },
    { nombre: '11', palo: 'oro', ranking: 19 },
    { nombre: '11', palo: 'basto', ranking: 20 },
    { nombre: '11', palo: 'espada', ranking: 21 },
    { nombre: '12', palo: 'copa', ranking: 22 },
    { nombre: '12', palo: 'oro', ranking: 23 },
    { nombre: '12', palo: 'basto', ranking: 24 },
    { nombre: '12', palo: 'espada', ranking: 25 },
    { nombre: '1', palo: 'copa', ranking: 26 },
    { nombre: '1', palo: 'oro', ranking: 27 },
    { nombre: '2', palo: 'copa', ranking: 28 },
    { nombre: '2', palo: 'oro', ranking: 29 },
    { nombre: '2', palo: 'basto', ranking: 30 },
    { nombre: '2', palo: 'espada', ranking: 31 },
    { nombre: '3', palo: 'copa', ranking: 32 },
    { nombre: '3', palo: 'oro', ranking: 33 },
    { nombre: '3', palo: 'basto', ranking: 34 },
    { nombre: '3', palo: 'espada', ranking: 35 },
    { nombre: '7', palo: 'oro', ranking: 36 },
    { nombre: '7', palo: 'espada', ranking: 37 },
    { nombre: '1', palo: 'basto', ranking: 38 },
    { nombre: '1', palo: 'espada', ranking: 39 },
  ];

  cartaActual: Carta | null = null;
  proximaCarta: Carta | null = null;
  resultado: boolean | null = null;
  opcionElegida: 'mayor' | 'menor' | null = null;
  puntuacion: number = 0;
  vidasRestantes: number = 3;
  juegoTerminado: boolean = false;
  miUsuario: User | null = null;
  supabaseService = inject(SupabaseService);
  authService = inject(AuthService);

  async ngOnInit() {
    this.seleccionarCartaInicial();
    const email = await this.authService.obtenerUsuarioActual();
    if (email) {
      const usuario = await this.supabaseService.traerUsuarioPorEmail(email);
      this.miUsuario = usuario;
      console.log(this.miUsuario);
    }
  }

  seleccionarCartaInicial() {
    const indice = Math.floor(Math.random() * this.baraja.length);
    this.cartaActual = this.baraja.splice(indice, 1)[0];
  }

  adivinar(opcion: 'mayor' | 'menor') {
    if (this.baraja.length === 0 || !this.cartaActual || this.juegoTerminado)
      return;

    const indice = Math.floor(Math.random() * this.baraja.length);
    this.proximaCarta = this.baraja.splice(indice, 1)[0];

    this.opcionElegida = opcion;

    if (opcion === 'mayor') {
      this.resultado = this.proximaCarta.ranking > this.cartaActual.ranking;
    } else {
      this.resultado = this.proximaCarta.ranking < this.cartaActual.ranking;
    }

    if (!this.resultado) {
      this.vidasRestantes--;
    } else {
      this.puntuacion++;
    }

    if (this.vidasRestantes == 0) {
      this.juegoTerminado = true;
      this.supabaseService.guardarPuntuacion(
        Number(this.miUsuario?.id),
        this.puntuacion,
        'Mayormenor'
      );
    }

    this.cartaActual = this.proximaCarta;
  }

  reiniciarJuego() {
    this.vidasRestantes = 3;
    this.puntuacion = 0;
    this.juegoTerminado = false;
    this.resultado = null;
    this.seleccionarCartaInicial();
  }
}
