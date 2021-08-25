import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Order } from 'src/app/models/order';
import { OrderService } from '../order.service';
declare var google: any;

@Component({
  selector: 'app-add-edit-order',
  templateUrl: './add-edit-order.component.html',
  styleUrls: ['./add-edit-order.component.scss']
})
export class AddEditOrderComponent implements OnInit {

  orderForm!: FormGroup;

  options: any;

  constructor(
    private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private orderService: OrderService
    ) { }

  overlays: any[] = [];

  ngOnInit(): void {
    this.initMap();
    this.initForm();
    if(!this.config.data.isAdd) {
      this.setForm(this.config.data.order);
    }
  }

  initMap() {
    this.options = {
      center: {lat: 5.391369856212231, lng: -4.019645815219227},
      zoom: 15
    };
  }

  initForm() {
    this.orderForm = this.formBuilder.group({
      clientnumber: ['', [Validators.required]],
      locationlatitude: [null, [Validators.required]],
      locationlongitude: [null, [Validators.required]],
      timewindowstart: [null, [Validators.required]],
      timewindowend: [null, [Validators.required]],
      productquantity: [null, [Validators.required]]
    });
  }

  getTimeWindowStart() {
    return this.orderForm.get('timewindowstart')?.value;
  }

  setForm(data: Order) {
    this.overlays.push(new google.maps.Marker({position: {lat: data.locationlatitude, lng: data.locationlongitude }}));
    this.orderForm.patchValue(data);
  }

  addLocation(event: any) {
    this.orderForm.patchValue({
      locationlatitude: event.latLng.lat(),
      locationlongitude: event.latLng.lng()
    });
    if(this.overlays.length > 0) this.overlays.pop();
    this.overlays.push(new google.maps.Marker({position: {lat: event.latLng.lat(), lng: event.latLng.lng()}}));
  }

  addNewOrder() {
    if(this.config.data.isAdd) {
      const data = {...this.orderForm.value};
      this.orderService.addNewOrder(data).subscribe(data => {
        console.log(data);
        this.ref.close(true);
      }, err => {
        this.ref.close(err)
      });
    } else {
      const data = {...this.orderForm.value} as Order;
      const id = this.config.data.id;
      this.orderService.updateOrder(data, id).subscribe(data => {
        console.log(data);
        this.ref.close(true);
      }, err => {
        this.ref.close(err)
      });
    }
  }

  closeDialog() {
    this.ref.close();
  }


}

