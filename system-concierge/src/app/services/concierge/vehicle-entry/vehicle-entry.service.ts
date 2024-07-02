import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleEntry } from '../../../models/vehicle/vehicleEntry';

@Injectable({
  providedIn: 'root'
})
export class VehicleEntryService {

  private urlBaseV1 = environment.URLBASE_V1;

  constructor(private http: HttpClient) { }

  getAll$(): Observable<VehicleEntry[]> {

    return this.http.get<VehicleEntry[]>(this.urlBaseV1);
  }
}
