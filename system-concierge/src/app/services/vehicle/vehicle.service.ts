import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IVehicleEntry } from '../../interfaces/vehicle/iVehicleEntry';
import { LayoutService } from '../../layouts/layout/service/layout.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private companyId = this.layoutService.loginUser.companyId;
  private resaleId = this.layoutService.loginUser.resaleId;
  private token = localStorage.getItem('token');
  private httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.token
  });

  private urlBaseV1 = environment.URLBASE_V1;


  constructor(private http: HttpClient, private layoutService: LayoutService,) { }

  entrySave$(vehicle: any): Observable<any> {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/save", vehicle, { headers: this.httpOptions, observe: 'response', responseType: 'text' });
  }

  entryUpdate$(vehicle: any): Observable<any> {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/update", vehicle, { headers: this.httpOptions, observe: 'response', responseType: 'json' });
  }

  entryList$(): Observable<any> {
    return this.http.get<IVehicleEntry>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/listEntry", { headers: this.httpOptions });
  }

  entryFilterId(id: number) {
    return this.http.get<IVehicleEntry>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/filter/id/" + id, { headers: this.httpOptions });
  }

  entryAddAuth(auth: any) {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/add/authorization", auth, { headers: this.httpOptions, observe: 'response', responseType: 'text' });
  }

  entryDeleteAuth1(auth: any) {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/delete/authorization1", auth, { headers: this.httpOptions, observe: 'response', responseType: 'text' });
  }

  entryDeleteAuth2(auth: any) {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/delete/authorization2", auth, { headers: this.httpOptions, observe: 'response', responseType: 'text' });
  }





}
