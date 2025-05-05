import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  supabaseService = inject(SupabaseService);
  mensajes = signal<any>([]);
  authService = inject(AuthService);
  miUsuario: User | null = null;
  mensaje = '';

  constructor() {
    this.supabaseService.traerTodos().then((data) => {
      this.mensajes.set([...data]);
    });
  }

  async ngOnInit() {
    const canal = this.supabaseService.supabase.channel('table-db-changes');
    canal.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'mensajes',
      },
      async (cambios) => {
        const data = await this.supabaseService.traerTodos();
        this.mensajes.set([...data]);
      }
    );
    canal.subscribe();

    const email = await this.authService.obtenerUsuarioActual();
    if (email) {
      const usuario = await this.supabaseService.traerUsuarioPorEmail(email);
      this.miUsuario = usuario;
      console.log(this.miUsuario);
    }
  }

  enviar() {
    if (this.miUsuario) {
      this.supabaseService.guardarMensaje(
        this.mensaje,
        Number(this.miUsuario.id)
      );
      this.mensaje = '';
    } else {
      console.error('Usuario no autenticado');
    }
  }
}
