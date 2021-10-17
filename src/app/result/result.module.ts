import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultComponent } from './result/result.component';
import { AngularprimeModule } from '../angularprime/angularprime.module';
import { TabuSearchComponent } from './tabu-search/tabu-search.component';
import { TabuSearchCrossMoveComponent } from './tabu-search-cross-move/tabu-search-cross-move.component';

@NgModule({
  declarations: [
    ResultComponent,
    TabuSearchComponent,
    TabuSearchCrossMoveComponent
  ],
  imports: [
    CommonModule,
    ResultRoutingModule,
    AngularprimeModule
  ]
})
export class ResultModule { }
