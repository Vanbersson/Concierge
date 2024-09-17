import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';


import { IModelStatus } from '../../interfaces/vehicle-model/imodel-status';
import { StorageService } from '../storage/storage.service';
import { ModelVehicle } from '../../models/vehicle-model/model-vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleModelService {

  constructor(private http: HttpClient, private storage: StorageService) {}

  getAll$(): Observable<ModelVehicle[]> {
    return this.http.get<ModelVehicle[]>(environment.apiuUrl + "/vehicle/model/all", { headers: this.myHeaders() });
  }

  getAllEnabled$(): Observable<ModelVehicle[]> {
    return this.http.get<ModelVehicle[]>(environment.apiuUrl + "/vehicle/model/all/enabled", { headers: this.myHeaders() });
  }

  addModel$(model: ModelVehicle): Observable<HttpResponse<ModelVehicle>> {
    return this.http.post<ModelVehicle>(environment.apiuUrl + "/vehicle/model/save", model, { headers: this.myHeaders(), observe: 'response' });
  }

  updateModel$(model: ModelVehicle): Observable<HttpResponse<ModelVehicle>> {
    return this.http.post<ModelVehicle>(environment.apiuUrl + "/vehicle/model/update", model, { headers: this.myHeaders(), observe: 'response' });
  }

  updateStatus$(id: IModelStatus): Observable<HttpResponse<IModelStatus>> {
    return this.http.post<IModelStatus>(environment.apiuUrl + "/vehicle/model/update/status", id, { headers: this.myHeaders(), observe: 'response' });
  }

  private myHeaders(): HttpHeaders {
    const httpOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.storage.token,
    });
    return httpOptions;
  }


}
