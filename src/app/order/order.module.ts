import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { AngularprimeModule } from '../angularprime/angularprime.module';
import { AddEditOrderComponent } from './add-edit-order/add-edit-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    OrderListComponent,
    AddEditOrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    AngularprimeModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [
    AddEditOrderComponent
  ]
})
export class OrderModule { }
