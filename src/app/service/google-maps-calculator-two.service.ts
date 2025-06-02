import { Injectable } from '@angular/core';
import { StoreDistance } from '../model/utils/store-distance';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '../model/store';
import { map } from 'rxjs/internal/operators/map';
import { from, catchError } from 'rxjs';
import { CustomerLocation } from '../model/utils/customer-location';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsCalculatorTwoService {

  constructor() { }

  // Cache to avoid duplicate calculations
  private distanceCache: Map<string, StoreDistance[]> = new Map();
  
  /**
   * Calculate distances to all stores and sort by distance
   * @param userLocation User's location
   * @param stores Array of store locations
   * @returns Observable with sorted array of store distances
   */
  calculateAllDistances(userLocation: CustomerLocation, stores: Store[]): Observable<StoreDistance[]> {
    if (!stores || stores.length === 0) {
      return from([]);
    }
    
    // Create a cache key
    const cacheKey = `${userLocation.lat.toFixed(6)},${userLocation.lng.toFixed(6)}|${stores.map(s => s.id).join(',')}`;
    
    // Check if we have cached results
    const cachedResult = this.distanceCache.get(cacheKey);
    if (cachedResult) {
      console.log('Using cached distance results');
      return from([cachedResult]);
    }
    
    // Log the user location to verify it's being used correctly
    console.log('Calculating distances from user location:', userLocation);
    
    // No cached results, perform the calculation
    return from(new Promise<StoreDistance[]>((resolve, reject) => {
      const service = new google.maps.DistanceMatrixService();
      
      // Create LatLng object from user coordinates
      const origin = new google.maps.LatLng(userLocation.lat, userLocation.lng);
      
      // Create LatLng objects for each store
      const destinations = stores.map(store => 
        new google.maps.LatLng(store.latitude, store.longitude)
      );
      
      // Log the actual origins and destinations being sent to the API
      console.log('Origin:', origin.toString());
      console.log('Destinations:', destinations.map(d => d.toString()));
      
      const request = {
        origins: [origin],
        destinations: destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };
      
      service.getDistanceMatrix(request, (response, status) => {
        console.log('Google Maps API Response:', response);
        console.log('Google Maps API Status:', status);
        
        if (status === 'OK' && response && 
            response.rows && response.rows.length > 0 && 
            response.rows[0].elements && response.rows[0].elements.length === stores.length) {
          
          // Log origin addresses from response to verify correct location was used
          console.log('Origin addresses from API response:', response.originAddresses);
          
          const results = response.rows[0].elements;
          const storeDistances: StoreDistance[] = [];
          
          for (let i = 0; i < stores.length; i++) {
            if (results[i].status === 'OK') {
              storeDistances.push({
                store: stores[i],
                distance: results[i].distance.value / 1000, // Convert to kilometers
                duration: results[i].duration.value // Duration in seconds
              });
            } else {
              console.warn(`Could not calculate distance to store ${stores[i].id}: ${results[i].status}`);
            }
          }
          
          // Sort by distance (ascending)
          const sortedDistances = storeDistances.sort((a, b) => a.distance - b.distance);
          
          // Cache the results
          this.distanceCache.set(cacheKey, sortedDistances);
          
          // Logging to verify correct sorting
          console.log('Sorted store distances:', 
            sortedDistances.map(sd => `${sd.store.name}: ${sd.distance.toFixed(2)}km`)
          );
          
          resolve(sortedDistances);
        } else {
          console.error('Distance Matrix API error:', status, response);
          reject(new Error(`Failed to calculate distances: ${status}`));
        }
      });
    })).pipe(
      catchError(error => {
        console.error('Error in distance calculation:', error);
        throw error;
      })
    );
  }
  
  /**
   * Find nearest store using Google Maps Distance Matrix API
   * @param userLocation User's location
   * @param stores Array of store locations
   * @returns Observable with the nearest store
   */
  findNearestStore(userLocation: CustomerLocation, stores: Store[]): Observable<StoreDistance> {
    return this.calculateAllDistances(userLocation, stores).pipe(
      map(storeDistances => {
        if (storeDistances.length === 0) {
          throw new Error('No stores found');
        }
        
        // Find the store with the minimum distance
        return storeDistances.reduce((nearest, current) => 
          current.distance < nearest.distance ? current : nearest
        );
      })
    );
  }
  
  /**
   * Clear the distance cache
   */
  clearCache(): void {
    this.distanceCache.clear();
  }
}
