import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Vehicle } from 'src/app/models/vehicle';
import { AddEditVehicleComponent } from '../add-edit-vehicle/add-edit-vehicle.component';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  providers: [
    DialogService,
    ConfirmationService,
    MessageService
  ]
})
export class VehicleListComponent implements OnInit {

  ref: DynamicDialogRef | undefined;

  vehicles: Vehicle[] = [];
  selectedVehicles: Vehicle[] = [];

  img: string = 'https://firebasestorage.googleapis.com/v0/b/memoire-master-323219.appspot.com/o/toyota.jpg?alt=media&token=c90d4b38-8700-40a7-ba3c-de948a8022f6';

  constructor(public dialogService: DialogService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.vehicles = [
      {id: '1', matriculenumber: 'AZEézeoiçà', brand: 'TOYOTA', imageurl: this.img, capacity: 234, status: 'instock'},
      {id: '2', matriculenumber: 'AZEézeoiçà', brand: 'TOYOTA', imageurl: this.img, capacity: 234, status: 'instock'},
      {id: '3', matriculenumber: 'AZEézeoiçà', brand: 'TOYOTA', imageurl: this.img, capacity: 234, status: 'instock'},
      {id: '4', matriculenumber: 'AZEézeoiçà', brand: 'TOYOTA', imageurl: this.img, capacity: 234, status: 'instock'},
      {id: '5', matriculenumber: 'AZEézeoiçà', brand: 'TOYOTA', imageurl: this.img, capacity: 234, status: 'instock'},
      {id: '6', matriculenumber: 'AZEézeoiçà', brand: 'SUZUKI', imageurl: this.img, capacity: 234, status: 'instock'}
    ]
  }

  addVehicle() {
    this.ref = this.dialogService.open(AddEditVehicleComponent, {
      header: 'Ajouter véhicule',
      modal: true,
      width: '40%',
      data: {
        isAdd: true
      },
      contentStyle: {"padding-top": "2rem", "overflow": "auto"},
    });
    this.ref.onClose.subscribe(data => {
      console.log('Close');
    });
  }

  editVehicle(vehicle: Vehicle) {
    this.ref = this.dialogService.open(AddEditVehicleComponent, {
      header: 'Editer véhicule',
      modal: true,
      width: '40%',
      data: {
        isAdd: false,
        vehicle: vehicle
      },
      contentStyle: {"padding-top": "2rem", "overflow": "auto"},
    });
    this.ref.onClose.subscribe(data => {
      console.log('Close');
    });
  }

  deleteVehicle(vehicle: Vehicle) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the with id ${vehicle.matriculenumber}`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log('Delete successfull')
      },
    });
  }

  deleteSelectedVehicle() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected vehicles?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          console.log('Vehicles selected deleted')
      }
    });
  }

}
