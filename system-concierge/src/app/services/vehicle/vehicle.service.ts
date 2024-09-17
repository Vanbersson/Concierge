import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

//class
import { VehicleEntry } from '../../models/vehicle/vehicle-entry';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  entrySave$(vehicle: VehicleEntry): Observable<HttpResponse<VehicleEntry>> {
    return this.http.post<VehicleEntry>(environment.apiuUrl + "/vehicle/entry/save", vehicle, { headers: this.myHeaders(), observe: 'response' });
  }

  entryUpdate$(vehicle: VehicleEntry): Observable<HttpResponse<VehicleEntry>> {
    return this.http.post<VehicleEntry>(environment.apiuUrl + "/vehicle/entry/update", vehicle, { headers: this.myHeaders(), observe: 'response' });
  }

  entryList$(): Observable<VehicleEntry[]> {
    return this.http.get<VehicleEntry[]>(environment.apiuUrl + "/vehicle/entry/all", { headers: this.myHeaders() });
  }

  entryFilterId$(id: number): Observable<HttpResponse<VehicleEntry>> {
    return this.http.get<VehicleEntry>(environment.apiuUrl + "/vehicle/entry/filter/id/" + id, { headers: this.myHeaders(), observe: 'response' });
  }

  entryFilterPlaca$(placa: string): Observable<HttpResponse<VehicleEntry>> {
    return this.http.get<VehicleEntry>(environment.apiuUrl + "/vehicle/entry/filter/placa/" + placa, { headers: this.myHeaders(), observe: 'response' });
  }



  /* Falta */
  entryAddAuth(auth: any) {
    return this.http.post(environment.apiuUrl + "/vehicleEntry/add/authorization", auth, { headers: this.myHeaders(), observe: 'response', responseType: 'text' });
  }

  entryDeleteAuth1(auth: any) {
    return this.http.post(environment.apiuUrl + "/vehicleEntry/delete/authorization1", auth, { headers: this.myHeaders(), observe: 'response', responseType: 'text' });
  }

  entryDeleteAuth2(auth: any) {
    return this.http.post(environment.apiuUrl + "/vehicleEntry/delete/authorization2", auth, { headers: this.myHeaders(), observe: 'response', responseType: 'text' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }





}
