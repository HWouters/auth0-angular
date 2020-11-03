import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { AuthModule } from '@thecla/b2c-angular';
import { AuthModule } from '@thecla/auth0-angular';
import { auth0Config, b2cConfig } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProtectedComponent } from './protected/protected.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, ProtectedComponent],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    // AuthModule.forRoot(b2cConfig),
    AuthModule.forRoot(auth0Config),
    BrowserModule,
    StoreModule.forRoot([]),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
