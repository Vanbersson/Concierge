import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleReportService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  filterVehicle(data: any): Observable<HttpResponse<VehicleEntry[]>> {
    return this.http.post<VehicleEntry[]>(environment.apiuUrl+"/reports/concierge/filter/vehicles", data, { headers: this.myHeaders(), observe: 'response' });
  }
  
  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }
}
