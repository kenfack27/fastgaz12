import { Injectable } from '@angular/core';
import { Store } from '../model/store';
import { StoreDistance } from '../model/utils/store-distance';
import { CustomerLocation } from '../model/utils/customer-location';
import { Delivery } from '../model/delivery';
import { DeliveryDistance } from '../model/utils/delivery-distance';

@Injectable({
  providedIn: 'root'
})
export class HaversineCalculatorService {


  private readonly EARTH_RADIUS = 6371; // Earth's radius in kilometers

  private toRadian(degree: number): number {
    return degree * Math.PI / 180;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = this.toRadian(lat2 - lat1);
    const dLon = this.toRadian(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadian(lat1)) * Math.cos(this.toRadian(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS * c;
  }

  findNearestStore(userLocation: CustomerLocation, stores: Store[]): StoreDistance {
    if (!stores.length) {
      throw new Error('No stores provided');
    }

    return stores
      .map(store => ({
        store,
        distance: this.calculateDistance(
          userLocation.lat,
          userLocation.lng,
          store.latitude,
          store.longitude,
        )
      }))
      .reduce((nearest, current) =>
        current.distance < nearest.distance ? current : nearest
      );
  }


  findNearestDelivry(userLocation: CustomerLocation, deliveries: Delivery[]): DeliveryDistance {
    console.log('Deliveries listted:');
    console.log(deliveries);
    
    // / If deliveries is empty or undefined, return null
    if ( deliveries.length === 0) {
      return null;
    }

    return deliveries
      .map(delivery => ({
        delivery,
        distance: this.calculateDistance(
          userLocation.lat,
          userLocation.lng,
          delivery.latitude,
          delivery.longitude,
        )
      }))
      .reduce((nearest, current) =>
        current.distance < nearest.distance ? current : nearest
      );
  }
}
