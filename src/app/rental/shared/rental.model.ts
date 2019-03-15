import { Booking } from "src/app/booking/shared/booking.model";

export class Rental {

    static readonly CATEGORIES = ['House', 'Apartment', 'Condo'];

    _id: string;
    title: string;
    city: string;
    street: string;
    category: string;
    image: string;
    bedrooms: number;
    description: string;
    dailyRate: number;
    shared: boolean;
    createdAt: string;
    bookings: Booking[];
}