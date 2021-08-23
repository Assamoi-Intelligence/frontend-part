import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlannerRoutingModule } from './planner-routing.module';
import { PlannerComponent } from './planner/planner.component';
import { AngularprimeModule } from '../angularprime/angularprime.module';


@NgModule({
  declarations: [
    PlannerComponent
  ],
  imports: [
    CommonModule,
    PlannerRoutingModule,
    AngularprimeModule,

  ]
})
export class PlannerModule { }
