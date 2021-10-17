import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultComponent } from './result/result.component';
import { AngularprimeModule } from '../angularprime/angularprime.module';

@NgModule({
  declarations: [
    ResultComponent
  ],
  imports: [
    CommonModule,
    ResultRoutingModule,
    AngularprimeModule
  ]
})
export class ResultModule { }
