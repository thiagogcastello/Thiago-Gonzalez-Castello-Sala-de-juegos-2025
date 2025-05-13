import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-puntajes',
  imports: [CommonModule],
  templateUrl: './puntajes.component.html',
  styleUrl: './puntajes.component.css',
})
export class PuntajesComponent {
  supabaseService = inject(SupabaseService);

  ahorcado: any[] = [];
  mayormenor: any[] = [];
  preguntados: any[] = [];
  reaccion: any[] = [];

  async ngOnInit() {
    const resultados = await this.supabaseService.traerTop5PorJuego();

    this.ahorcado = resultados['Ahorcado'];
    this.mayormenor = resultados['Mayormenor'];
    this.preguntados = resultados['Preguntados'];
    this.reaccion = resultados['Reaccion'];
  }
}
