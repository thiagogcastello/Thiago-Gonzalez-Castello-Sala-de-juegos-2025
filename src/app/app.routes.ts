import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy.component';
import { ChatComponent } from './pages/chat/chat.component';
import { JuegosComponent } from './pages/juegos/juegos.component';
import { MayorMenorComponent } from './pages/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './pages/preguntados/preguntados.component';
import { AhorcadoComponent } from './pages/ahorcado/ahorcado.component';
import { ReaccionComponent } from './pages/reaccion/reaccion.component';
import { PuntajesComponent } from './pages/puntajes/puntajes.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: "full"
  },
  {
    path: 'quiensoy',
    component: QuienSoyComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'juegos',
    component: JuegosComponent,
    children: [
        {path: 'ahorcado', component: AhorcadoComponent},
        {path: 'mayor-menor', component: MayorMenorComponent},
        {path: 'preguntados', component: PreguntadosComponent},
        {path: 'reaccion', component: ReaccionComponent},
    ],
  },
  {
    path: 'puntajes',
    component: PuntajesComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: HomeComponent,
  },
];
