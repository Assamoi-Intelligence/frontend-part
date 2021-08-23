import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'planificateur',
    pathMatch: 'full'
  },
  {
    path: 'commande',
    loadChildren: () => import('./order/order-routing.module').then(mod => mod.OrderRoutingModule)
  },
  {
    path: 'vehicule',
    loadChildren: () => import('./vehicle/vehicle-routing.module').then(mod => mod.VehicleRoutingModule)
  },
  {
    path: 'planificateur',
    loadChildren: () => import('./planner/planner-routing.module').then(mod => mod.PlannerRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
