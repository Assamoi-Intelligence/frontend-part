import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlannerRoutingModule } from './planner-routing.module';
import { PlannerComponent } from './planner/planner.component';
import { AngularprimeModule } from '../angularprime/angularprime.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlannerDetailComponent } from './planner-detail/planner-detail.component';


@NgModule({
  declarations: [
    PlannerComponent,
    PlannerDetailComponent
  ],
  imports: [
    CommonModule,
    PlannerRoutingModule,
    AngularprimeModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  entryComponents: [
    PlannerDetailComponent
  ]
})
export class PlannerModule { }
