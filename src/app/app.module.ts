import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularprimeModule } from './angularprime/angularprime.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderModule } from './order/order.module';
import { PlannerModule } from './planner/planner.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { NotfoundComponent } from './notfound/notfound.component';


import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import { environment } from 'src/environments/environment.prod';

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OrderModule,
    VehicleModule,
    PlannerModule,
    AngularprimeModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig))
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
