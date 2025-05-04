import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  email: string = '';
  nombre: string = '';
  apellido: string = '';
  edad: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(private router: Router) {}
  auth = inject(AuthService);

  registrarse() {
    this.auth.crearCuenta(this.email, this.password);
  }
  irAlInicioSesion() {
    this.router.navigate(['/login']);
  }
}
