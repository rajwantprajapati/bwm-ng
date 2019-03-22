import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private http: HttpClient) { }

  public createBooking(booking: Booking): Observable<any> {
    return this.http.post('/api/v1/bookings', booking);
  }

  public getUserBookings(): Observable<any> {
    return this.http.get('/api/v1/bookings/manage');
  }
}
