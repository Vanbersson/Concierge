import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

import { InterfaceUpdateStatus } from '../../../interfaces/Interface-update-status';
import { VehicleModel } from '../../../models/vehicle/vehicleModel';
import { IVehicleModel } from '../../../interfaces/vehicle/iVehicleModel';

@Injectable({
  providedIn: 'root'
})
export class VehicleModelService {

  private urlBaseV1 = environment.URLBASE_V1;

  companyId = sessionStorage.getItem('companyId');
  resaleId = sessionStorage.getItem('resaleId');


  constructor(private http: HttpClient) { }

  getAll$(): Observable<any> {

    return this.http.get<IVehicleModel>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicle/model/all");

  }

  getAllEnabled$(): Observable<any> {

    return this.http.get<IVehicleModel>(this.urlBaseV1 + this.companyId + "/" + this.resaleId+"/vehicle/model/all");

  }

  addModel$(model: any): Observable<any> {

    const token = '12345';

    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicle/model/add", model, { headers: httpOptions, observe: 'events' });

  }

  updateModel$(model: any): Observable<any> {
    const token = '12345';

    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post<VehicleModel>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicle/model/update", model, { headers: httpOptions, observe: 'events' });
  }

  updateStatus$(model: InterfaceUpdateStatus): Observable<any> {
    const token = '12345';

    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this.http.post<InterfaceUpdateStatus>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicle/model/update/status", model, { headers: httpOptions, observe: 'events' });
  }


}
