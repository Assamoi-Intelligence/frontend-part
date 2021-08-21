import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehicleRoutingModule } from './vehicle-routing.module';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { AngularprimeModule } from '../angularprime/angularprime.module';
import { AddEditVehicleComponent } from './add-edit-vehicle/add-edit-vehicle.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    VehicleListComponent,
    AddEditVehicleComponent
  ],
  imports: [
    CommonModule,
    VehicleRoutingModule,
    BrowserAnimationsModule,
    AngularprimeModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    AddEditVehicleComponent
  ]
})
export class VehicleModule { }
