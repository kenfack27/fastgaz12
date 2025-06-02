import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AdminStats } from '../model/Admin-stats';
import { Observable } from 'rxjs';
import { StoreOrderStats } from '../model/store-order-stats';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly apiUrl = environment.URL + '/admin';

  constructor(private http: HttpClient) { }

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  getStatsAll(createdAt: string): Observable<StoreOrderStats[]> {
    const params = new HttpParams().set('createdAt', createdAt);
    return this.http.get<StoreOrderStats[]>(`${this.apiUrl}/store-order-stats`, { params });
  }


}
