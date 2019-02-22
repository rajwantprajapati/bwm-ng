import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private geoCoder;
  private locationCache: any = {};

  constructor() { }

  private camelize(value: string): string {
    return value.toLowerCase()
            .split(/[-_\s]/g)
            .filter((v: string) => !!v)
            .map((word: string, key: any) => {
              return !key ? word : word.slice(0, 1).toUpperCase() + word.slice(1);
            })
            .join("");
  }

  private cacheLocation(location: string, coordinates: any) {
    this.locationCache[this.camelize(location)] = coordinates;
  }

  private isLocationCached(location: string) {
    return this.locationCache[this.camelize(location)];
  }

  private geoCodeLocation(location: string): Observable<any> {
    if(!this.geoCoder){
      this.geoCoder = new (<any>window).google.maps.Geocoder();
    }
    
    return new Observable((observer) => {
      this.geoCoder.geocode({address: location}, (result, status) => {
        if(status == 'OK'){
          const geometry = result[0].geometry.location;
          const coordinates = {lat: geometry.lat(), lng: geometry.lng()};
          this.cacheLocation(location, coordinates);
          observer.next({lat: geometry.lat(), lng: geometry.lng()});
        }else{
          observer.error("Location could not be geocoded");
        }
      });
    });
  }

  public getGeoLocation(location: string): Observable<any>{
    
    if(this.isLocationCached(location)) {
      // Return location from cache
     return of(this.locationCache[this.camelize(location)]);
    }else{      
        return this.geoCodeLocation(location);
      }
  }
}
