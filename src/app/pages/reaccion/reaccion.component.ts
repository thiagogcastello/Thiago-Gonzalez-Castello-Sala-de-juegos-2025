import { CommonModule } from '@angular/common';
import { Component, NgZone, inject } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-reaccion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reaccion.component.html',
  styleUrl: './reaccion.component.css',
})
export class ReaccionComponent {
  estado: number = 0;
  tiempo: number = 0;
  cronometroActivo: boolean = false;
  intervaloTiempo: any;
  intervaloLuces: any;
  esperando: boolean = false;
  mensaje: string = '';
  timeoutInicio: any;
  miUsuario: User | null = null;

  supabaseService = inject(SupabaseService);
  authService = inject(AuthService);

  constructor(private ngZone: NgZone) {}

  async ngOnInit() {
    const email = await this.authService.obtenerUsuarioActual();
    if (email) {
      const usuario = await this.supabaseService.traerUsuarioPorEmail(email);
      this.miUsuario = usuario;
      console.log(this.miUsuario);
    }
  }

  get tiempoFormateado(): string {
    const segundos = Math.floor(this.tiempo / 1000);
    const milisegundos = this.tiempo % 1000;
    return `${segundos}.${milisegundos.toString().padStart(3, '0')}`;
  }

  alternarCronometro(): void {
    if (!this.cronometroActivo && this.estado === 0 && !this.esperando) {
      this.mensaje = '';
      this.iniciarSecuenciaLuces();
    } else if (this.cronometroActivo) {
      this.detenerCronometroYLuces();
      this.supabaseService.guardarPuntuacion(
        Number(this.miUsuario?.id),
        this.tiempo,
        'Reaccion'
      );
    } else if (this.estado > 0 && this.estado <= 5 && !this.cronometroActivo) {
      this.mensaje = 'SALIDA EN FALSO!';
      this.detenerCronometroYLuces();
      this.estado = 0;
    }
  }

  iniciarSecuenciaLuces(): void {
    this.tiempo = 0;
    this.estado = 1;
    let luces = 1;

    this.ngZone.runOutsideAngular(() => {
      this.intervaloLuces = setInterval(() => {
        luces++;
        this.ngZone.run(() => {
          this.estado = luces;
          if (luces === 5) {
            clearInterval(this.intervaloLuces);
            this.esperarYArrancarCronometro();
          }
        });
      }, 1000);
    });
  }

  esperarYArrancarCronometro(): void {
    this.esperando = true;
    const delay = Math.random() * 3000 + 500;

    this.timeoutInicio = setTimeout(() => {
      this.ngZone.run(() => {
        this.estado = 0;
        this.esperando = false;
        this.iniciarCronometro();
      });
    }, delay);
  }

  iniciarCronometro(): void {
    this.cronometroActivo = true;
    const inicio = Date.now();

    this.ngZone.runOutsideAngular(() => {
      this.intervaloTiempo = setInterval(() => {
        const nuevoTiempo = Date.now() - inicio;
        this.ngZone.run(() => {
          this.tiempo = nuevoTiempo;
        });
      }, 10);
    });
  }

  detenerCronometroYLuces(): void {
    this.cronometroActivo = false;
    clearInterval(this.intervaloTiempo);
    clearInterval(this.intervaloLuces);
    clearTimeout(this.timeoutInicio);
    if (!this.esperando && this.estado === 0 && this.tiempo > 0) {
      this.mensaje = `¡Tu reacción fue de ${this.tiempoFormateado} segundos!`;
    }
  }

  reiniciar(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    this.detenerCronometroYLuces();
    this.estado = 0;
    this.mensaje = '';
    this.tiempo = 0;
    this.cronometroActivo = false;
    this.esperando = false;
  }
}
