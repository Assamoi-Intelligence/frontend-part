import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Vehicle } from 'src/app/models/vehicle';

@Component({
  selector: 'app-add-edit-vehicle',
  templateUrl: './add-edit-vehicle.component.html',
  styleUrls: ['./add-edit-vehicle.component.scss']
})
export class AddEditVehicleComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  visible = true;
  statuses: any =  [];
  vehicleForm!: FormGroup;

  ngOnInit(): void {
    this.statuses = [
      {label: 'INSTOCK', value: 'instock'},
      {label: 'LOWSTOCK', value: 'lowstock'},
      {label: 'OUTOFSTOCK', value: 'outofstock'}
    ];
    this.initForm();
    if(!this.config.data.isAdd) {
      this.setEditForm(this.config.data.vehicle);
    }
  }

  initForm() {
    this.vehicleForm = this.formBuilder.group({
      matriculenumber: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      capacity: [null, [Validators.required]],
      status: [null, [Validators.required]],
      imageurl: [null, [Validators.required]]
    });
  }

  setEditForm(data: Vehicle) {
    this.vehicleForm.patchValue(data)
  }

  addNewVehicle() {
    console.log(this.vehicleForm.value);
  }

  closeDialog() {
    this.ref.close();
  }



}
