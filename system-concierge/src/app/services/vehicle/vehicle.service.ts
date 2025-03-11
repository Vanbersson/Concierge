import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';

//class
import { VehicleEntry } from '../../models/vehicle/vehicle-entry';
import { VehicleEntryAuth } from '../../models/vehicle/vehicle-entry-auth';
import { VehicleExit } from '../../models/vehicle/vehicle-exit';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient, private storage: StorageService) { }

  entrySave$(vehicle: VehicleEntry): Observable<HttpResponse<VehicleEntry>> {
    return this.http.post<VehicleEntry>(environment.apiuUrl + "/vehicle/entry/save", vehicle, { headers: this.myHeaders(), observe: 'response' });
  }

  entryUpdate(vehicle: VehicleEntry): Observable<HttpResponse<VehicleEntry>> {
    return this.http.post<VehicleEntry>(environment.apiuUrl + "/vehicle/entry/update", vehicle, { headers: this.myHeaders(), observe: 'response' });
  }

  entryExit$(vehicle: VehicleExit): Observable<HttpResponse<VehicleExit>> {
    return this.http.post<VehicleExit>(environment.apiuUrl + "/vehicle/entry/exit", vehicle, { headers: this.myHeaders(), observe: 'response' });
  }

  allAuthorized$(): Observable<VehicleEntry[]> {
    return this.http.get<VehicleEntry[]>(environment.apiuUrl + "/vehicle/entry/allAuthorized", { headers: this.myHeaders() });
  }

  allPendingAuthorization$(): Observable<VehicleEntry[]> {
    return this.http.get<VehicleEntry[]>(environment.apiuUrl + "/vehicle/entry/allPendingAuthorization", { headers: this.myHeaders() });
  }

  entryFilterId$(id: number): Observable<HttpResponse<VehicleEntry>> {
    return this.http.get<VehicleEntry>(environment.apiuUrl + "/vehicle/entry/filter/id/" + id, { headers: this.myHeaders(), observe: 'response' });
  }

  entryFilterPlaca$(placa: string): Observable<HttpResponse<VehicleEntry>> {
    return this.http.get<VehicleEntry>(environment.apiuUrl + "/vehicle/entry/filter/placa/" + placa, { headers: this.myHeaders(), observe: 'response' });
  }

  notExistsVehicle(placa: string) {
    return this.http.get(environment.apiuUrl + "/vehicle/entry/filter/notexists/placa/" + placa, { headers: this.myHeaders(), observe: 'response', responseType: 'text' });
  }



  /* Falta */
  entryAddAuth(auth: VehicleEntryAuth): Observable<HttpResponse<VehicleEntryAuth>> {
    return this.http.post<VehicleEntryAuth>(environment.apiuUrl + "/vehicle/entry/authorization/add", auth, { headers: this.myHeaders(), observe: 'response' });
  }

  entryDeleteAuth1(auth: VehicleEntryAuth): Observable<HttpResponse<VehicleEntryAuth>> {
    return this.http.post<VehicleEntryAuth>(environment.apiuUrl + "/vehicle/entry/authorization/delete1", auth, { headers: this.myHeaders(), observe: 'response' });
  }

  entryDeleteAuth2(auth: VehicleEntryAuth): Observable<HttpResponse<VehicleEntryAuth>> {
    return this.http.post<VehicleEntryAuth>(environment.apiuUrl + "/vehicle/entry/authorization/delete2", auth, { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }

}
