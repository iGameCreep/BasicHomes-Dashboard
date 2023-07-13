import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component'; 
import { HomeComponent } from './pages/home/home/home.component';
import { ServerHomeListComponent } from './pages/home/server-home-list/server-home-list.component';
import { PlayerHomeListComponent } from './pages/home/player-home-list/player-home-list.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserHomeGuard } from './guards/userhome.guard';
import { ServersComponent } from './pages/servers/servers.component';
import { AccountComponent } from './pages/account/account.component';
import { DatabaseComponent } from './pages/database/database.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'servers', component: ServersComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'homes/:serverId', component: ServerHomeListComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'homes/:serverId/:userId', component: PlayerHomeListComponent, canActivate: [AuthGuard, UserGuard] },
  { path: 'home/:serverId/:homeId', component: HomeComponent, canActivate: [AuthGuard, UserHomeGuard] },
  { path: 'db', component: DatabaseComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
