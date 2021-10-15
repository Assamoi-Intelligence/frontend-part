import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Vehicle } from 'src/app/models/vehicle';
import { urlUploadVehicle } from 'src/app/url';
import { AddEditVehicleComponent } from '../add-edit-vehicle/add-edit-vehicle.component';
import { VehicleService } from '../vehicle.service';

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

  isLoading = true;

  urlUpload = urlUploadVehicle;

  img: string = 'https://firebasestorage.googleapis.com/v0/b/memoire-master-323219.appspot.com/o/toyota.jpg?alt=media&token=c90d4b38-8700-40a7-ba3c-de948a8022f6';

  constructor(
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private vehicleService: VehicleService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.getAllVehicles();
  }

  getAllVehicles() {
    this.vehicleService.getAllVehicles().subscribe((data: Vehicle[]) => {
      this.vehicles = data;
      this.isLoading = false;
    }, (error: any) => {
      console.log(error);
      this.messageService.add({severity:'error', summary: 'Error', detail: `UNABLE TO GET VEHICLES ${error}`, life: 11000});
    });
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
    this.ref.onClose.subscribe((data: string | boolean) => {
      if(typeof data === "boolean" && data === true) {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Vehicle added with success', life: 3000});
        this.getAllVehicles();
      } else if(typeof data === "string") {
        this.messageService.add({severity:'error', summary: 'Error', detail: `Error occured when added ${data}`, life: 7000});
      }
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
    this.ref.onClose.subscribe((data: string | boolean) => {
      if(typeof data === "boolean" && data === true) {
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'Vehicle updated with success', life: 3000});
        this.getAllVehicles();
      } else if(typeof data === "string") {
        this.messageService.add({severity:'error', summary: 'Error', detail: `Error occured when updated ${data}`, life: 7000});
      }
    });
  }

  deleteVehicle(vehicle: Vehicle) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the with id ${vehicle.matriculenumber}`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.vehicleService.deleteVehicleById(vehicle.id).subscribe(response => {
          console.log(response);
          this.messageService.add({severity:'success', summary: 'Successful', detail: 'Vehicle deleted with success', life: 3000});
          this.getAllVehicles();
        },)
      },

    });
  }

  deleteSelectedVehicle() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected vehicles?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          const ids = this.selectedVehicles.map(e => e.id);
          this.vehicleService.deletedVehiculesSelected(ids).subscribe(res => {
            console.log(res);
            this.messageService.add({severity:'success', summary: 'Successful', detail: 'Vehicles selected deleted with success', life: 3000});
            this.getAllVehicles();
            this.selectedVehicles = [];
          }, err => {
            this.messageService.add({severity:'error', summary: 'Error', detail: `Error occured when deleted`, life: 7000});
            this.getAllVehicles();
          })
      }
    });
  }

  uploadFile(event: any) {
    this.getAllVehicles();
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: '', life: 5000});
  }

  uploadFileError(event: any) {
    this.messageService.add({severity:'error', summary: 'Error', detail: `Error file upload`, life: 7000});
  }

  exportDbToExcel() {
    this.vehicleService.exportVehicles().subscribe((data: any) => {
      this.downloadFile(data, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      this.messageService.add({severity:'info', summary: 'Export', detail: 'Exporting...', life: 3000});
    }, (err) => {
      console.log(err);
      this.messageService.add({severity:'error', summary: 'Error', detail: `UNABLE TO EXPORT ${err}`, life: 11000});
    });
  }


  downloadFile(data: Blob, type: any) {
    const file: Blob = new Blob([data], {type: type});
    let url = window.URL.createObjectURL(file);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert( 'Please disable your Pop-up blocker and try again.');
    }
  }

}
