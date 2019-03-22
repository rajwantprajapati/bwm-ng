import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/booking/shared/booking.service';
import { Booking } from 'src/app/booking/shared/booking.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss']
})
export class ManageBookingComponent implements OnInit {

  bookings: Booking[];
  erros: any[] = [];

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.bookingService.getUserBookings().subscribe(
      (bookings: Booking[]) => {
        this.bookings = bookings;
      },
      (errorResponse: HttpErrorResponse) => {
        this.erros = errorResponse.error.errors;
      }
    );
  }

}
