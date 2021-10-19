import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Detail } from 'src/app/models/detail';
import { ResultService } from '../result.service';

@Component({
  selector: 'app-tabu-search',
  templateUrl: './tabu-search.component.html',
  styleUrls: ['./tabu-search.component.scss'],
  providers: [MessageService, DialogService, ConfirmationService]
})
export class TabuSearchComponent implements OnInit {

  labels = Array.from({length: 200}, (_, i) => i + 1);
  data = {} as any;
  details: Detail[] = [];
  routeLength: number = 0;
  dataRoute: any[] = [];

  constructor(
    private resultService: ResultService,
    private messageService: MessageService,
    ) { }

  ngOnInit(): void {
    this.data = {
      labels: this.labels,
      datasets: []
    }
    this.getResult();
  }

  getResult() {
    this.resultService.getDetailTabuSearch().subscribe((data: Detail[]) => {
      this.details = data;
      if(this.details.length !== 0 )this.generateDataLines();
    }, (err) => {
      console.log(err);
      this.messageService.add({severity:'error', summary: 'Error', detail: `UNABLE TO GET ALGORITHMS RESULTS ${err}`, life: 11000});
    })
  }


  generateDataLines() {
    const comp = [1, 2, 3, 4, 5, 6];
    comp.forEach((element) => {
      if(this.details.filter(e => e.route === element).length !== 0) {
        this.dataRoute.push( this.details.filter(e => e.route === element) );
      }
    });
    const best = this.dataRoute[0].map((el:any) => el.bestsolution)
    const current = this.dataRoute[0].map((el:any) => el.currentsolution);
    this.data.datasets = [
      {
        label: 'Current Solution',
        data: current,
        fill: false,
        tension: .4,
        borderColor: '#42A5F5'
      },
      {
          label: 'Best Solution',
          data: best,
          fill: false,
          borderDash: [5, 5],
          tension: .4,
          borderColor: '#66BB6A'
      },
    ]
  }

  change(d: any) {
    const best = d.map((el:any) => el.bestsolution)
    const current = d.map((el:any) => el.currentsolution);
    this.data = {
        labels: this.labels,
        datasets: [
          {
            label: 'Current Solution',
            data: current,
            fill: false,
            tension: .4,
            borderColor: '#42A5F5'
          },
          {
            label: 'Best Solution',
            data: best,
            fill: false,
            borderDash: [5, 5],
            tension: .4,
            borderColor: '#66BB6A'
          }
        ]
    };
  }





}
