import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPipesModule } from 'ngx-pipes';

import { ManageRentalComponent } from './manage-rental/manage-rental.component';
import { ManageBookingComponent } from './manage-booking/manage-booking.component';
import { Routes, RouterModule } from '@angular/router';
import { ManageComponent } from './manage.component';
import { AuthGuard } from '../auth/shared/auth.gaurd';
import { FormatDatePipe } from '../common/pipes/format-date.pipe';
import { ManageRentalBookingComponent } from './manage-rental/manage-rental-booking/manage-rental-booking.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      { path: 'rentals', component: ManageRentalComponent, canActivate: [AuthGuard] },
      { path: 'bookings', component: ManageBookingComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgPipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ManageComponent,
    ManageRentalComponent,
    ManageBookingComponent,
    FormatDatePipe,
    ManageRentalBookingComponent
  ]
})
export class ManageModule { }
