import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'vehicule',
    pathMatch: 'full'
  },
  {
    path: 'commande',
    loadChildren: () => import('./order/order-routing.module').then(mod => mod.OrderRoutingModule)
  },
  {
    path: 'vehicule',
    loadChildren: () => import('./vehicle/vehicle-routing.module').then(mod => mod.VehicleRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
