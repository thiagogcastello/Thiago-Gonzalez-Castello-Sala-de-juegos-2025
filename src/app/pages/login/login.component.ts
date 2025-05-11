import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth = inject(AuthService);
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
  }

  async logIn() {
    this.errorMessage = '';
    try {
      const { data, error } = await this.auth.iniciarSesion(
        this.email,
        this.password
      );
      if (error) {
        this.errorMessage =
          'Error al iniciar sesión. Por favor, revisa tus credenciales.';
        console.log('Login error:', error.message);
        return;
      }
    } catch (error: any) {
      console.log('Error capturado:', error);
      this.errorMessage =
        'Error al iniciar sesión. Por favor, revisa tus credenciales.';
    }
  }

  irAlRegistro() {
    this.router.navigate(['/registro']);
  }

  completarUsuario(email: string, password: string) {
    this.errorMessage = '';
    this.email = email;
    this.password = password;
    this.cdr.detectChanges();
  }
}
