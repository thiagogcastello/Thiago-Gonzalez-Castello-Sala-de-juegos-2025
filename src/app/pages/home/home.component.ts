import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  auth = inject(AuthService);
  emailUsuario: string | null | undefined = null;

  ngOnInit(){
    this.getEmailUsuario();
  }

  cerrarSesion(){
    this.auth.cerrarSesion();
  }
  getEmailUsuario(){
    this.emailUsuario = this.auth.usuarioActual?.email;
  }
}
