import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login/login.component'; 
import { HomeComponent } from './pages/home/home/home.component';
import { ServerHomeListComponent } from './pages/home/server-home-list/server-home-list.component';
import { PlayerHomeListComponent } from './pages/home/player-home-list/player-home-list.component';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home/:serverId/:homeId', component: HomeComponent },
  { path: 'homes/:serverId', component: ServerHomeListComponent },
  { path: 'homes/:serverId/:userId', component: PlayerHomeListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
