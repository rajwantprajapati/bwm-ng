import { Component, OnInit, Input } from '@angular/core';
import { Rental } from '../../shared/rental.model';

@Component({
  selector: 'bwm-rental-detail-booking',
  templateUrl: './rental-detail-booking.component.html',
  styleUrls: ['./rental-detail-booking.component.scss']
})
export class RentalDetailBookingComponent implements OnInit {
  @Input() price: number;
  dateRange: any = {};
  options: any = {
    locale: { format: 'YYYY/MM/DD'},
    alwaysShowCalendars: false,
    opens: 'left'
  };

  constructor() { }

  ngOnInit() {
  }

  public selectedDate(value: any, datePicker?:any) {
    
    /* datePicker.start = value.start;
    datePicker.end = value.end; */

    this.dateRange.start = value.start;
    this.dateRange.end = value.end;
    this.dateRange.label = value.label;
  }

}
