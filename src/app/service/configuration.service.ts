import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment.development';
import { Configuration } from '../model/configuration';
import { CustomResponse } from '../model/custom-response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private readonly apiUrl = environment.URL + '/configuration';
  constructor(private http: HttpClient) { }

  // Fonction pour charger la configuration
  getConfiguration$ = () => <Observable<CustomResponse>>
    this.http.get<any>(this.apiUrl).pipe(
     
    );

  updateConfiguration(configuration: Configuration): Observable<CustomResponse> {
    return this.http.put<any>(this.apiUrl, configuration);
  }
}
