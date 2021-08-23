import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {PanelModule} from 'primeng/panel';
import {CheckboxModule} from 'primeng/checkbox';
import {BadgeModule} from 'primeng/badge';
import {GMapModule} from 'primeng/gmap';
import {CalendarModule} from 'primeng/calendar';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {FileUploadModule} from 'primeng/fileupload';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ToolbarModule,
    ButtonModule,
    ToastModule,
    TableModule,
    InputTextModule,
    DialogModule,
    DynamicDialogModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    PanelModule,
    CheckboxModule,
    BadgeModule,
    GMapModule,
    CalendarModule,
    ConfirmDialogModule,
    FileUploadModule
  ]
})
export class AngularprimeModule { }
