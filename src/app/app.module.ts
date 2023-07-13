import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeCardComponent } from './pages/home/home-card/home-card.component';
import { ServerHomeListComponent } from './pages/home/server-home-list/server-home-list.component';
import { PlayerHomeListComponent } from './pages/home/player-home-list/player-home-list.component';
import { LandingComponent } from './pages/landing/landing.component';
import { MessageBarComponent } from './components/message-bar/message-bar.component';
import { AccountComponent } from './pages/account/account.component';
import { DatabaseComponent } from './pages/database/database.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    HomeCardComponent,
    ServerHomeListComponent,
    PlayerHomeListComponent,
    LandingComponent,
    MessageBarComponent,
    AccountComponent,
    DatabaseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
