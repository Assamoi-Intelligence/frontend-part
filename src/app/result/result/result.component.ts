import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AlgorithmResult } from 'src/app/models/algorithm';
import { ResultService } from '../result.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class ResultComponent implements OnInit {

  results: AlgorithmResult[] = [];

  constructor(private resultService: ResultService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getAlgorithmsResults();
  }

  getAlgorithmsResults() {
    this.resultService.getAlgorithmResults().subscribe((data: AlgorithmResult[]) => {
      this.results = data;
    }, (err) => {
      console.log(err);
      this.messageService.add({severity:'error', summary: 'Error', detail: `UNABLE TO GET ALGORITHMS RESULTS ${err}`, life: 11000});
    })
  }

}
