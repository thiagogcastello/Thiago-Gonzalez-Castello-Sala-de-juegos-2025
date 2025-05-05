import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase;
  constructor() {
    this.supabase = createClient(
      'https://jrqifwzqkubhfxsmacxi.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpycWlmd3pxa3ViaGZ4c21hY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDM1MTYsImV4cCI6MjA2MDM3OTUxNn0.rg-Ytq8Z_wLHaLQ-b4XFeJIMZ5QuXn-j0Qq93-6eOIY'
    );
  }
  async traerUsuarioPorEmail(email: string) {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('correo', email)
      .single();
  
    if (error) {
      console.error('Error al traer el usuario por email:', error.message);
      return null;
    }
  
    return data;
  }

  async traerTodos() {
    const { data } = await this.supabase
      .from('mensajes')
      .select('id, mensaje, created_at,id_usuario,usuarios (nombre, apellido, correo)');
    console.log(data);
    return data as any[];
  }
  async guardarMensaje(mensaje: string, id_usuario: number) {
    const { data } = await this.supabase.from('mensajes').insert({
      mensaje: mensaje,
      id_usuario: id_usuario,
    });
  }
}
