import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IVehicleEntry } from '../../interfaces/vehicle/iVehicleEntry';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private companyId = sessionStorage.getItem('companyId');
  private resaleId = sessionStorage.getItem('resaleId');
  private token = sessionStorage.getItem('token');
  private httpOptions = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.token
  });

  private urlBaseV1 = environment.URLBASE_V1;


  constructor(private http: HttpClient) { }

  entryAdd$(vehicle: any): Observable<any> {
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/add", vehicle, { headers: this.httpOptions, observe: 'response', responseType: 'text' });
  }

  entryList$(): Observable<any> {
    return this.http.get<IVehicleEntry>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/listEntry", { headers: this.httpOptions });
  }

  entryFilterId(id: number) {
    return this.http.get<IVehicleEntry>(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/filter/id/" + id, { headers: this.httpOptions });
  }

  entryAddAuth(auth: any){
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/add/authorization", auth, { headers: this.httpOptions, observe: 'response', responseType: 'text' });
  }

  entryDeleteAuth1(auth: any){
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/delete/authorization1", auth, { headers: this.httpOptions, observe: 'response', responseType: 'text' });
  }

  entryDeleteAuth2(auth: any){
    return this.http.post(this.urlBaseV1 + this.companyId + "/" + this.resaleId + "/vehicleEntry/delete/authorization2", auth, { headers: this.httpOptions, observe: 'response', responseType: 'text' });
  }





}
